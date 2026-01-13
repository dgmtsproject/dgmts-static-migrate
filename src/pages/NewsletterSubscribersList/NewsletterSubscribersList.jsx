import { useState, useEffect } from 'react';
import { checkAdminSession, verifyAdminPassword } from '../../utils/adminAuth';
import { useSubscribers, useGroups, useCsvImport, useEmailSender } from './hooks';
import {
  LoginForm,
  StatsSection,
  GroupManagement,
  SubscriberTable,
  AddSubscriberSection,
  BulkActions,
  EmailComposer,
  DeleteConfirmModal,
  GroupModal,
  GroupMembersModal,
  CsvImportModal
} from './components';
import './NewsletterSubscribersList.css';

const NewsletterSubscribersList = () => {
  // Authentication state
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [checkingSession, setCheckingSession] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Filter and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState(false);

  // Selection state
  const [selectedSubscribers, setSelectedSubscribers] = useState(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Add subscriber state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubscriber, setNewSubscriber] = useState({
    name: '',
    email: '',
    is_active: true
  });
  const [addingSubscriber, setAddingSubscriber] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Saving state
  const [saving, setSaving] = useState(false);

  // Custom hooks
  const {
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
  } = useSubscribers(loggedIn, filterActive);

  const {
    groups,
    showGroupModal,
    editingGroup,
    newGroupName,
    newGroupDescription,
    savingGroup,
    showGroupMembersModal,
    managingGroup,
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
  } = useGroups(loggedIn);

  const {
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
  } = useCsvImport(subscribers, groups, fetchSubscribers, fetchGroups);

  const emailSender = useEmailSender(subscribers, groups);

  // Check session on mount
  useEffect(() => {
    const isAuthenticated = checkAdminSession();
    if (isAuthenticated) {
      setLoggedIn(true);
    }
    setCheckingSession(false);
  }, []);

  // Reset pagination when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterActive]);

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setCheckingSession(true);
    setMessage({ type: '', text: '' });

    const isValid = await verifyAdminPassword(password);
    if (isValid) {
      setLoggedIn(true);
      setPassword('');
      setMessage({ type: '', text: '' });
    } else {
      setMessage({ type: 'error', text: 'Invalid password' });
    }
    setCheckingSession(false);
  };

  // Filter and sort subscribers
  const filteredSubscribers = subscribers
    .filter((subscriber) => {
      if (!subscriber || 
          !subscriber.id || 
          !subscriber.email || 
          (typeof subscriber.id !== 'string' && typeof subscriber.id !== 'number') ||
          typeof subscriber.email !== 'string' ||
          subscriber.email.trim() === '') {
        return false;
      }
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = subscriber.name?.toLowerCase().includes(searchLower) || false;
      const emailMatch = subscriber.email?.toLowerCase().includes(searchLower) || false;
      return nameMatch || emailMatch;
    })
    .sort((a, b) => {
      const nameA = (a.name || '').toLowerCase();
      const nameB = (b.name || '').toLowerCase();
      if (nameA !== nameB) {
        return nameA.localeCompare(nameB);
      }
      return a.email.toLowerCase().localeCompare(b.email.toLowerCase());
    });

  // Pagination calculations
  const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSubscribers = filteredSubscribers.slice(startIndex, endIndex);

  // Check if all filtered subscribers are selected
  const isAllSelected = filteredSubscribers.length > 0 && 
    filteredSubscribers.every(sub => selectedSubscribers.has(sub.id));

  // Select all handler
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = new Set(filteredSubscribers.map(sub => sub.id));
      setSelectedSubscribers(allIds);
    } else {
      setSelectedSubscribers(new Set());
    }
  };

  // Select single subscriber handler
  const handleSelectSubscriber = (subscriberId, isSelected) => {
    setSelectedSubscribers(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(subscriberId);
      } else {
        newSet.delete(subscriberId);
      }
      return newSet;
    });
  };

  // Loading state
  if (checkingSession) {
    return (
      <main className="newsletter-subscribers-page bg-texture">
        <div className="subscribers-login">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  // Login form
  if (!loggedIn) {
    return (
      <LoginForm
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        checkingSession={checkingSession}
        message={message}
        handleLogin={handleLogin}
      />
    );
  }

  return (
    <main className="newsletter-subscribers-page bg-texture">
      <div className="subscribers-container">
        <div className="subscribers-header">
          <h1 className="subscribers-title">Newsletter Subscribers</h1>
          <p className="subscribers-subtitle">
            Manage and view all newsletter subscribers
          </p>
        </div>

        {message.text && (
          <div className={`message message-${message.type}`}>
            {message.text}
          </div>
        )}

        <StatsSection
          totalSubscribers={totalSubscribers}
          activeSubscribers={activeSubscribers}
          groupCount={groups.length}
        />

        <GroupManagement
          groups={groups}
          onCreateGroup={openCreateGroupModal}
          onEditGroup={handleEditGroup}
          onDeleteGroup={(groupId) => handleDeleteGroup(groupId, setMessage)}
          onManageMembers={handleManageGroupMembers}
        />

        <BulkActions
          selectedSubscribers={selectedSubscribers}
          groups={groups}
          onAddToGroup={(groupId) => handleAddSelectedToGroup(groupId, selectedSubscribers, setMessage, setSelectedSubscribers)}
          onDeleteSelected={() => setShowDeleteConfirm(true)}
          onClearSelection={() => setSelectedSubscribers(new Set())}
        />

        <AddSubscriberSection
          showAddForm={showAddForm}
          setShowAddForm={setShowAddForm}
          newSubscriber={newSubscriber}
          setNewSubscriber={setNewSubscriber}
          addingSubscriber={addingSubscriber}
          csvParseError={csvParseError}
          handleAddSubscriber={(e) => handleAddSubscriber(newSubscriber, setMessage, setAddingSubscriber, setShowAddForm, setNewSubscriber)}
          handleCsvFileSelect={(e) => handleCsvFileSelect(e, setMessage)}
        />

        <SubscriberTable
          loading={loading}
          error={error}
          filteredSubscribers={filteredSubscribers}
          paginatedSubscribers={paginatedSubscribers}
          selectedSubscribers={selectedSubscribers}
          subscriberStatuses={subscriberStatuses}
          isAllSelected={isAllSelected}
          hasChanges={hasChanges}
          saving={saving}
          searchTerm={searchTerm}
          filterActive={filterActive}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          startIndex={startIndex}
          endIndex={endIndex}
          setSearchTerm={setSearchTerm}
          setFilterActive={setFilterActive}
          setCurrentPage={setCurrentPage}
          setItemsPerPage={setItemsPerPage}
          handleSelectAll={handleSelectAll}
          handleSelectSubscriber={handleSelectSubscriber}
          handleStatusChange={handleStatusChange}
          handleDeleteSingle={(subscriberId) => handleDeleteSingle(subscriberId, setMessage, fetchGroups)}
          handleSaveStatuses={() => handleSaveStatuses(setMessage, setSaving)}
          fetchSubscribers={fetchSubscribers}
        />

        <EmailComposer
          subscribers={subscribers}
          groups={groups}
          emailContent={emailSender.emailContent}
          emailSubject={emailSender.emailSubject}
          sendingEmails={emailSender.sendingEmails}
          emailMode={emailSender.emailMode}
          pdfFile={emailSender.pdfFile}
          uploadingPdf={emailSender.uploadingPdf}
          emailTargetType={emailSender.emailTargetType}
          selectedGroupsForEmail={emailSender.selectedGroupsForEmail}
          selectedIndividualsForEmail={emailSender.selectedIndividualsForEmail}
          individualSearchTerm={emailSender.individualSearchTerm}
          targetEmailCount={emailSender.targetEmailCount}
          activeSubscribers={emailSender.activeSubscribers}
          getFilteredIndividualsForEmail={emailSender.getFilteredIndividualsForEmail}
          setEmailContent={emailSender.setEmailContent}
          setEmailSubject={emailSender.setEmailSubject}
          setEmailMode={emailSender.setEmailMode}
          setEmailTargetType={emailSender.setEmailTargetType}
          setIndividualSearchTerm={emailSender.setIndividualSearchTerm}
          toggleGroupForEmail={emailSender.toggleGroupForEmail}
          toggleIndividualForEmail={emailSender.toggleIndividualForEmail}
          selectAllIndividuals={emailSender.selectAllIndividuals}
          clearIndividualSelections={emailSender.clearIndividualSelections}
          handlePdfUpload={emailSender.handlePdfUpload}
          removePdf={emailSender.removePdf}
          handleSendEmails={emailSender.handleSendEmails}
          getTargetSummary={emailSender.getTargetSummary}
          setMessage={setMessage}
        />
      </div>

      {/* Modals */}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          selectedCount={selectedSubscribers.size}
          deleting={deleting}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={() => handleDeleteSelected(
            selectedSubscribers, 
            setMessage, 
            setDeleting, 
            setSelectedSubscribers, 
            setShowDeleteConfirm, 
            fetchGroups
          )}
        />
      )}

      {showGroupModal && (
        <GroupModal
          editingGroup={editingGroup}
          newGroupName={newGroupName}
          newGroupDescription={newGroupDescription}
          savingGroup={savingGroup}
          setNewGroupName={setNewGroupName}
          setNewGroupDescription={setNewGroupDescription}
          onClose={closeGroupModal}
          onSave={() => handleCreateGroup(setMessage)}
        />
      )}

      {showGroupMembersModal && managingGroup && (
        <GroupMembersModal
          managingGroup={managingGroup}
          subscribers={subscribers}
          groupMemberSearch={groupMemberSearch}
          pendingGroupMembers={pendingGroupMembers}
          savingGroupMembers={savingGroupMembers}
          getGroupMemberIds={getGroupMemberIds}
          setGroupMemberSearch={setGroupMemberSearch}
          handleToggleGroupMember={handleToggleGroupMember}
          onClose={() => setShowGroupMembersModal(false)}
          onSave={() => handleSaveGroupMembers(setMessage)}
        />
      )}

      {showCsvModal && (
        <CsvImportModal
          csvFileName={csvFileName}
          csvData={csvData}
          csvGroupSelection={csvGroupSelection}
          groups={groups}
          importingCsv={importingCsv}
          setCsvGroupSelection={setCsvGroupSelection}
          onClose={closeCsvModal}
          onImport={() => handleCsvImport(setMessage)}
        />
      )}
    </main>
  );
};

export default NewsletterSubscribersList;
