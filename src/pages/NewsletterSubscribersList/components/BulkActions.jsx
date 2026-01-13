import { Trash2 } from 'lucide-react';

const BulkActions = ({
  selectedSubscribers,
  groups,
  onAddToGroup,
  onDeleteSelected,
  onClearSelection
}) => {
  if (selectedSubscribers.size === 0) return null;

  return (
    <div className="bulk-actions-section">
      <div className="bulk-actions-info">
        <span className="selected-count">{selectedSubscribers.size} subscriber(s) selected</span>
      </div>
      <div className="bulk-actions-buttons">
        {groups.length > 0 && (
          <div className="add-to-group-dropdown">
            <select 
              onChange={(e) => {
                if (e.target.value) {
                  onAddToGroup(e.target.value);
                  e.target.value = '';
                }
              }}
              className="group-select"
            >
              <option value="">Add to group...</option>
              {groups.map(group => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
          </div>
        )}
        <button
          className="btn btn-danger"
          onClick={onDeleteSelected}
        >
          <Trash2 size={16} />
          Delete Selected
        </button>
        <button
          className="btn btn-secondary-outline"
          onClick={onClearSelection}
        >
          Clear Selection
        </button>
      </div>
    </div>
  );
};

export default BulkActions;
