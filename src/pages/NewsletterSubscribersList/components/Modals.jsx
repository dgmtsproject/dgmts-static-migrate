import { X, FileSpreadsheet, FileText, Check, XCircle } from 'lucide-react';

// Delete Confirmation Modal
export const DeleteConfirmModal = ({ 
  selectedCount, 
  deleting, 
  onClose, 
  onConfirm 
}) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h3>Confirm Delete</h3>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      <div className="modal-body">
        <p>Are you sure you want to delete {selectedCount} subscriber(s)?</p>
        <p className="warning-text">This action cannot be undone.</p>
      </div>
      <div className="modal-footer">
        <button 
          className="btn btn-secondary-outline"
          onClick={onClose}
          disabled={deleting}
        >
          Cancel
        </button>
        <button 
          className="btn btn-danger"
          onClick={onConfirm}
          disabled={deleting}
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  </div>
);

// Group Create/Edit Modal
export const GroupModal = ({
  editingGroup,
  newGroupName,
  newGroupDescription,
  savingGroup,
  setNewGroupName,
  setNewGroupDescription,
  onClose,
  onSave
}) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content group-modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h3>{editingGroup ? 'Edit Group' : 'Create New Group'}</h3>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      <div className="modal-body">
        <div className="form-group">
          <label htmlFor="group_name">Group Name *</label>
          <input
            id="group_name"
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="Enter group name (e.g., VIP Clients, Monthly Updates)"
            className="form-input"
            disabled={savingGroup}
            autoFocus
          />
        </div>
        <div className="form-group">
          <label htmlFor="group_description">Description (Optional)</label>
          <textarea
            id="group_description"
            value={newGroupDescription}
            onChange={(e) => setNewGroupDescription(e.target.value)}
            placeholder="Enter a description for this group"
            className="form-textarea"
            rows={3}
            disabled={savingGroup}
          />
        </div>
      </div>
      <div className="modal-footer">
        <button 
          className="btn btn-secondary-outline"
          onClick={onClose}
          disabled={savingGroup}
        >
          Cancel
        </button>
        <button 
          className="btn btn-primary"
          onClick={onSave}
          disabled={savingGroup || !newGroupName.trim()}
        >
          {savingGroup ? 'Saving...' : (editingGroup ? 'Update Group' : 'Create Group')}
        </button>
      </div>
    </div>
  </div>
);

