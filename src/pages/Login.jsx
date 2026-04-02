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
  const { signIn, signUp, signInWithGoogle, user } = useAuth();
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
          const errorMsg = error.message.toLowerCase();
          if (errorMsg.includes('rate limit') || errorMsg.includes('too many requests')) {
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

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container flex items-center justify-center min-h-[90vh]">
      <div className="card w-full max-w-sm mx-auto fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6">
            <Shirt size={32} className="text-accent" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Cloth.</h1>
          <p className="text-secondary">Tu armario digital minimalista</p>
        </div>

        {successMessage && (
          <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm mb-6 border border-emerald-100 flex items-start gap-3">
            <div className="mt-0.5">✓</div>
            <p>{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-error p-4 rounded-xl text-sm mb-6 border border-red-100">
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
            className="btn-primary w-full py-3"
          >
            {loading ? <span className="spinner">◌</span> : (isSignUp ? 'Crear cuenta' : 'Iniciar sesión')}
          </button>
        </form>

        <div className="relative my-8 text-center text-xs uppercase tracking-widest text-tertiary">
          <span className="bg-surface px-2 relative z-10">O continuar con</span>
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-border"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="btn-secondary w-full py-3 flex items-center justify-center gap-2 mb-8"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.9 3.24-1.92 4.28-1.2 1.2-3.08 2.52-5.92 2.52-4.72 0-8.52-3.84-8.52-8.56s3.8-8.56 8.52-8.56c2.56 0 4.44.96 5.8 2.28l2.32-2.32C18.4 1.48 15.8 0 12.48 0 6.48 0 1.6 4.84 1.6 10.84s4.88 10.84 10.88 10.84c3.24 0 5.68-1.08 7.56-3.04 1.96-1.96 2.56-4.72 2.56-6.88 0-.68-.04-1.32-.16-1.92h-8.4z"/>
          </svg>
          Google
        </button>

        <div className="text-center text-sm text-secondary">
          {isSignUp ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="ml-2 text-accent font-semibold hover:underline"
          >
            {isSignUp ? 'Inicia sesión' : 'Regístrate'}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50 text-center space-y-1">
          <p className="text-[11px] text-tertiary font-medium">Tus datos están protegidos</p>
          <p className="text-[11px] text-tertiary">No compartimos tu información</p>
        </div>
      </div>
    </div>
  );
}
