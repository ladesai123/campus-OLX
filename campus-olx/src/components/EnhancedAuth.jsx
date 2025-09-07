import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" className="mr-2">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const EnhancedAuth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPinVerification, setShowPinVerification] = useState(false);
  const [verificationPin, setVerificationPin] = useState('');
  const [expectedPin] = useState(Math.floor(100000 + Math.random() * 900000).toString()); // 6-digit PIN

  const validateEmail = (email) => {
    const eduDomains = ['edu', 'ac.uk', 'edu.au', 'edu.in']; // Common educational domains
    return eduDomains.some(domain => email.toLowerCase().includes(domain));
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');
    try {
      // In production, you'd integrate with Google OAuth
      // For now, we'll simulate the PIN verification flow
      setShowPinVerification(true);
      setError(''); // Clear any previous errors
      // Simulate sending PIN to user's email
      console.log(`PIN for verification: ${expectedPin}`);
    } catch (err) {
      setError('Google authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyPin = async () => {
    if (verificationPin === expectedPin) {
      // Simulate successful OAuth with email extraction
      const mockEmail = 'student@university.edu';
      try {
        // In production, this would be handled by Supabase OAuth
        const { data, error } = await supabase.auth.signUp({
          email: mockEmail,
          password: 'oauth-generated-password'
        });
        
        if (error) throw error;
        
        if (data.user) {
          // Send welcome email
          await sendWelcomeEmail(mockEmail);
          onAuthSuccess();
        }
      } catch (err) {
        setError('Account creation failed. Please try again.');
      }
    } else {
      setError('Invalid PIN. Please check and try again.');
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateEmail(email)) {
      setError('Please use your university email address (.edu domain required)');
      setLoading(false);
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onAuthSuccess();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        
        if (data.user) {
          // Insert user into profiles table
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([{ 
              id: data.user.id, 
              email: data.user.email,
              verified: false,
              created_at: new Date().toISOString()
            }]);

          if (profileError) {
            console.error('Profile insert error:', profileError.message);
          }

          // Send welcome email
          await sendWelcomeEmail(email);
          setError('Success! Check your email for verification.');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendWelcomeEmail = async (userEmail) => {
    try {
      // In production, this would integrate with an email service like Resend, SendGrid, etc.
      // For now, we'll simulate the email sending
      console.log(`Welcome email sent to: ${userEmail}`);
      
      // This would be a call to your email service
      const emailData = {
        to: userEmail,
        subject: 'Welcome to CampusOLX! 🎓',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Welcome to CampusOLX!</h1>
            <p>Hi there! 👋</p>
            <p>We're excited to have you join our community of students buying, selling, and trading items on campus.</p>
            <h2>What's next?</h2>
            <ul>
              <li>Complete your profile setup</li>
              <li>Browse amazing deals from fellow students</li>
              <li>List your own items for sale</li>
              <li>Start saving money and the environment!</li>
            </ul>
            <p>Happy trading!</p>
            <p>The CampusOLX Team</p>
          </div>
        `
      };
      
      // Simulate API call to email service
      console.log('Email service called with:', emailData);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }
  };

  if (showPinVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Verify Your Account</h2>
            <p className="text-gray-600">Enter the 6-digit PIN sent to your email</p>
            <p className="text-sm text-blue-600 mt-2">Demo PIN: {expectedPin}</p>
          </div>
          
          <div className="mb-6">
            <input
              type="text"
              value={verificationPin}
              onChange={(e) => setVerificationPin(e.target.value)}
              placeholder="Enter 6-digit PIN"
              maxLength="6"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          
          <button
            onClick={verifyPin}
            disabled={verificationPin.length !== 6}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Verify Account
          </button>
          
          <button
            onClick={() => setShowPinVerification(false)}
            className="w-full mt-2 text-gray-500 hover:text-gray-700 text-sm"
          >
            Back to authentication
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Campus<span className="text-blue-600">OLX</span>
          </h1>
          <p className="text-gray-600">Your trusted campus marketplace</p>
        </div>

        {/* Trust indicators */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center space-x-6 text-sm text-blue-700">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Verified Students Only
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Secure Transactions
            </div>
          </div>
        </div>

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center mb-6 hover:shadow-md"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        {/* Email Auth Form */}
        <form onSubmit={handleEmailAuth}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              University Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@university.edu"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {!isLogin && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAuth;