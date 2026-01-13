import { UserPlus, FileSpreadsheet, XCircle } from 'lucide-react';

const AddSubscriberSection = ({
  showAddForm,
  setShowAddForm,
  newSubscriber,
  setNewSubscriber,
  addingSubscriber,
  csvParseError,
  handleAddSubscriber,
  handleCsvFileSelect
}) => {
  return (
    <div className="add-subscriber-section">
      <div className="add-subscriber-header">
        <h3 className="section-title">Add New Subscriber</h3>
        <div className="add-subscriber-buttons">
          <button 
            className="btn btn-toggle-form"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <UserPlus size={18} />
            {showAddForm ? 'Cancel' : 'Add Single'}
          </button>
          <label className="btn btn-csv-upload">
            <FileSpreadsheet size={18} />
            Import CSV
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleCsvFileSelect}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      {csvParseError && (
        <div className="csv-error-message">
          <XCircle size={16} />
          {csvParseError}
        </div>
      )}
      
      {showAddForm && (
        <form className="add-subscriber-form" onSubmit={handleAddSubscriber}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="new_subscriber_name">Name</label>
              <input
                id="new_subscriber_name"
                type="text"
                value={newSubscriber.name}
                onChange={(e) => setNewSubscriber(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter subscriber name (optional)"
                className="form-input"
                disabled={addingSubscriber}
              />
            </div>
            <div className="form-group">
              <label htmlFor="new_subscriber_email">Email *</label>
              <input
                id="new_subscriber_email"
                type="email"
                value={newSubscriber.email}
                onChange={(e) => setNewSubscriber(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter subscriber email"
                className="form-input"
                disabled={addingSubscriber}
                required
              />
            </div>
            <div className="form-group form-group-checkbox">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={newSubscriber.is_active}
                  onChange={(e) => setNewSubscriber(prev => ({ ...prev, is_active: e.target.checked }))}
                  disabled={addingSubscriber}
                  className="form-checkbox"
                />
                Active
              </label>
            </div>
          </div>
          <button 
            type="submit" 
            className="btn btn-primary add-subscriber-btn"
            disabled={addingSubscriber || !newSubscriber.email.trim()}
          >
            {addingSubscriber ? 'Adding...' : 'Add Subscriber'}
          </button>
        </form>
      )}

      <div className="csv-format-hint">
        <small>
          <strong>CSV Format:</strong> The CSV file should have columns: <code>name, email, active</code> (active can be true/false, yes/no, or 1/0)
        </small>
      </div>
    </div>
  );
};

export default AddSubscriberSection;
