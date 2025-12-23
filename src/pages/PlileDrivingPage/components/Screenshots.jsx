
import React, { useState } from 'react';
import "./Screenshots.css"

const InterfaceSection = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const interfaces = [
    { id: 'auth', label: 'Auth', desc: 'Secure login and account creation screens tailored for engineering teams.' },
    { id: 'dashboard', label: 'Dashboard', desc: 'Real-time monitoring of blow logs with mic sensitivity and elapsed timers.' },
    { id: 'settings', label: 'Settings', desc: 'Switch between Imperial and Metric units instantly. Customize depth markers.' },
    { id: 'data', label: 'Reports', desc: 'Detailed blow log records with automatic depth increments and average stroke calculations.' }
  ];

  return (
    <div className="interface-section">
      <div className="interface-container">
        <div className="interface-sidebar">
          <h2 className="interface-heading">
            One Platform. <br />
            <span className="interface-heading-accent">Every Field Detail.</span>
          </h2>
          <div className="interface-tabs">
            {interfaces.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`interface-tab ${activeTab === item.id ? 'active' : ''}`}
              >
                <div className="tab-header">
                  <span className="tab-label">{item.label}</span>
                  {activeTab === item.id && <i className="fa-solid fa-chevron-right"></i>}
                </div>
                {activeTab === item.id && <p className="tab-description">{item.desc}</p>}
              </button>
            ))}
          </div>
        </div>
        
        <div className="interface-preview">
            <div className="preview-wrapper">
               <div className="preview-content">
                  {activeTab === 'auth' && (
                    <div className="auth-screen">
                      <img src="logo.png" width={80} height={100} className="auth-logo"/>
                      <div className="auth-tagline">Professional Pile Driving Log</div>
                      <div className="auth-form">
                         <h3 className="auth-title">Welcome Back</h3>
                         <div className="form-fields">
                            <input className="form-input" placeholder="Email Address" disabled />
                            <input className="form-input" placeholder="Password" type="password" disabled />
                         </div>
                         <button className="auth-button">Sign In</button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'dashboard' && (
                    <div className="dashboard-screen">
                       <div className="dashboard-header">
                          <img src="logo.png" width={50} className="dashboard-logo"/>
                          <span className="dashboard-badge">Pile Driving Application</span>
                          <span className="dashboard-signout">Sign Out</span>
                       </div>
                       <div className="dashboard-cards">
                          <div className="time-card">
                             <div className="time-label">Elapsed Time</div>
                             <div className="time-value">00:15:24</div>
                             <div className="time-date">12/23/2025</div>
                             <i className="fa-regular fa-clock time-icon"></i>
                          </div>
                          <div className="mic-card">
                             <div className="mic-header">
                                <span className="mic-label">Mic Sens</span>
                                <span className="mic-value">50%</span>
                             </div>
                             <div className="mic-slider">
                                <div className="slider-track"></div>
                                <div className="slider-thumb"></div>
                             </div>
                          </div>
                       </div>
                       <div className="dashboard-action">
                          <div className="start-button">
                             <i className="fa-solid fa-play"></i>
                             <span>Start Logging</span>
                          </div>
                       </div>
                    </div>
                  )}

                  {activeTab === 'settings' && (
                    <div className="settings-screen">
                       <div className="settings-container">
                          <div className="settings-header">
                             <h3 className="settings-title">Settings</h3>
                          </div>
                          <div className="settings-content">
                             <div className="settings-group">
                                <label className="settings-label">Measurement Units</label>
                                <div className="unit-options">
                                   <div className="unit-option active">Imperial (Ft)</div>
                                   <div className="unit-option">Imperial (In)</div>
                                   <div className="unit-option">Metric (M)</div>
                                </div>
                             </div>
                             <div className="settings-row">
                                <div className="settings-field">
                                   <label className="settings-label">Starting Depth</label>
                                   <input className="settings-input" value="0" readOnly />
                                </div>
                                <div className="settings-field">
                                   <label className="settings-label">Increment Per Mark</label>
                                   <input className="settings-input" value="1" readOnly />
                                </div>
                             </div>
                             <button className="settings-save">Save Configuration</button>
                          </div>
                       </div>
                    </div>
                  )}

                  {activeTab === 'data' && (
                    <div className="data-screen">
                        <div className="data-header">
                           <div className="data-nav">
                              <i className="fa-solid fa-arrow-left"></i>
                              <span>Back to Logs</span>
                           </div>
                           <div className="data-actions">
                              <button className="data-action-btn">
                                <i className="fa-solid fa-envelope"></i> <span>Email</span>
                              </button>
                              <button className="data-action-btn primary">
                                <i className="fa-solid fa-file-pdf"></i> <span>PDF</span>
                              </button>
                           </div>
                        </div>
                        <div className="data-content">
                           <div className="data-title-bar">
                              <h3 className="data-title">Blow Log Data</h3>
                           </div>
                           <table className="data-table">
                              <thead>
                                 <tr>
                                    <th>Blow #</th>
                                    <th>Stroke</th>
                                    <th>Avg Stroke</th>
                                    <th>Blows/Unit</th>
                                    <th>Depth</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {[1,2,3,4,5,6].map(i => (
                                    <tr key={i}>
                                       <td>{i}</td>
                                       <td>{(15 + Math.random() * 5).toFixed(2)}</td>
                                       <td className="muted">-</td>
                                       <td className="highlight">{i % 3 === 0 ? '10' : '-'}</td>
                                       <td>{i % 3 === 0 ? i/3 : '-'}</td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                    </div>
                  )}
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default InterfaceSection