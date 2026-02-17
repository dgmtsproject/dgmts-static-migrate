import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../supabaseClient';

export const useGroups = (loggedIn) => {
  const [groups, setGroups] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [savingGroup, setSavingGroup] = useState(false);
  const [showGroupMembersModal, setShowGroupMembersModal] = useState(false);
  const [managingGroup, setManagingGroup] = useState(null);
  const [groupMembersModalMode, setGroupMembersModalMode] = useState('add'); // 'add' = show all, 'showMembers' = only group members
  const [groupMemberSearch, setGroupMemberSearch] = useState('');
  const [pendingGroupMembers, setPendingGroupMembers] = useState(new Set());
  const [savingGroupMembers, setSavingGroupMembers] = useState(false);

  const fetchGroups = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('subscriber_groups')
        .select('*, subscriber_group_members(subscriber_id)')
        .order('name', { ascending: true });

      if (fetchError) {
        if (fetchError.code === '42P01') {
          console.log('Groups table not found - groups feature disabled');
          setGroups([]);
          return;
        }
        throw fetchError;
      }

      setGroups(data || []);
    } catch (err) {
      console.error('Error fetching groups:', err);
      setGroups([]);
    }
  }, []);

  useEffect(() => {
    if (loggedIn) {
      fetchGroups();
    }
  }, [loggedIn, fetchGroups]);

  const handleCreateGroup = async (setMessage) => {
    if (!newGroupName.trim()) {
      setMessage({ type: 'error', text: 'Please enter a group name' });
      return;
    }

    setSavingGroup(true);
    setMessage({ type: '', text: '' });

    try {
      if (editingGroup) {
        const { error } = await supabase
          .from('subscriber_groups')
          .update({ 
            name: newGroupName.trim(),
            description: newGroupDescription.trim() || null
          })
          .eq('id', editingGroup.id);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Group updated successfully!' });
      } else {
        const { error } = await supabase
          .from('subscriber_groups')
          .insert([{
            name: newGroupName.trim(),
            description: newGroupDescription.trim() || null
          }]);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Group created successfully!' });
      }

      setNewGroupName('');
      setNewGroupDescription('');
      setEditingGroup(null);
      setShowGroupModal(false);
      await fetchGroups();
    } catch (err) {
      console.error('Error saving group:', err);
      setMessage({ type: 'error', text: 'Failed to save group: ' + err.message });
    } finally {
      setSavingGroup(false);
    }
  };

  const handleDeleteGroup = async (groupId, setMessage) => {
    if (!window.confirm('Are you sure you want to delete this group? Members will not be deleted.')) {
      return;
    }

    try {
      await supabase
        .from('subscriber_group_members')
        .delete()
        .eq('group_id', groupId);

      const { error } = await supabase
        .from('subscriber_groups')
        .delete()
        .eq('id', groupId);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Group deleted successfully!' });
      await fetchGroups();
    } catch (err) {
      console.error('Error deleting group:', err);
      setMessage({ type: 'error', text: 'Failed to delete group: ' + err.message });
    }
  };

  const handleEditGroup = (group) => {
    setEditingGroup(group);
    setNewGroupName(group.name);
    setNewGroupDescription(group.description || '');
    setShowGroupModal(true);
  };

  const handleManageGroupMembers = (group, mode = 'add') => {
    setManagingGroup(group);
    setGroupMembersModalMode(mode);
    setGroupMemberSearch('');
    const currentMemberIds = new Set(
      group.subscriber_group_members?.map(m => m.subscriber_id) || []
    );
    setPendingGroupMembers(currentMemberIds);
    setShowGroupMembersModal(true);
  };

  const getGroupMemberIds = (group) => {
    if (!group?.subscriber_group_members) return new Set();
    return new Set(group.subscriber_group_members.map(m => m.subscriber_id));
  };

  const handleToggleGroupMember = (subscriberId) => {
    setPendingGroupMembers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subscriberId)) {
        newSet.delete(subscriberId);
      } else {
        newSet.add(subscriberId);
      }
      return newSet;
    });
  };

  const handleSaveGroupMembers = async (setMessage) => {
    if (!managingGroup) return;

    setSavingGroupMembers(true);
    setMessage({ type: '', text: '' });

    try {
      const currentMemberIds = getGroupMemberIds(managingGroup);
      const pendingMemberIds = pendingGroupMembers;

      const toAdd = Array.from(pendingMemberIds).filter(id => !currentMemberIds.has(id));
      const toRemove = Array.from(currentMemberIds).filter(id => !pendingMemberIds.has(id));

      if (toRemove.length > 0) {
        const { error: removeError } = await supabase
          .from('subscriber_group_members')
          .delete()
          .eq('group_id', managingGroup.id)
          .in('subscriber_id', toRemove);

        if (removeError) throw removeError;
      }

      if (toAdd.length > 0) {
        const membersToAdd = toAdd.map(subscriberId => ({
          group_id: managingGroup.id,
          subscriber_id: subscriberId
        }));

        const { error: addError } = await supabase
          .from('subscriber_group_members')
          .insert(membersToAdd);

        if (addError) throw addError;
      }

      const totalChanges = toAdd.length + toRemove.length;
      if (totalChanges > 0) {
        setMessage({ 
          type: 'success', 
          text: `Successfully updated group members (${toAdd.length} added, ${toRemove.length} removed)` 
        });
      } else {
        setMessage({ type: 'success', text: 'No changes to save' });
      }

      await fetchGroups();
      
      const { data: updatedGroup } = await supabase
        .from('subscriber_groups')
        .select('*, subscriber_group_members(subscriber_id)')
        .eq('id', managingGroup.id)
        .single();
      
      if (updatedGroup) {
        setManagingGroup(updatedGroup);
        const newMemberIds = new Set(
          updatedGroup.subscriber_group_members?.map(m => m.subscriber_id) || []
        );
        setPendingGroupMembers(newMemberIds);
      }

      setShowGroupMembersModal(false);
    } catch (err) {
      console.error('Error updating group membership:', err);
      setMessage({ type: 'error', text: 'Failed to update membership: ' + err.message });
    } finally {
      setSavingGroupMembers(false);
    }
  };

  const handleAddSelectedToGroup = async (groupId, selectedSubscribers, setMessage, setSelectedSubscribers) => {
    if (selectedSubscribers.size === 0) {
      setMessage({ type: 'error', text: 'Please select subscribers first' });
      return;
    }

    try {
      const membersToAdd = Array.from(selectedSubscribers).map(subscriberId => ({
        group_id: groupId,
        subscriber_id: subscriberId
      }));

      const { error } = await supabase
        .from('subscriber_group_members')
        .upsert(membersToAdd, { onConflict: 'group_id,subscriber_id' });

      if (error) throw error;

      setMessage({ type: 'success', text: `Added ${selectedSubscribers.size} subscriber(s) to group` });
      setSelectedSubscribers(new Set());
      await fetchGroups();
    } catch (err) {
      console.error('Error adding to group:', err);
      setMessage({ type: 'error', text: 'Failed to add to group: ' + err.message });
    }
  };

  const openCreateGroupModal = () => {
    setEditingGroup(null);
    setNewGroupName('');
    setNewGroupDescription('');
    setShowGroupModal(true);
  };

  const closeGroupModal = () => {
    setShowGroupModal(false);
    setEditingGroup(null);
    setNewGroupName('');
    setNewGroupDescription('');
  };

  return {
    groups,
    showGroupModal,
    editingGroup,
    newGroupName,
    newGroupDescription,
    savingGroup,
    showGroupMembersModal,
    managingGroup,
    groupMembersModalMode,
    groupMemberSearch,
    pendingGroupMembers,
    savingGroupMembers,
    setNewGroupName,
    setNewGroupDescription,
    setShowGroupMembersModal,
    setGroupMemberSearch,
    fetchGroups,
    handleCreateGroup,
    handleDeleteGroup,
    handleEditGroup,
    handleManageGroupMembers,
    getGroupMemberIds,
    handleToggleGroupMember,
    handleSaveGroupMembers,
    handleAddSelectedToGroup,
    openCreateGroupModal,
    closeGroupModal
  };
};
