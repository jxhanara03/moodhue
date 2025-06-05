import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, useLocation, Link } from 'react-router-dom';

import { auth } from '../firebase';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from || '/';
  const fullPalettes = location.state?.palettes;

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, email, password);

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
          Sign Up
        </h2>

        <form onSubmit={handleSignUp} className="space-y-4">
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
            Create Account
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            state={location.state}
            className="text-yellow-600 hover:text-yellow-800 font-medium"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
