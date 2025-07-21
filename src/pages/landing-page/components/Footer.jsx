import { Sparkles, Mail, Phone, MapPin, X, Youtube, Instagram, Linkedin } from "lucide-react"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { 
      name: "X (Twitter)", 
      href: "https://x.com/craftech360", 
      icon: X,
      color: "hover:bg-gray-900"
    },
    { 
      name: "YouTube", 
      href: "https://www.youtube.com/watch?v=ptsb6EsFN0U", 
      icon: Youtube,
      color: "hover:bg-red-600"
    },
    { 
      name: "Instagram", 
      href: "https://www.instagram.com/craftech360?igsh=Yzc5dGNodjV6dWpr&utm_source=qr", 
      icon: Instagram,
      color: "hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500"
    },
    { 
      name: "LinkedIn", 
      href: "https://in.linkedin.com/company/craftech360", 
      icon: Linkedin,
      color: "hover:bg-blue-700"
    },
  ]

 
  return (
    <footer className="bg-gradient-to-b from-[#0f0f23] to-[#0a0a1a] border-t border-slate-800">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    src="/assets/images/logo.png"
                    alt="Photobooth AI Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">AI Photobooth</h3>
                  <p className="text-sm text-slate-400">AI-Powered Event Photography</p>
                </div>
              </div>

              <p className="text-slate-400 mb-6 leading-relaxed">
                Transform ordinary photos into stunning AI-generated artwork instantly. Perfect for events, parties, and
                brand activations.
              </p>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Get in Touch</h4>
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <Mail size={16} className="text-violet-400 mr-3" />
                  <a
                    href="mailto:pradeep@craftech360.com"
                    className="text-slate-300 hover:text-violet-400 transition-colors"
                  >
                    pradeep@craftech360.com
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone size={16} className="text-violet-400 mr-3" />
                  <a href="tel:+919964299111" className="text-slate-300 hover:text-violet-400 transition-colors">
                    +91 99642 99111
                  </a>
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="text-violet-400 mr-3" />
                  <span className="text-slate-300">Craftech360, Bangalore</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-3">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 bg-slate-800 ${social.color} rounded-lg flex items-center justify-center transition-all duration-300 text-slate-400 hover:text-white group`}
                      aria-label={social.name}
                    >
                      <IconComponent size={18} />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-400 text-sm mb-4 md:mb-0">
              © {currentYear} AI Photobooth. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer