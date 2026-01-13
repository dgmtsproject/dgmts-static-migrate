import { Eye, EyeOff } from 'lucide-react';

const LoginForm = ({ 
  password, 
  setPassword, 
  showPassword, 
  setShowPassword, 
  checkingSession, 
  message, 
  handleLogin 
}) => {
  return (
    <main className="newsletter-subscribers-page bg-texture">
      <div className="subscribers-login">
        <h2>Subscribers Management</h2>
        <p className="login-subtitle">Enter password to access subscribers management</p>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                autoFocus
                disabled={checkingSession}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          {message.type === 'error' && (
            <div className="message message-error">{message.text}</div>
          )}
          <button type="submit" className="btn btn-primary" disabled={checkingSession}>
            {checkingSession ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default LoginForm;
