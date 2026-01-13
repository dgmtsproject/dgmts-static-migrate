import { useState } from 'react';
import { supabase } from '../../../supabaseClient';

export const useCsvImport = (subscribers, groups, fetchSubscribers, fetchGroups) => {
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [csvFileName, setCsvFileName] = useState('');
  const [csvGroupSelection, setCsvGroupSelection] = useState('none');
  const [importingCsv, setImportingCsv] = useState(false);
  const [csvParseError, setCsvParseError] = useState('');

  const parseCSVLine = (line) => {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current);
    
    return values.map(v => v.replace(/^"|"$/g, '').trim());
  };

  const parseCsv = (text) => {
    const lines = text.split(/\r?\n/).filter(line => line.trim());
    if (lines.length === 0) return [];

    const firstLine = lines[0].toLowerCase();
    const hasHeader = firstLine.includes('name') || firstLine.includes('email') || firstLine.includes('active');
    
    const dataLines = hasHeader ? lines.slice(1) : lines;
    const parsedSubscribers = [];
    const existingEmails = new Set(subscribers.map(s => s.email.toLowerCase()));

    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i].trim();
      if (!line) continue;

      const values = parseCSVLine(line);
      
      if (values.length < 2) continue;

      const name = values[0]?.trim() || '';
      const email = values[1]?.trim().toLowerCase() || '';
      const activeValue = values[2]?.trim().toLowerCase() || 'true';
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) continue;

      const isActive = activeValue === 'true' || activeValue === '1' || activeValue === 'yes' || activeValue === 'active';
      const isDuplicate = existingEmails.has(email) || parsedSubscribers.some(s => s.email === email);

      parsedSubscribers.push({
        name,
        email,
        is_active: isActive,
        isDuplicate,
        rowIndex: i + (hasHeader ? 2 : 1)
      });
    }

    return parsedSubscribers;
  };

  const handleCsvFileSelect = (e, setMessage) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setMessage({ type: 'error', text: 'Please select a CSV file' });
      return;
    }

    setCsvFileName(file.name);
    setCsvParseError('');
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const parsedData = parseCsv(text);
        
        if (parsedData.length === 0) {
          setCsvParseError('No valid subscribers found in the CSV file');
          setCsvData([]);
          return;
        }
        
        setCsvData(parsedData);
        setShowCsvModal(true);
      } catch (err) {
        console.error('Error parsing CSV:', err);
        setCsvParseError('Failed to parse CSV file: ' + err.message);
        setCsvData([]);
      }
    };
    reader.onerror = () => {
      setCsvParseError('Failed to read the file');
    };
    reader.readAsText(file);
    
    e.target.value = '';
  };

  const handleCsvImport = async (setMessage) => {
    const validSubscribers = csvData.filter(s => !s.isDuplicate);
    
    if (validSubscribers.length === 0) {
      setMessage({ type: 'error', text: 'No new subscribers to import (all are duplicates)' });
      return;
    }

    setImportingCsv(true);
    setMessage({ type: '', text: '' });

    try {
      const subscribersToInsert = validSubscribers.map(sub => ({
        name: sub.name || null,
        email: sub.email,
        is_active: sub.is_active,
        date_joined: new Date().toISOString(),
        token: Math.floor(Math.random() * 1000000000000)
      }));

      const { data: insertedData, error: insertError } = await supabase
        .from('subscribers')
        .insert(subscribersToInsert)
        .select();

      if (insertError) {
        throw insertError;
      }

      const successCount = insertedData?.length || 0;
      const insertedSubscriberIds = insertedData?.map(sub => sub.id) || [];

      if (csvGroupSelection !== 'none' && insertedSubscriberIds.length > 0) {
        try {
          const groupMembers = insertedSubscriberIds.map(subscriberId => ({
            group_id: csvGroupSelection,
            subscriber_id: subscriberId
          }));

          const { error: groupError } = await supabase
            .from('subscriber_group_members')
            .insert(groupMembers);

          if (groupError) {
            console.error('Error adding subscribers to group:', groupError);
            setMessage({ 
              type: 'success', 
              text: `Imported ${successCount} subscriber(s). Note: Failed to add to group.`
            });
          } else {
            const groupName = groups.find(g => g.id === csvGroupSelection)?.name || 'selected group';
            setMessage({ 
              type: 'success', 
              text: `Successfully imported ${successCount} subscriber(s) and added to "${groupName}"`
            });
          }
        } catch (err) {
          console.error('Error adding to group:', err);
          setMessage({ 
            type: 'success', 
            text: `Imported ${successCount} subscriber(s). Note: Failed to add to group.`
          });
        }
      } else {
        setMessage({ 
          type: 'success', 
          text: `Successfully imported ${successCount} subscriber(s)`
        });
      }

      closeCsvModal();
      await fetchSubscribers();
      await fetchGroups();
    } catch (err) {
      console.error('Error importing CSV:', err);
      setMessage({ type: 'error', text: 'Failed to import subscribers: ' + err.message });
    } finally {
      setImportingCsv(false);
    }
  };

  const closeCsvModal = () => {
    setShowCsvModal(false);
    setCsvData([]);
    setCsvFileName('');
    setCsvGroupSelection('none');
    setCsvParseError('');
  };

  return {
    showCsvModal,
    csvData,
    csvFileName,
    csvGroupSelection,
    importingCsv,
    csvParseError,
    setCsvGroupSelection,
    handleCsvFileSelect,
    handleCsvImport,
    closeCsvModal
  };
};
