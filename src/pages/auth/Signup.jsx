import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Input from '../../components/ui/Input';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const { signUp, signInWithGoogle, authError, clearError } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push('At least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('One lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('One number');
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'password') {
      setPasswordErrors(validatePassword(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setIsLoading(false);
      return;
    }

    if (passwordErrors.length > 0) {
      setIsLoading(false);
      return;
    }

    const result = await signUp(formData.email, formData.password, {
      full_name: formData.fullName
    });
    
    if (result?.success) {
      // With the database trigger, user profile and trial records are created automatically.
      navigate('/');
    }
    
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    clearError();

    const result = await signInWithGoogle();
    
    if (result?.success) {
      // Note: Google OAuth will redirect automatically
    }
    
    setIsLoading(false);
  };

  const isFormValid = formData.fullName && 
                     formData.email && 
                     formData.password && 
                     formData.confirmPassword && 
                     formData.password === formData.confirmPassword &&
                     passwordErrors.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f23] to-[#1a1a2e] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Icon name="Sparkles" size={24} color="white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Magic Photobooth AI</h1>
              <p className="text-sm text-slate-400">AI-Powered Event Photography</p>
            </div>
          </Link>
        </div>

        {/* Signup Form */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-slate-400">Join thousands of event professionals</p>
          </div>

          {/* Error Display */}
          {authError && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center">
              <Icon name="AlertCircle" size={20} className="text-red-400 mr-3 flex-shrink-0" />
              <span className="text-red-300 text-sm">{authError}</span>
            </div>
          )}

          {/* Google Sign In */}
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            variant="outline"
            size="lg"
            className="w-full mb-6 border-slate-600 text-slate-300 hover:bg-slate-700/50"
          >
            <Icon name="Chrome" size={20} className="mr-3" />
            {isLoading ? 'Signing up...' : 'Continue with Google'}
          </Button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800 text-slate-400">Or create account with email</span>
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  required
                  disabled={isLoading}
                  className="w-full pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  disabled={isLoading}
                >
                  <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
                </button>
              </div>
              
              {/* Password Requirements */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  {['At least 8 characters', 'One uppercase letter', 'One lowercase letter', 'One number'].map((requirement) => (
                    <div key={requirement} className="flex items-center">
                      <Icon 
                        name={passwordErrors.includes(requirement) ? 'X' : 'Check'} 
                        size={14} 
                        className={passwordErrors.includes(requirement) ? 'text-red-400' : 'text-green-400'} 
                      />
                      <span className={`ml-2 text-xs ${passwordErrors.includes(requirement) ? 'text-red-300' : 'text-green-300'}`}>
                        {requirement}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  required
                  disabled={isLoading}
                  className="w-full pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  disabled={isLoading}
                >
                  <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={20} />
                </button>
              </div>
              
              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div className="mt-2 flex items-center">
                  <Icon 
                    name={formData.password === formData.confirmPassword ? 'Check' : 'X'} 
                    size={14} 
                    className={formData.password === formData.confirmPassword ? 'text-green-400' : 'text-red-400'} 
                  />
                  <span className={`ml-2 text-xs ${formData.password === formData.confirmPassword ? 'text-green-300' : 'text-red-300'}`}>
                    {formData.password === formData.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                required
                className="rounded border-slate-600 bg-slate-700 text-violet-500 focus:ring-violet-500 focus:ring-offset-slate-800 mt-1"
              />
              <label htmlFor="terms" className="ml-3 text-sm text-slate-300">
                I agree to the{' '}
                <Link to="/terms" className="text-violet-400 hover:text-violet-300">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-violet-400 hover:text-violet-300">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !isFormValid}
              variant="primary"
              size="lg"
              className="w-full bg-gradient-to-r from-violet-500 to-purple-600"
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-slate-400 hover:text-slate-300 text-sm transition-colors inline-flex items-center"
          >
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;