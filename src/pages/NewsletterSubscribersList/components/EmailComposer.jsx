import { useMemo, useRef, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Upload, FileText, X, Users, User, Check, Paperclip, Image, ToggleLeft, ToggleRight } from 'lucide-react';
import { supabase } from '../../../supabaseClient';

const EmailComposer = ({
  subscribers,
  groups,
  emailContent,
  emailSubject,
  sendingEmails,
  emailMode,
  attachments,
  uploadingAttachment,
  emailTargetType,
  selectedGroupsForEmail,
  selectedIndividualsForEmail,
  individualSearchTerm,
  targetEmailCount,
  activeSubscribers,
  getFilteredIndividualsForEmail,
  embeddedImages,
  includeHeaderFooter,
  setEmailContent,
  setEmailSubject,
  setEmailMode,
  setEmailTargetType,
  setIndividualSearchTerm,
  toggleGroupForEmail,
  toggleIndividualForEmail,
  selectAllIndividuals,
  clearIndividualSelections,
  handleAttachmentUpload,
  removeAttachment,
  handleEmbeddedImageUpload,
  removeEmbeddedImage,
  setIncludeHeaderFooter,
  handleSendEmails,
  getTargetSummary,
  setMessage
}) => {
  // Ref to store Quill instance
  const quillRef = useRef(null);

  // Get Quill editor instance properly
  const getQuillInstance = useCallback(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      return editor;
    }
    return null;
  }, []);

  // Enhanced ReactQuill modules configuration
  const quillModules = useMemo(() => {
    const imageHandler = () => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();

      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
          setMessage({ type: 'error', text: 'Image size must be less than 5MB for email compatibility' });
          return;
        }

        try {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
          const filePath = `newsletter-images/${fileName}`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('newsletter-images')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            });

          let imageUrl = '';

          if (!uploadError && uploadData) {
            const { data: urlData } = supabase.storage
              .from('newsletter-images')
              .getPublicUrl(filePath);

            if (urlData?.publicUrl) {
              imageUrl = urlData.publicUrl;
            }
          }

          if (!imageUrl) {
            const reader = new FileReader();
            reader.onloadend = () => {
              imageUrl = reader.result;
              insertImageToEditor(imageUrl);
            };
            reader.readAsDataURL(file);
            return;
          }

          insertImageToEditor(imageUrl);
        } catch (err) {
          console.error('Error uploading image:', err);
          const reader = new FileReader();
          reader.onloadend = () => {
            insertImageToEditor(reader.result);
          };
          reader.readAsDataURL(file);
        }
      };
    };

    const insertImageToEditor = (url) => {
      if (quillRef.current) {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, 'image', url, 'user');
        quill.setSelection(range.index + 1);
      }
    };

    return {
      toolbar: {
        container: [
          [{ 'header': ['1', '2', '3', '4', '5', '6', false] }],
          [{ 'font': [] }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'script': 'sub' }, { 'script': 'super' }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
          [{ 'direction': 'rtl' }],
          [{ 'align': [] }],
          ['link', 'image', 'video', 'blockquote', 'code-block'],
          ['clean']
        ],
        handlers: {
          image: imageHandler
        }
      },
      clipboard: {
        matchVisual: false,
      }
    };
  }, [setMessage]);

  const quillFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'direction', 'align',
    'link', 'image', 'video', 'blockquote', 'code-block'
  ];

  // Insert embedded image into editor using preview URL (will be replaced with CID when sending)
  // We store a data attribute to map the preview URL to the CID
  const insertCidImage = useCallback((cid, previewUrl) => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection(true);
      // Insert the preview image (visible in editor), but we'll track it by a special marker
      // We'll use the preview URL in editor, and replace with cid: when sending
      quill.insertEmbed(range.index, 'image', previewUrl, 'user');
      quill.setSelection(range.index + 1);
    }
  }, []);

  return (
    <div className="send-email-section">
      <h3 className="section-title">Send Newsletter to Subscribers</h3>
      <p className="section-description">
        Create and send a professional newsletter email. Select recipients by groups, individuals, or send to all.
      </p>
      <div className="email-form">
        {/* Target Type Selection */}
        <div className="form-group">
          <label>Send To *</label>
          <div className="email-target-type-selector">
            <button
              type="button"
              className={`target-type-btn ${emailTargetType === 'all' ? 'active' : ''}`}
              onClick={() => setEmailTargetType('all')}
              disabled={sendingEmails}
            >
              <Users size={18} />
              All Active ({activeSubscribers})
            </button>
            <button
              type="button"
              className={`target-type-btn ${emailTargetType === 'groups' ? 'active' : ''}`}
              onClick={() => setEmailTargetType('groups')}
              disabled={sendingEmails}
            >
              <Users size={18} />
              Select Groups
            </button>
            <button
              type="button"
              className={`target-type-btn ${emailTargetType === 'individuals' ? 'active' : ''}`}
              onClick={() => setEmailTargetType('individuals')}
              disabled={sendingEmails}
            >
              <User size={18} />
              Select Individuals
            </button>
          </div>
        </div>

        {/* Group Selection (shown when emailTargetType === 'groups') */}
        {emailTargetType === 'groups' && (
          <div className="form-group email-target-selection">
            <label>Select Groups</label>
            {groups.length === 0 ? (
              <p className="no-groups-message">No groups available. Create groups first to use this feature.</p>
            ) : (
              <div className="groups-selection-list">
                {groups.map(group => {
                  const memberCount = group.subscriber_group_members?.length || 0;
                  const activeMemberCount = group.subscriber_group_members 
                    ? subscribers.filter(s => s.is_active && group.subscriber_group_members.some(m => m.subscriber_id === s.id)).length
                    : 0;
                  const isSelected = selectedGroupsForEmail.has(group.id);
                  
                  return (
                    <div 
                      key={group.id} 
                      className={`group-selection-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleGroupForEmail(group.id)}
                    >
                      <div className="group-selection-checkbox">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          disabled={sendingEmails}
                        />
                      </div>
                      <div className="group-selection-info">
                        <span className="group-selection-name">{group.name}</span>
                        <span className="group-selection-count">
                          {activeMemberCount} active of {memberCount} member(s)
                        </span>
                      </div>
                      {isSelected && <Check size={16} className="group-selection-check" />}
                    </div>
                  );
                })}
              </div>
            )}
            {selectedGroupsForEmail.size > 0 && (
              <div className="selection-summary">
                <span>{selectedGroupsForEmail.size} group(s) selected → {targetEmailCount} recipient(s)</span>
              </div>
            )}
          </div>
        )}

        {/* Individual Selection (shown when emailTargetType === 'individuals') */}
        {emailTargetType === 'individuals' && (
          <div className="form-group email-target-selection">
            <label>Select Individual Subscribers</label>
            <div className="individuals-selection-header">
              <input
                type="text"
                value={individualSearchTerm}
                onChange={(e) => setIndividualSearchTerm(e.target.value)}
                placeholder="Search by name or email..."
                className="individuals-search-input"
                disabled={sendingEmails}
              />
              <div className="individuals-selection-actions">
                <button
                  type="button"
                  className="btn btn-small"
                  onClick={() => selectAllIndividuals(getFilteredIndividualsForEmail)}
                  disabled={sendingEmails}
                >
                  Select All ({getFilteredIndividualsForEmail.length})
                </button>
                <button
                  type="button"
                  className="btn btn-small btn-secondary-outline"
                  onClick={clearIndividualSelections}
                  disabled={sendingEmails}
                >
                  Clear All
                </button>
              </div>
            </div>
            <div className="individuals-selection-list">
              {getFilteredIndividualsForEmail.length === 0 ? (
                <p className="no-individuals-message">No active subscribers found.</p>
              ) : (
                getFilteredIndividualsForEmail.map(subscriber => {
                  const isSelected = selectedIndividualsForEmail.has(subscriber.id);
                  
                  return (
                    <div 
                      key={subscriber.id} 
                      className={`individual-selection-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleIndividualForEmail(subscriber.id)}
                    >
                      <div className="individual-selection-checkbox">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          disabled={sendingEmails}
                        />
                      </div>
                      <div className="individual-selection-info">
                        <span className="individual-selection-name">{subscriber.name || 'No Name'}</span>
                        <span className="individual-selection-email">{subscriber.email}</span>
                      </div>
                      {isSelected && <Check size={16} className="individual-selection-check" />}
                    </div>
                  );
                })
              )}
            </div>
            {selectedIndividualsForEmail.size > 0 && (
              <div className="selection-summary">
                <span>{selectedIndividualsForEmail.size} subscriber(s) selected</span>
              </div>
            )}
          </div>
        )}

        {/* Target Summary */}
        <div className="email-target-summary">
          <strong>Recipients:</strong> {getTargetSummary()}
        </div>

        <div className="form-group">
          <label htmlFor="email_subject">Email Subject *</label>
          <input
            id="email_subject"
            type="text"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            placeholder="Enter email subject (e.g., Monthly Newsletter - January 2026)"
            className="email-subject-input"
            disabled={sendingEmails}
            required
          />
        </div>

        <div className="form-group">
          <div className="email-mode-toggle">
            <label className="mode-label">Email Format:</label>
            <button
              type="button"
              className={`mode-btn ${emailMode === 'rich' ? 'active' : ''}`}
              onClick={() => setEmailMode('rich')}
              disabled={sendingEmails}
            >
              Rich Text Editor
            </button>
            <button
              type="button"
              className={`mode-btn ${emailMode === 'html' ? 'active' : ''}`}
              onClick={() => setEmailMode('html')}
              disabled={sendingEmails}
            >
              Custom HTML/CSS
            </button>
            <button
              type="button"
              className={`mode-btn ${emailMode === 'plain' ? 'active' : ''}`}
              onClick={() => setEmailMode('plain')}
              disabled={sendingEmails}
            >
              Plain Text
            </button>
          </div>
        </div>

        {/* Header/Footer Toggle */}
        <div className="form-group">
          <div className="header-footer-toggle">
            <button
              type="button"
              className={`toggle-btn ${includeHeaderFooter ? 'active' : ''}`}
              onClick={() => setIncludeHeaderFooter(!includeHeaderFooter)}
              disabled={sendingEmails}
            >
              {includeHeaderFooter ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
              <span>Include DGMTS Header &amp; Footer Template</span>
            </button>
            <small className="form-hint">
              {includeHeaderFooter 
                ? 'Emails will include the professional DGMTS header and footer wrapper' 
                : 'Emails will be sent with your content only (no wrapper template)'}
            </small>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email_content">Email Content *</label>
          {emailMode === 'rich' ? (
            <div className="quill-container">
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={emailContent}
                onChange={setEmailContent}
                placeholder="Write your newsletter content here... Use the toolbar to format text, add images, links, etc."
                modules={quillModules}
                formats={quillFormats}
              />
            </div>
          ) : emailMode === 'html' ? (
            <div className="html-editor-container">
              <textarea
                id="html_content"
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder={`Paste your custom HTML/CSS code here...

Example:
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .header { background: #4a90e2; color: white; padding: 20px; }
    .content { padding: 20px; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Newsletter Title</h1>
  </div>
  <div class="content">
    <img src="https://your-image-url.com/image.jpg" alt="Banner" />
    <p>Your content here...</p>
  </div>
</body>
</html>`}
                rows={20}
                className="html-content-textarea"
                disabled={sendingEmails}
                spellCheck={false}
              />
              <small className="form-hint html-hint">
                💡 <strong>Tips:</strong> Use inline CSS for best email client compatibility. 
                For images, use absolute URLs (https://). 
                Test with popular email clients before sending to all subscribers.
              </small>
            </div>
          ) : (
            <textarea
              id="email_content"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              placeholder="Enter your message here (e.g., policy updates, announcements, etc.)"
              rows={8}
              className="email-content-textarea"
              disabled={sendingEmails}
            />
          )}
          <small className="form-hint">
            This message will be sent to {targetEmailCount} subscriber(s)
          </small>
        </div>

        {/* Embedded Images Section (CID) */}
        <div className="form-group">
          <label>Embedded Images (Optional)</label>
          <small className="form-hint" style={{ marginBottom: '0.5rem', display: 'block' }}>
            Upload images to embed in your email. Click "Insert" to add the image to your content.
          </small>
          <div className="embedded-images-section">
            {embeddedImages && embeddedImages.length > 0 && (
              <div className="embedded-images-list">
                {embeddedImages.map((img, index) => (
                  <div key={img.cid} className="embedded-image-item">
                    <img src={img.preview} alt={img.name} className="embedded-image-preview" />
                    <div className="embedded-image-info">
                      <span className="embedded-image-name">{img.name}</span>
                      <span className="embedded-image-cid">ID: {img.cid}</span>
                    </div>
                    <div className="embedded-image-actions">
                      <button
                        type="button"
                        className="btn btn-small"
                        onClick={() => insertCidImage(img.cid, img.preview)}
                        disabled={sendingEmails || emailMode !== 'rich'}
                        title="Insert image into content"
                      >
                        Insert
                      </button>
                      <button
                        type="button"
                        className="btn-remove-attachment"
                        onClick={() => removeEmbeddedImage(index)}
                        disabled={sendingEmails}
                        title="Remove image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="embedded-image-upload-area">
              <input
                id="embedded_image_upload"
                type="file"
                accept="image/*"
                onChange={(e) => handleEmbeddedImageUpload(e, setMessage)}
                disabled={sendingEmails}
                style={{ display: 'none' }}
              />
              <label htmlFor="embedded_image_upload" className="attachment-upload-label">
                <Image size={20} />
                <span>Upload Embedded Image</span>
              </label>
            </div>
          </div>
        </div>

        {/* Attachments Section */}
        <div className="form-group">
          <label>Attachments (Optional)</label>
          <div className="attachments-section">
            {attachments && attachments.length > 0 && (
              <div className="attachments-list">
                {attachments.map((attachment, index) => (
                  <div key={index} className="attachment-item">
                    <FileText size={20} />
                    <div className="attachment-info">
                      <span className="attachment-name">{attachment.name}</span>
                      <span className="attachment-size">({(attachment.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <button
                      type="button"
                      className="btn-remove-attachment"
                      onClick={() => removeAttachment(index)}
                      disabled={sendingEmails || uploadingAttachment}
                      title="Remove attachment"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="attachment-upload-area">
              <input
                id="attachment_upload"
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.rar,.png,.jpg,.jpeg,.gif"
                onChange={(e) => handleAttachmentUpload(e, setMessage)}
                disabled={sendingEmails || uploadingAttachment}
                style={{ display: 'none' }}
                multiple
              />
              <label htmlFor="attachment_upload" className="attachment-upload-label">
                <Paperclip size={20} />
                <span>{uploadingAttachment ? 'Uploading...' : 'Add Attachment'}</span>
              </label>
              <small className="form-hint">
                Supported: PDF, Word, Excel, PowerPoint, Images, Text, CSV, ZIP (max 10MB each)
              </small>
            </div>
          </div>
        </div>

        <button 
          onClick={() => handleSendEmails(setMessage)} 
          className="btn btn-secondary send-email-btn"
          disabled={sendingEmails || !emailContent.trim() || !emailSubject.trim() || targetEmailCount === 0 || uploadingAttachment}
        >
          {sendingEmails 
            ? `Sending... (${targetEmailCount} emails)` 
            : `Send Newsletter (${targetEmailCount} subscriber${targetEmailCount !== 1 ? 's' : ''})`}
        </button>
      </div>
    </div>
  );
};

export default EmailComposer;
