import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../supabaseClient';

export const useSubscribers = (loggedIn, filterActive) => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscriberStatuses, setSubscriberStatuses] = useState({});

  const fetchSubscribers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('subscribers')
        .select('*')
        .order('date_joined', { ascending: false });

      if (filterActive) {
        query = query.eq('is_active', true);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setSubscribers(data || []);
    } catch (err) {
      console.error('Error fetching subscribers:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filterActive]);

  useEffect(() => {
    if (loggedIn) {
      fetchSubscribers();
    }
  }, [loggedIn, filterActive, fetchSubscribers]);

  useEffect(() => {
    if (subscribers.length > 0) {
      const initialStatuses = {};
      subscribers.forEach(sub => {
        initialStatuses[sub.id] = sub.is_active;
      });
      setSubscriberStatuses(initialStatuses);
    }
  }, [subscribers]);

  const handleStatusChange = (subscriberId, isActive) => {
    setSubscriberStatuses(prev => ({
      ...prev,
      [subscriberId]: isActive
    }));
  };

  const handleSaveStatuses = async (setMessage, setSaving) => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const updates = [];
      subscribers.forEach(sub => {
        const newStatus = subscriberStatuses[sub.id];
        if (newStatus !== undefined && newStatus !== sub.is_active) {
          updates.push({
            id: sub.id,
            is_active: newStatus
          });
        }
      });

      if (updates.length === 0) {
        setMessage({ type: 'success', text: 'No changes to save' });
        setSaving(false);
        return;
      }

      for (const update of updates) {
        const { error } = await supabase
          .from('subscribers')
          .update({ is_active: update.is_active })
          .eq('id', update.id);

        if (error) throw error;
      }

      setMessage({ type: 'success', text: `Successfully updated ${updates.length} subscriber(s)` });
      await fetchSubscribers();
    } catch (err) {
      console.error('Error saving subscriber statuses:', err);
      setMessage({ type: 'error', text: 'Failed to save changes: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleAddSubscriber = async (e, newSubscriber, setMessage, setAddingSubscriber, setShowAddForm, setNewSubscriber) => {
    if (e) {
      e.preventDefault();
    }
    
    setMessage({ type: '', text: '' });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newSubscriber.email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    setAddingSubscriber(true);

    try {
      const emailToAdd = newSubscriber.email.trim().toLowerCase();
      
      // First check if subscriber already exists
      const { data: existingSubscriber, error: checkError } = await supabase
        .from('subscribers')
        .select('*')
        .eq('email', emailToAdd)
        .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      if (existingSubscriber) {
        // Subscriber exists - show error
        setMessage({ type: 'error', text: 'Subscriber already exists with this email' });
        setAddingSubscriber(false);
        return;
      }

      // Subscriber doesn't exist - create new one
      const token = Math.floor(Math.random() * 1000000000000);

      const { error: insertError } = await supabase
        .from('subscribers')
        .insert([{
          name: newSubscriber.name.trim() || null,
          email: emailToAdd,
          is_active: newSubscriber.is_active,
          date_joined: new Date().toISOString(),
          token: token
        }])
        .select();

      if (insertError) throw insertError;

      setMessage({ type: 'success', text: 'Subscriber added successfully!' });
      setNewSubscriber({ name: '', email: '', is_active: true });
      setShowAddForm(false);
      await fetchSubscribers();
    } catch (err) {
      console.error('Error adding subscriber:', err);
      setMessage({ type: 'error', text: 'Failed to add subscriber: ' + err.message });
    } finally {
      setAddingSubscriber(false);
    }
  };

  const handleDeleteSelected = async (selectedSubscribers, setMessage, setDeleting, setSelectedSubscribers, setShowDeleteConfirm, fetchGroups) => {
    if (selectedSubscribers.size === 0) return;

    setDeleting(true);
    setMessage({ type: '', text: '' });

    try {
      const idsToDelete = Array.from(selectedSubscribers);

      await supabase
        .from('subscriber_group_members')
        .delete()
        .in('subscriber_id', idsToDelete);

      const { error } = await supabase
        .from('subscribers')
        .delete()
        .in('id', idsToDelete);

      if (error) throw error;

      setMessage({ type: 'success', text: `Successfully deleted ${idsToDelete.length} subscriber(s)` });
      setSelectedSubscribers(new Set());
      setShowDeleteConfirm(false);
      
      await fetchSubscribers();
      await fetchGroups();
    } catch (err) {
      console.error('Error deleting subscribers:', err);
      setMessage({ type: 'error', text: 'Failed to delete subscribers: ' + err.message });
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteSingle = async (subscriberId, setMessage, fetchGroups) => {
    if (!window.confirm('Are you sure you want to delete this subscriber?')) return;

    setMessage({ type: '', text: '' });

    try {
      await supabase
        .from('subscriber_group_members')
        .delete()
        .eq('subscriber_id', subscriberId);

      const { error } = await supabase
        .from('subscribers')
        .delete()
        .eq('id', subscriberId);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Subscriber deleted successfully' });
      await fetchSubscribers();
      await fetchGroups();
    } catch (err) {
      console.error('Error deleting subscriber:', err);
      setMessage({ type: 'error', text: 'Failed to delete subscriber: ' + err.message });
    }
  };

  const hasChanges = subscribers.some(sub => 
    subscriberStatuses[sub.id] !== undefined && subscriberStatuses[sub.id] !== sub.is_active
  );

  const totalSubscribers = subscribers.length;
  const activeSubscribers = subscribers.filter(s => s.is_active).length;

  return {
    subscribers,
    loading,
    error,
    subscriberStatuses,
    hasChanges,
    totalSubscribers,
    activeSubscribers,
    fetchSubscribers,
    handleStatusChange,
    handleSaveStatuses,
    handleAddSubscriber,
    handleDeleteSelected,
    handleDeleteSingle
  };
};
