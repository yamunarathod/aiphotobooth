import { Sparkles, Mail, Phone, MapPin } from "lucide-react"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { name: "Twitter", href: "https://twitter.com/photobooth" },
    { name: "Facebook", href: "https://facebook.com/photobooth" },
    { name: "Instagram", href: "https://instagram.com/photobooth" },
    { name: "LinkedIn", href: "https://linkedin.com/company/photobooth" },
  ]

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
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
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles size={24} color="white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white"> Photobooth AI</h3>
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
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-9 h-9 bg-slate-800 hover:bg-violet-500 rounded-lg flex items-center justify-center transition-colors duration-300 text-slate-400 hover:text-white text-sm"
                    aria-label={social.name}
                  >
                    {social.name.charAt(0)}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-400 text-sm mb-4 md:mb-0">
              © {currentYear}  Photobooth AI. All rights reserved.
            </div>

            <div className="flex gap-6">
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
      </div>
    </footer>
  )
}

export default Footer
