import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../services/api';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authApi.forgotPassword(email);
      setIsSubmitted(true);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      setError(axiosError.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-700">
          <Link to="/login" className="text-yellow-400 hover:text-yellow-300 mb-6 inline-block">
            ← Back to login
          </Link>

          <h1 className="text-3xl font-bold text-white mb-2">Check your email</h1>
          <p className="text-gray-400 mb-6">
            If an account with that email exists, we've sent password reset instructions to <span className="text-white">{email}</span>.
          </p>
          <p className="text-gray-400 mb-8">
            Didn't receive an email? Check your spam folder or try again.
          </p>

          <button
            onClick={() => {
              setIsSubmitted(false);
              setEmail('');
            }}
            className="w-full py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
          >
            Try another email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-700">
        <Link to="/login" className="text-yellow-400 hover:text-yellow-300 mb-6 inline-block">
          ← Back to login
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Forgot password?</h1>
        <p className="text-gray-400 mb-8">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition"
              placeholder="you@example.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-yellow-400 to-amber-400 text-black font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-400">
          Remember your password?{' '}
          <Link to="/login" className="text-yellow-400 hover:text-yellow-300 font-semibold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
