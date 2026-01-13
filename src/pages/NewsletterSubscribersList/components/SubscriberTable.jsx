import { Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const SubscriberTable = ({
  loading,
  error,
  filteredSubscribers,
  paginatedSubscribers,
  selectedSubscribers,
  subscriberStatuses,
  isAllSelected,
  hasChanges,
  saving,
  searchTerm,
  filterActive,
  currentPage,
  totalPages,
  itemsPerPage,
  startIndex,
  endIndex,
  setSearchTerm,
  setFilterActive,
  setCurrentPage,
  setItemsPerPage,
  handleSelectAll,
  handleSelectSubscriber,
  handleStatusChange,
  handleDeleteSingle,
  handleSaveStatuses,
  fetchSubscribers
}) => {
  return (
    <>
      {/* Filters and Search */}
      <div className="subscribers-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-container">
          <label className="filter-label">
            <input
              type="checkbox"
              checked={filterActive}
              onChange={(e) => setFilterActive(e.target.checked)}
              className="filter-checkbox"
            />
            Show only active subscribers
          </label>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading subscribers...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-state">
          <p>Error loading subscribers: {error}</p>
          <button onClick={fetchSubscribers} className="retry-button">
            Retry
          </button>
        </div>
      )}

      {/* Subscribers List */}
      {!loading && !error && (
        <div className="subscribers-list-container">
          {filteredSubscribers.length === 0 ? (
            <div className="empty-state">
              <p>No subscribers found.</p>
            </div>
          ) : (
            <>
              {/* Table info bar */}
              <div className="table-info-bar">
                <span className="showing-info">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredSubscribers.length)} of {filteredSubscribers.length} subscribers
                </span>
                <div className="items-per-page">
                  <label htmlFor="items-per-page">Show:</label>
                  <select
                    id="items-per-page"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="items-per-page-select"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              <div className="subscribers-table">
                <div className="table-header">
                  <div className="table-cell header-cell checkbox-cell">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      className="header-checkbox"
                      title="Select all"
                    />
                  </div>
                  <div className="table-cell header-cell">Active</div>
                  <div className="table-cell header-cell">Name</div>
                  <div className="table-cell header-cell">Email</div>
                  <div className="table-cell header-cell">Date Joined</div>
                  <div className="table-cell header-cell">Status</div>
                  <div className="table-cell header-cell">Actions</div>
                </div>
                {paginatedSubscribers
                  .filter(sub => sub && sub.id && sub.email && sub.email.trim() !== '')
                  .map((subscriber) => {
                    const isActive = subscriberStatuses[subscriber.id] === true || 
                      (subscriberStatuses[subscriber.id] === undefined && subscriber.is_active === true);
                    
                    return (
                      <div key={subscriber.id} className="table-row">
                        <div className="table-cell checkbox-cell">
                          <input
                            type="checkbox"
                            checked={selectedSubscribers.has(subscriber.id)}
                            onChange={(e) => handleSelectSubscriber(subscriber.id, e.target.checked)}
                            className="subscriber-checkbox"
                          />
                        </div>
                        <div className="table-cell checkbox-cell">
                          <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) => handleStatusChange(subscriber.id, e.target.checked)}
                            className="subscriber-checkbox"
                          />
                        </div>
                        <div className="table-cell name-cell">
                          {subscriber.name || 'N/A'}
                        </div>
                        <div className="table-cell email-cell">
                          <a href={`mailto:${subscriber.email}`} className="email-link">
                            {subscriber.email}
                          </a>
                        </div>
                        <div className="table-cell date-cell">
                          {formatDate(subscriber.date_joined)}
                        </div>
                        <div className="table-cell status-cell">
                          <span className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
                            {isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="table-cell actions-cell">
                          <button
                            className="btn-delete-single"
                            onClick={() => handleDeleteSingle(subscriber.id)}
                            title="Delete subscriber"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="pagination-controls">
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    title="First page"
                  >
                    ««
                  </button>
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    title="Previous page"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  
                  <div className="pagination-pages">
                    {(() => {
                      const pages = [];
                      const maxVisiblePages = 5;
                      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                      
                      if (endPage - startPage + 1 < maxVisiblePages) {
                        startPage = Math.max(1, endPage - maxVisiblePages + 1);
                      }

                      if (startPage > 1) {
                        pages.push(
                          <button
                            key={1}
                            className={`pagination-page ${currentPage === 1 ? 'active' : ''}`}
                            onClick={() => setCurrentPage(1)}
                          >
                            1
                          </button>
                        );
                        if (startPage > 2) {
                          pages.push(<span key="ellipsis-start" className="pagination-ellipsis">...</span>);
                        }
                      }

                      for (let i = startPage; i <= endPage; i++) {
                        if (i === 1 && startPage > 1) continue;
                        if (i === totalPages && endPage < totalPages) continue;
                        pages.push(
                          <button
                            key={i}
                            className={`pagination-page ${currentPage === i ? 'active' : ''}`}
                            onClick={() => setCurrentPage(i)}
                          >
                            {i}
                          </button>
                        );
                      }

                      if (endPage < totalPages) {
                        if (endPage < totalPages - 1) {
                          pages.push(<span key="ellipsis-end" className="pagination-ellipsis">...</span>);
                        }
                        pages.push(
                          <button
                            key={totalPages}
                            className={`pagination-page ${currentPage === totalPages ? 'active' : ''}`}
                            onClick={() => setCurrentPage(totalPages)}
                          >
                            {totalPages}
                          </button>
                        );
                      }

                      return pages;
                    })()}
                  </div>

                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    title="Next page"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    title="Last page"
                  >
                    »»
                  </button>
                </div>
              )}
              
              {hasChanges && (
                <div className="save-status-section">
                  <button 
                    onClick={handleSaveStatuses} 
                    className="btn btn-primary save-status-btn"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default SubscriberTable;
