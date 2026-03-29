import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { Shirt } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // Load signup status from localStorage after registration
  useEffect(() => {
    const signupStatus = localStorage.getItem('signup_success');
    if (signupStatus) {
      setSuccessMessage('¡Registro exitoso! Revisa el correo de verificación que te enviamos.');
    }
  }, []);

  // Clear success message when user logs in
  useEffect(() => {
    if (user) {
      localStorage.removeItem('signup_success');
      setSuccessMessage(null);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        setSuccessMessage(null);
        const { error } = await signUp(email, password);
        
        if (error) {
          // Check for rate limit error specifically
          if (error.message.toLowerCase().includes('rate limit exceeded')) {
            throw new Error('Estamos enviando muchos correos en este momento, intenta de nuevo en unos minutos.');
          }
          throw error;
        }

        // Show success and save for persistence
        setSuccessMessage('¡Registro exitoso! Revisa el correo de verificación que te enviamos.');
        localStorage.setItem('signup_success', 'true');
        setIsSignUp(false); // Switch to sign in view
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container flex items-center justify-center min-h-screen">
      <div className="login-card w-full max-w-sm mx-auto bg-surface p-8 rounded-lg shadow-md border border-border">
        <div className="text-center mb-8">
          <Shirt size={48} className="mx-auto mb-4 text-accent" />
          <h1 className="text-2xl font-semibold mb-2">Cloth.</h1>
          <p className="text-secondary">Your minimalist digital wardrobe</p>
        </div>

        {successMessage && (
          <div className="bg-green-50 text-green-700 p-4 rounded text-sm mb-6 border border-green-200 fade-in">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-error p-3 rounded text-sm mb-4 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="you@example.com"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-6"
          >
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-secondary">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="ml-2 text-primary font-medium hover:underline"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}
