import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { checkAdminSession } from '../../utils/adminAuth';
import { ArrowLeft, Users, Calendar, CheckCircle, XCircle, Clock, Filter, Download, Search, Eye, UserCheck, UserX } from 'lucide-react';
import './PaymentPortalUsersPage.css';

function PaymentPortalUsersPage() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const isAuthenticated = checkAdminSession();
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }
    setLoggedIn(true);
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payment_portal_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching payment portal users:', error);
        return;
      }

      setUsers(data || []);
      setFilteredUsers(data || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search users
  useEffect(() => {
    let filtered = users;

    // Apply status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'approved') {
        filtered = filtered.filter(user => user.approved === true && user.denied === false);
      } else if (statusFilter === 'denied') {
        filtered = filtered.filter(user => user.denied === true);
      } else if (statusFilter === 'pending') {
        filtered = filtered.filter(user => user.approved === false && user.denied === false);
      }
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.phone?.toLowerCase().includes(term) ||
        user.dgmts_contact_person?.toLowerCase().includes(term)
      );
    }

    setFilteredUsers(filtered);
  }, [searchTerm, statusFilter, users]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getUserStatus = (user) => {
    if (user.approved === true && user.denied === false) {
      return { type: 'approved', label: 'Approved', icon: CheckCircle, color: '#28a745', bg: '#d4edda' };
    } else if (user.denied === true) {
      return { type: 'denied', label: 'Denied', icon: XCircle, color: '#dc3545', bg: '#f8d7da' };
    } else {
      return { type: 'pending', label: 'Pending', icon: Clock, color: '#ffc107', bg: '#fff3cd' };
    }
  };

  const getStatusBadge = (user) => {
    const status = getUserStatus(user);
    const Icon = status.icon;

    return (
      <span className="status-badge" style={{ backgroundColor: status.bg, color: status.color }}>
        <Icon size={16} />
        {status.label}
      </span>
    );
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const exportToCSV = () => {
    if (filteredUsers.length === 0) return;

    const headers = ['Date Created', 'Name', 'Email', 'Phone', 'Status', 'DGMTS Contact Person'];
    const rows = filteredUsers.map(u => {
      const status = getUserStatus(u);
      return [
        formatDate(u.created_at),
        u.name || '',
        u.email || '',
        u.phone || '',
        status.label,
        u.dgmts_contact_person || ''
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `payment_portal_users_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getStatsCounts = () => {
    const approved = users.filter(u => u.approved === true && u.denied === false).length;
    const denied = users.filter(u => u.denied === true).length;
    const pending = users.filter(u => u.approved === false && u.denied === false).length;
    return { approved, denied, pending, total: users.length };
  };

  const stats = getStatsCounts();

  if (!loggedIn) {
    return null;
  }

  return (
    <div className="payment-users-admin-page">
      <div className="payment-users-admin-container">
        {/* Header */}
        <div className="payment-users-header">
          <button onClick={() => navigate('/admin')} className="back-button">
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <h1>
            <Users size={32} />
            Payment Portal Users
          </h1>
          <p className="subtitle">Manage payment portal user approvals and access</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card" style={{ '--stat-color': '#28a745' }}>
            <div className="stat-icon">
              <UserCheck size={24} />
            </div>
            <div className="stat-content">
              <h3>Approved</h3>
              <p className="stat-value">{stats.approved}</p>
              <span className="stat-label">Active Users</span>
            </div>
          </div>

          <div className="stat-card" style={{ '--stat-color': '#dc3545' }}>
            <div className="stat-icon">
              <UserX size={24} />
            </div>
            <div className="stat-content">
              <h3>Denied</h3>
              <p className="stat-value">{stats.denied}</p>
              <span className="stat-label">Blocked Users</span>
            </div>
          </div>

          <div className="stat-card" style={{ '--stat-color': '#ffc107' }}>
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <h3>Pending</h3>
              <p className="stat-value">{stats.pending}</p>
              <span className="stat-label">Awaiting Approval</span>
            </div>
          </div>

          <div className="stat-card" style={{ '--stat-color': '#4a90e2' }}>
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <h3>Total Users</h3>
              <p className="stat-value">{stats.total}</p>
              <span className="stat-label">All Registrations</span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="filters-section">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by name, email, phone, or contact person..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-controls">
            <div className="filter-group">
              <Filter size={18} />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="denied">Denied</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <button className="export-button" onClick={exportToCSV}>
              <Download size={18} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state">
            <Users size={64} color="#ccc" />
            <h3>No Users Found</h3>
            <p>There are no users matching your filters.</p>
          </div>
        ) : (
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Registration Date (EST)</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>DGMTS Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="date-cell">
                        <Calendar size={16} />
                        {formatDate(user.created_at)}
                      </div>
                    </td>
                    <td className="name-cell">{user.name}</td>
                    <td className="email-cell">{user.email}</td>
                    <td className="phone-cell">{user.phone}</td>
                    <td>{getStatusBadge(user)}</td>
                    <td className="contact-cell">{user.dgmts_contact_person || 'N/A'}</td>
                    <td>
                      <button
                        className="view-details-button"
                        onClick={() => handleViewDetails(user)}
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
        {showDetailsModal && selectedUser && (
          <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>User Details</h2>
                <button className="modal-close" onClick={() => setShowDetailsModal(false)}>
                  ×
                </button>
              </div>

              <div className="modal-body">
                <div className="detail-section">
                  <h3>User Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Name</label>
                      <p>{selectedUser.name}</p>
                    </div>
                    <div className="detail-item">
                      <label>Email</label>
                      <p>{selectedUser.email}</p>
                    </div>
                    <div className="detail-item">
                      <label>Phone</label>
                      <p>{selectedUser.phone}</p>
                    </div>
                    <div className="detail-item">
                      <label>Status</label>
                      <p>{getStatusBadge(selectedUser)}</p>
                    </div>
                    <div className="detail-item full-width">
                      <label>DGMTS Contact Person</label>
                      <p>{selectedUser.dgmts_contact_person || 'N/A'}</p>
                    </div>
                    <div className="detail-item">
                      <label>Password Set</label>
                      <p>{selectedUser.password ? '✓ Yes' : '❌ No'}</p>
                    </div>
                    <div className="detail-item">
                      <label>Registration Date (EST)</label>
                      <p>{formatDate(selectedUser.created_at)}</p>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Access Status Details</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Approved</label>
                      <p className={selectedUser.approved ? 'status-yes' : 'status-no'}>
                        {selectedUser.approved ? '✓ Yes' : '✗ No'}
                      </p>
                    </div>
                    <div className="detail-item">
                      <label>Denied</label>
                      <p className={selectedUser.denied ? 'status-no' : 'status-yes'}>
                        {selectedUser.denied ? '✗ Yes' : '✓ No'}
                      </p>
                    </div>
                    <div className="detail-item full-width">
                      <label>Can Login</label>
                      <p className={selectedUser.approved && !selectedUser.denied ? 'status-yes' : 'status-no'}>
                        {selectedUser.approved && !selectedUser.denied ? '✓ Yes, user can access the payment portal' : '✗ No, user cannot access the payment portal'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentPortalUsersPage;
