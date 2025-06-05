import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '../firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from || '/';
  const pendingPalette = location.state?.pendingPalette;
  const fullPalettes = location.state?.palettes;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // After logging in, go back to wherever user was before login
      // Send fullPalettes back if they existed
      navigate(from, {
        state: fullPalettes ? { palettes: fullPalettes } : undefined,
        replace: true,
      });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-yellow-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-3xl font-bold mb-4 text-yellow-700 text-center">
          Log In
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-yellow-500 text-white font-semibold py-2 rounded hover:bg-yellow-600"
          >
            Log In
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            state={location.state}
            replace
            className="text-yellow-600 hover:text-yellow-800 font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