// Manage Group Members Modal
export const GroupMembersModal = ({
  managingGroup,
  subscribers,
  groupMemberSearch,
  pendingGroupMembers,
  savingGroupMembers,
  getGroupMemberIds,
  setGroupMemberSearch,
  handleToggleGroupMember,
  onClose,
  onSave
}) => {
  const currentMemberIds = getGroupMemberIds(managingGroup);
  const searchLower = groupMemberSearch.toLowerCase();
  
  const filteredSubscribers = subscribers
    .filter(sub => {
      if (!searchLower) return true;
      return (sub.name?.toLowerCase().includes(searchLower) || 
              sub.email.toLowerCase().includes(searchLower));
    })
    .sort((a, b) => {
      const nameA = (a.name || '').toLowerCase();
      const nameB = (b.name || '').toLowerCase();
      if (nameA !== nameB) return nameA.localeCompare(nameB);
      return a.email.toLowerCase().localeCompare(b.email.toLowerCase());
    });

  const toAdd = Array.from(pendingGroupMembers).filter(id => !currentMemberIds.has(id)).length;
  const toRemove = Array.from(currentMemberIds).filter(id => !pendingGroupMembers.has(id)).length;
  const hasChanges = toAdd > 0 || toRemove > 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content group-members-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Manage Members - {managingGroup.name}</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <div className="member-search">
            <input
              type="text"
              value={groupMemberSearch}
              onChange={(e) => setGroupMemberSearch(e.target.value)}
              placeholder="Search subscribers..."
              className="form-input"
            />
          </div>
          <div className="members-list">
            {filteredSubscribers.map(subscriber => {
              const isInPending = pendingGroupMembers.has(subscriber.id);
              const wasInGroup = currentMemberIds.has(subscriber.id);
              const memberChanged = isInPending !== wasInGroup;
              
              return (
                <div 
                  key={subscriber.id} 
                  className={`member-item ${isInPending ? 'in-group' : ''} ${memberChanged ? 'changed' : ''}`}
                  onClick={() => handleToggleGroupMember(subscriber.id)}
                >
                  <div className="member-info">
                    <span className="member-name">{subscriber.name || 'No Name'}</span>
                    <span className="member-email">{subscriber.email}</span>
                    {!subscriber.is_active && (
                      <span className="member-inactive-badge">Inactive</span>
                    )}
                  </div>
                  <div className="member-status">
                    <input
                      type="checkbox"
                      checked={isInPending}
                      onChange={() => {}}
                      className="member-checkbox"
                    />
                    {memberChanged && (
                      <span className="changed-indicator">●</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="members-summary">
            <span>{pendingGroupMembers.size} member(s) selected</span>
            {hasChanges && (
              <span className="changes-summary">
                ({toAdd > 0 ? `+${toAdd}` : ''}{toAdd > 0 && toRemove > 0 ? ', ' : ''}{toRemove > 0 ? `-${toRemove}` : ''})
              </span>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button 
            className="btn btn-secondary-outline"
            onClick={onClose}
            disabled={savingGroupMembers}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary"
            onClick={onSave}
            disabled={savingGroupMembers}
          >
            {savingGroupMembers ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

// CSV Import Preview Modal
export const CsvImportModal = ({
  csvFileName,
  csvData,
  csvGroupSelection,
  groups,
  importingCsv,
  setCsvGroupSelection,
  onClose,
  onImport
}) => {
  const validCount = csvData.filter(s => !s.isDuplicate).length;
  const duplicateCount = csvData.filter(s => s.isDuplicate).length;
  const activeCount = csvData.filter(s => !s.isDuplicate && s.is_active).length;
  const inactiveCount = csvData.filter(s => !s.isDuplicate && !s.is_active).length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content csv-preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <FileSpreadsheet size={22} />
            CSV Import Preview
          </h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <div className="csv-file-info">
            <FileText size={18} />
            <span className="csv-file-name">{csvFileName}</span>
            <span className="csv-subscribers-count">
              {csvData.length} subscriber(s) found
            </span>
          </div>

          <div className="csv-group-selection">
            <label htmlFor="csv_group_select">Add all imported subscribers to group (optional):</label>
            <select
              id="csv_group_select"
              value={csvGroupSelection}
              onChange={(e) => setCsvGroupSelection(e.target.value)}
              className="csv-group-select"
              disabled={importingCsv}
            >
              <option value="none">Don't add to any group</option>
              {groups.map(group => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
          </div>

          <div className="csv-import-stats">
            <div className="csv-stat">
              <span className="csv-stat-value csv-stat-new">{validCount}</span>
              <span className="csv-stat-label">New subscribers</span>
            </div>
            <div className="csv-stat">
              <span className="csv-stat-value csv-stat-duplicate">{duplicateCount}</span>
              <span className="csv-stat-label">Duplicates (will skip)</span>
            </div>
            <div className="csv-stat">
              <span className="csv-stat-value csv-stat-active">{activeCount}</span>
              <span className="csv-stat-label">Active</span>
            </div>
            <div className="csv-stat">
              <span className="csv-stat-value csv-stat-inactive">{inactiveCount}</span>
              <span className="csv-stat-label">Inactive</span>
            </div>
          </div>

          <div className="csv-preview-table-container">
            <table className="csv-preview-table">
              <thead>
                <tr>
                  <th>Row</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Active</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {csvData.map((subscriber, index) => (
                  <tr 
                    key={index} 
                    className={subscriber.isDuplicate ? 'csv-row-duplicate' : 'csv-row-new'}
                  >
                    <td className="csv-row-number">{subscriber.rowIndex}</td>
                    <td className="csv-name">{subscriber.name || <em>No name</em>}</td>
                    <td className="csv-email">{subscriber.email}</td>
                    <td className="csv-active">
                      <span className={`csv-active-badge ${subscriber.is_active ? 'active' : 'inactive'}`}>
                        {subscriber.is_active ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="csv-status">
                      {subscriber.isDuplicate ? (
                        <span className="csv-status-badge duplicate">
                          <XCircle size={14} />
                          Duplicate
                        </span>
                      ) : (
                        <span className="csv-status-badge new">
                          <Check size={14} />
                          Will import
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {duplicateCount > 0 && (
            <div className="csv-duplicate-warning">
              <XCircle size={16} />
              <span>{duplicateCount} duplicate email(s) found and will be skipped.</span>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button 
            className="btn btn-secondary-outline"
            onClick={onClose}
            disabled={importingCsv}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary"
            onClick={onImport}
            disabled={importingCsv || validCount === 0}
          >
            {importingCsv ? 'Importing...' : `Import ${validCount} Subscriber(s)`}
          </button>
        </div>
      </div>
    </div>
  );
};
