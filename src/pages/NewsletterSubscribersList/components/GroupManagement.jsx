import { Users, Plus, Edit2, Trash2 } from 'lucide-react';

const GroupManagement = ({ 
  groups, 
  onCreateGroup, 
  onEditGroup, 
  onDeleteGroup, 
  onManageMembers 
}) => {
  return (
    <div className="group-management-section">
      <div className="group-management-header">
        <h3 className="section-title">
          <Users size={20} />
          Subscriber Groups
        </h3>
        <button 
          className="btn btn-toggle-form"
          onClick={onCreateGroup}
        >
          <Plus size={18} />
          Create Group
        </button>
      </div>
      
      {groups.length === 0 ? (
        <div className="groups-empty-state">
          <Users size={48} />
          <p>No groups created yet. Create groups to organize your subscribers and send targeted emails.</p>
        </div>
      ) : (
        <div className="groups-list">
          {groups.map(group => (
            <div key={group.id} className="group-card">
              <div className="group-info">
                <h4 className="group-name">{group.name}</h4>
                {group.description && (
                  <p className="group-description">{group.description}</p>
                )}
                <span className="group-member-count">
                  {group.subscriber_group_members?.length || 0} member(s)
                </span>
              </div>
              <div className="group-actions">
                <button
                  className="btn-group-action"
                  onClick={() => onManageMembers(group)}
                  title="Manage members"
                >
                  <Users size={16} />
                </button>
                <button
                  className="btn-group-action"
                  onClick={() => onEditGroup(group)}
                  title="Edit group"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  className="btn-group-action btn-group-delete"
                  onClick={() => onDeleteGroup(group.id)}
                  title="Delete group"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupManagement;
