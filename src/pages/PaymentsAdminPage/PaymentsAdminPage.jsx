import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { checkAdminSession } from '../../utils/adminAuth';
import { ArrowLeft, DollarSign, Calendar, CreditCard, CheckCircle, XCircle, Filter, Download, Search, Eye } from 'lucide-react';
import './PaymentsAdminPage.css';

function PaymentsAdminPage() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const isAuthenticated = checkAdminSession();
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }
    setLoggedIn(true);
    fetchPayments();
  }, [navigate]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      // Fetch only PROD environment payments, ordered by created_at descending
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('environment_type', 'PROD')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching payments:', error);
        return;
      }

      setPayments(data || []);
      setFilteredPayments(data || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search payments
  useEffect(() => {
    let filtered = payments;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(payment =>
        payment.customer_name?.toLowerCase().includes(term) ||
        payment.customer_email?.toLowerCase().includes(term) ||
        payment.invoice_no?.toLowerCase().includes(term) ||
        payment.transaction_id?.toLowerCase().includes(term)
      );
    }

    setFilteredPayments(filtered);
  }, [searchTerm, statusFilter, payments]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      timeZone: 'America/New_York', // Display in EST (Georgia, USA)
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatCurrency = (amount) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return '$0.00';
    return `$${num.toFixed(2)}`;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      success: { icon: CheckCircle, color: '#28a745', bg: '#d4edda', text: 'Success' },
      completed: { icon: CheckCircle, color: '#28a745', bg: '#d4edda', text: 'Completed' },
      failed: { icon: XCircle, color: '#dc3545', bg: '#f8d7da', text: 'Failed' },
      processing: { icon: CreditCard, color: '#ffc107', bg: '#fff3cd', text: 'Processing' },
      pending: { icon: CreditCard, color: '#6c757d', bg: '#e9ecef', text: 'Pending' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className="status-badge" style={{ backgroundColor: config.bg, color: config.color }}>
        <Icon size={16} />
        {config.text}
      </span>
    );
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setShowDetailsModal(true);
  };

  const exportToCSV = () => {
    if (filteredPayments.length === 0) return;

    const headers = ['Date', 'Customer Name', 'Email', 'Invoice No', 'Amount', 'Transaction ID', 'Status', 'Payment Method'];
    const rows = filteredPayments.map(p => [
      formatDate(p.created_at),
      p.customer_name || '',
      p.customer_email || '',
      p.invoice_no || '',
      p.amount || '',
      p.transaction_id || '',
      p.status || '',
      p.payment_method || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `payments_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const calculateTotalRevenue = () => {
    return filteredPayments
      .filter(p => p.status === 'success' || p.status === 'completed')
      .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
  };

  if (!loggedIn) {
    return null;
  }

  return (
    <div className="payments-admin-page">
      <div className="payments-admin-container">
        {/* Header */}
        <div className="payments-header">
          <button onClick={() => navigate('/admin')} className="back-button">
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <h1>
            <DollarSign size={32} />
            Payments Management
          </h1>
          <p className="subtitle">View and manage production environment payments</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card" style={{ '--stat-color': '#4a90e2' }}>
            <div className="stat-icon">
              <DollarSign size={24} />
            </div>
            <div className="stat-content">
              <h3>Total Revenue</h3>
              <p className="stat-value">{formatCurrency(calculateTotalRevenue())}</p>
              <span className="stat-label">Successful Payments</span>
            </div>
          </div>

          <div className="stat-card" style={{ '--stat-color': '#28a745' }}>
            <div className="stat-icon">
              <CheckCircle size={24} />
            </div>
            <div className="stat-content">
              <h3>Successful</h3>
              <p className="stat-value">
                {payments.filter(p => p.status === 'success' || p.status === 'completed').length}
              </p>
              <span className="stat-label">Completed Transactions</span>
            </div>
          </div>

          <div className="stat-card" style={{ '--stat-color': '#dc3545' }}>
            <div className="stat-icon">
              <XCircle size={24} />
            </div>
            <div className="stat-content">
              <h3>Failed</h3>
              <p className="stat-value">
                {payments.filter(p => p.status === 'failed').length}
              </p>
              <span className="stat-label">Failed Transactions</span>
            </div>
          </div>

          <div className="stat-card" style={{ '--stat-color': '#6c757d' }}>
            <div className="stat-icon">
              <CreditCard size={24} />
            </div>
            <div className="stat-content">
              <h3>Total Payments</h3>
              <p className="stat-value">{payments.length}</p>
              <span className="stat-label">All Transactions</span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="filters-section">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by name, email, invoice, or transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-controls">
            <div className="filter-group">
              <Filter size={18} />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="processing">Processing</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <button className="export-button" onClick={exportToCSV}>
              <Download size={18} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Payments Table */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading payments...</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="empty-state">
            <DollarSign size={64} color="#ccc" />
            <h3>No Payments Found</h3>
            <p>There are no payments matching your filters.</p>
          </div>
        ) : (
          <div className="payments-table-container">
            <table className="payments-table">
              <thead>
                <tr>
                  <th>Date & Time (EST)</th>
                  <th>Customer</th>
                  <th>Invoice No</th>
                  <th>Amount</th>
                  <th>Transaction ID</th>
                  <th>Status</th>
                  <th>Method</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td>
                      <div className="date-cell">
                        <Calendar size={16} />
                        {formatDate(payment.created_at)}
                      </div>
                    </td>
                    <td>
                      <div className="customer-cell">
                        <strong>{payment.customer_name}</strong>
                        <span className="customer-email">{payment.customer_email}</span>
                      </div>
                    </td>
                    <td className="invoice-cell">{payment.invoice_no}</td>
                    <td className="amount-cell">{formatCurrency(payment.amount)}</td>
                    <td className="transaction-cell">{payment.transaction_id || 'N/A'}</td>
                    <td>{getStatusBadge(payment.status)}</td>
                    <td className="method-cell">{payment.payment_method}</td>
                    <td>
                      <button
                        className="view-details-button"
                        onClick={() => handleViewDetails(payment)}
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedPayment && (
          <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Payment Details</h2>
                <button className="modal-close" onClick={() => setShowDetailsModal(false)}>
                  ×
                </button>
              </div>

              <div className="modal-body">
                <div className="detail-section">
                  <h3>Customer Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Name</label>
                      <p>{selectedPayment.customer_name}</p>
                    </div>
                    <div className="detail-item">
                      <label>Email</label>
                      <p>{selectedPayment.customer_email}</p>
                    </div>
                    <div className="detail-item full-width">
                      <label>Address</label>
                      <p>{selectedPayment.customer_address}</p>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Payment Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Invoice No</label>
                      <p>{selectedPayment.invoice_no}</p>
                    </div>
                    <div className="detail-item">
                      <label>Amount</label>
                      <p className="amount-highlight">{formatCurrency(selectedPayment.amount)}</p>
                    </div>
                    <div className="detail-item">
                      <label>Transaction ID</label>
                      <p>{selectedPayment.transaction_id || 'N/A'}</p>
                    </div>
                    <div className="detail-item">
                      <label>Payment Method</label>
                      <p>{selectedPayment.payment_method}</p>
                    </div>
                    <div className="detail-item">
                      <label>Status</label>
                      <p>{getStatusBadge(selectedPayment.status)}</p>
                    </div>
                    <div className="detail-item">
                      <label>Payment Date & Time (EST)</label>
                      <p>{formatDate(selectedPayment.created_at)}</p>
                    </div>
                    {selectedPayment.payment_note && (
                      <div className="detail-item full-width">
                        <label>Payment Note / Description</label>
                        <p>{selectedPayment.payment_note}</p>
                      </div>
                    )}
                    {selectedPayment.notes && (
                      <div className="detail-item full-width">
                        <label>Additional Notes</label>
                        <p>{selectedPayment.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedPayment.response && (
                  <div className="detail-section">
                    <h3>Payment Response</h3>
                    <div className="response-box">
                      <pre>{JSON.stringify(JSON.parse(selectedPayment.response), null, 2)}</pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentsAdminPage;
