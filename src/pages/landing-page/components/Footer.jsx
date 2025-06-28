import React from 'react';
import Icon from '../../../components/AppIcon';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Product',
      links: [
        { name: 'AI Transformations', href: '#demo' },
        { name: 'Art Styles Gallery', href: '#styles' },
        { name: 'Pricing Plans', href: '#pricing' },
        { name: 'Enterprise Solutions', href: '/enterprise' },
        { name: 'API Documentation', href: '/api-docs' },
        { name: 'Mobile App', href: '/mobile' }
      ]
    },
    {
      title: 'Use Cases',
      links: [
        { name: 'Corporate Events', href: '/corporate' },
        { name: 'Wedding Photography', href: '/weddings' },
        { name: 'Brand Activations', href: '/brand-activations' },
        { name: 'Party Entertainment', href: '/parties' },
        { name: 'Trade Shows', href: '/trade-shows' },
        { name: 'Social Media Marketing', href: '/social-media' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Video Tutorials', href: '/tutorials' },
        { name: 'Best Practices', href: '/best-practices' },
        { name: 'Case Studies', href: '/case-studies' },
        { name: 'Event Planning Guide', href: '/planning-guide' },
        { name: 'ROI Calculator', href: '/roi-calculator' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press Kit', href: '/press' },
        { name: 'Partner Program', href: '/partners' },
        { name: 'Affiliate Program', href: '/affiliates' },
        { name: 'Contact Sales', href: '/contact' }
      ]
    }
  ];

  const socialLinks = [
    { name: 'Twitter', icon: 'Twitter', href: 'https://twitter.com/magicphotobooth' },
    { name: 'Facebook', icon: 'Facebook', href: 'https://facebook.com/magicphotobooth' },
    { name: 'Instagram', icon: 'Instagram', href: 'https://instagram.com/magicphotobooth' },
    { name: 'LinkedIn', icon: 'Linkedin', href: 'https://linkedin.com/company/magicphotobooth' },
    { name: 'YouTube', icon: 'Youtube', href: 'https://youtube.com/magicphotobooth' }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'GDPR Compliance', href: '/gdpr' },
    { name: 'Security', href: '/security' }
  ];

  return (
    <footer className="bg-gradient-to-b from-[#0f0f23] to-[#0a0a1a] border-t border-slate-800">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-6 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Icon name="Sparkles" size={24} color="white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Magic Photobooth AI</h3>
                  <p className="text-sm text-slate-400">AI-Powered Event Photography</p>
                </div>
              </div>
              
              <p className="text-slate-400 mb-6 leading-relaxed">
                Transform ordinary photos into stunning AI-generated artwork instantly. 
                Eliminate expensive photobooth rentals while delivering professional-quality 
                results that wow guests and clients.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <Icon name="Mail" size={16} className="text-violet-400 mr-3" />
                  <span className="text-slate-300">hello@magicphotobooth.ai</span>
                </div>
                <div className="flex items-center">
                  <Icon name="Phone" size={16} className="text-violet-400 mr-3" />
                  <span className="text-slate-300">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <Icon name="MapPin" size={16} className="text-violet-400 mr-3" />
                  <span className="text-slate-300">San Francisco, CA</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-slate-800 hover:bg-violet-500 rounded-lg flex items-center justify-center transition-colors duration-300 group"
                    aria-label={social.name}
                  >
                    <Icon 
                      name={social.icon} 
                      size={18} 
                      className="text-slate-400 group-hover:text-white transition-colors" 
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h4 className="text-lg font-semibold text-white mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-slate-400 hover:text-violet-400 transition-colors duration-300 text-sm"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="py-8 border-t border-slate-800">
          <div className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-2xl p-8 border border-violet-500/30">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Stay Updated with AI Magic
                </h3>
                <p className="text-slate-300">
                  Get the latest AI art styles, event tips, and exclusive offers delivered to your inbox.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-violet-500 transition-colors"
                />
                <button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center">
                  <Icon name="Send" size={16} className="mr-2" />
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-400 text-sm mb-4 md:mb-0">
              © {currentYear} Magic Photobooth AI. All rights reserved.
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              {legalLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-slate-400 hover:text-violet-400 transition-colors duration-300 text-sm"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Final CTA Strip */}
        <div className="py-6 border-t border-slate-800">
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-3">
              Ready to transform your events? Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 text-sm">
                Start Free Trial
              </button>
              <button className="border border-violet-400 text-violet-400 hover:bg-violet-500/10 px-6 py-2 rounded-lg font-semibold transition-all duration-300 text-sm">
                Book Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;