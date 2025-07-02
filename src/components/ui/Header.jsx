import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    const result = await signOut();
    if (result?.success) {
      navigate('/');
    }
  };

  const navLinks = [
    { name: 'Styles', href: '#styles' },
    { name: 'Pricing', href: '/subscription' },
    { name: 'FAQ', href: '#faq' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f23]/95 backdrop-blur-sm border-b border-slate-800">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Icon name="Sparkles" size={20} color="white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">Magic Photobooth AI</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-slate-300 hover:text-violet-400 transition-colors duration-300 font-medium"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300"
                >
                  Dashboard
                </Button>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300"
                  iconName="LogOut"
                  iconPosition="left"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Button
                  onClick={() => navigate('/subscription')}
                  variant="primary"
                  size="sm"
                  className="bg-gradient-to-r from-violet-500 to-purple-600"
                >
                  Buy Now
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-slate-300 hover:text-white transition-colors"
          >
            <Icon name={isMenuOpen ? 'X' : 'Menu'} size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800">
            <nav className="space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-slate-300 hover:text-violet-400 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              
              <div className="pt-4 space-y-3">
                {user ? (
                  <>
                    <Button
                      onClick={() => {
                        navigate('/dashboard');
                        setIsMenuOpen(false);
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full border-slate-600 text-slate-300"
                    >
                      Dashboard
                    </Button>
                    <Button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full border-slate-600 text-slate-300"
                      iconName="LogOut"
                      iconPosition="left"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block text-center text-slate-300 hover:text-white transition-colors font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Button
                      onClick={() => {
                        navigate('/subscription');
                        setIsMenuOpen(false);
                      }}
                      variant="primary"
                      size="sm"
                      className="w-full bg-gradient-to-r from-violet-500 to-purple-600"
                    >
                      Buy Now
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;