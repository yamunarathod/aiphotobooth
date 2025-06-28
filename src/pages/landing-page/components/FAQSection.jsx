import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState(0);

  const faqs = [
    {
      category: 'AI Technology',
      questions: [
        {
          question: 'How does the AI transformation technology work?',
          answer: `Our AI uses advanced machine learning models trained on millions of artistic images to transform photos into stunning artwork. The process analyzes facial features, lighting, and composition to create personalized transformations that maintain the subject's likeness while applying artistic styles.\n\nThe entire process takes just 2-3 seconds and produces 4K quality results that are perfect for printing or digital sharing.`,
          videoDemo: true
        },
        {
          question: 'What art styles are available?',
          answer: `We offer 24+ professional art styles including:\n• Digital Art & Portraits\n• Watercolor Paintings\n• Oil Painting Classics\n• Pop Art & Comic Styles\n• Vintage & Retro Effects\n• Minimalist Line Art\n• Fantasy & Sci-Fi Themes\n• Custom Brand Styles\n\nNew styles are added monthly based on customer requests and trending artistic movements.`
        },
        {
          question: 'Can I create custom styles for my brand?',
          answer: `Yes! Professional and Enterprise plans include custom style creation. Our AI artists can develop bespoke styles that incorporate your brand colors, logos, and aesthetic preferences.\n\nCustom styles typically take 3-5 business days to create and can be used across all your events. This is perfect for maintaining brand consistency across corporate events and marketing activations.`
        }
      ]
    },
    {
      category: 'Event Setup',
      questions: [
        {
          question: 'How long does setup take for an event?',
          answer: `Zero setup time! Unlike traditional photobooths that require 4+ hours for delivery, assembly, and testing, AI Magic Photobooth is ready instantly.\n\nSimply share the event link with guests or display the QR code. Guests can start transforming photos immediately using their smartphones. No equipment, no technicians, no stress.`
        },
        {
          question: 'What equipment do I need?',
          answer: `No equipment needed! Guests use their own smartphones to:\n• Take or upload photos\n• Select transformation styles\n• Share results instantly\n\nOptionally, you can provide tablets or a laptop for a dedicated station, but it's not required. The platform works on any device with a camera and internet connection.`
        },
        {
          question: 'How do guests access the photobooth?',
          answer: `Guests access the AI photobooth through:\n• Custom event URL (yourcompany.magicphotobooth.ai)\n• QR code displays at your event\n• Direct links in event invitations\n• Social media posts\n\nNo app downloads required - everything works through the web browser for maximum accessibility.`
        }
      ]
    },
    {
      category: 'Pricing & Plans',
      questions: [
        {
          question: 'What happens if I exceed my monthly transform limit?',
          answer: `If you exceed your plan's monthly transforms:\n• Starter Plan: Additional transforms at $0.10 each\n• Professional Plan: Additional transforms at $0.08 each\n• Enterprise Plan: Unlimited transforms included\n\nYou can also upgrade your plan anytime to get more transforms at a better rate. Upgrades take effect immediately with prorated billing.`
        },
        {
          question: 'Can I cancel or change my plan anytime?',
          answer: `Absolutely! You have complete flexibility:\n• Cancel anytime with no penalties\n• Upgrade/downgrade plans instantly\n• Prorated billing for plan changes\n• 30-day money-back guarantee\n\nYour unused transforms roll over for up to 3 months, so you never lose what you've paid for.`
        },
        {
          question: 'Do you offer discounts for multiple events?',
          answer: `Yes! We offer several discount options:\n• Annual billing: 20% off all plans\n• Volume discounts: 15% off for 10+ events/year\n• Agency partnerships: Custom pricing for event planning companies\n• Non-profit discounts: 25% off for registered charities\n\nContact our sales team for custom enterprise pricing based on your specific needs.`
        }
      ]
    },
    {
      category: 'Data & Privacy',
      questions: [
        {
          question: 'How secure is guest photo data?',
          answer: `We take data security extremely seriously:\n• All photos encrypted in transit and at rest\n• GDPR and CCPA compliant\n• Photos automatically deleted after 30 days (unless saved)\n• No photos used for AI training without explicit consent\n• SOC 2 Type II certified infrastructure\n\nGuests control their data and can delete photos anytime through their personal gallery link.`
        },
        {
          question: 'Can guests download their transformed photos?',
          answer: `Yes! Guests can:\n• Download high-resolution (4K) images instantly\n• Share directly to social media platforms\n• Email photos to themselves\n• Access a personal gallery for 30 days\n• Print photos at full resolution\n\nEvent organizers also get access to all event photos through the admin dashboard for additional sharing and marketing use.`
        }
      ]
    }
  ];

  const toggleFAQ = (categoryIndex, questionIndex) => {
    const faqIndex = faqs.slice(0, categoryIndex).reduce((acc, cat) => acc + cat.questions.length, 0) + questionIndex;
    setOpenFAQ(openFAQ === faqIndex ? -1 : faqIndex);
  };

  const getFAQIndex = (categoryIndex, questionIndex) => {
    return faqs.slice(0, categoryIndex).reduce((acc, cat) => acc + cat.questions.length, 0) + questionIndex;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-[#1a1a2e] to-[#0f0f23]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Get answers to common questions about AI Magic Photobooth technology, 
            setup process, pricing, and data security.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              {/* Category Header */}
              <div className="flex items-center mb-6">
                <div className="bg-violet-500/20 rounded-lg p-2 mr-4">
                  <Icon 
                    name={
                      category.category === 'AI Technology' ? 'Brain' :
                      category.category === 'Event Setup' ? 'Settings' :
                      category.category === 'Pricing & Plans'? 'CreditCard' : 'Shield'
                    } 
                    size={20} 
                    className="text-violet-400" 
                  />
                </div>
                <h3 className="text-2xl font-bold text-white">{category.category}</h3>
              </div>

              {/* Questions */}
              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => {
                  const faqIndex = getFAQIndex(categoryIndex, questionIndex);
                  const isOpen = openFAQ === faqIndex;

                  return (
                    <div
                      key={questionIndex}
                      className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFAQ(categoryIndex, questionIndex)}
                        className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-700/20 transition-colors"
                      >
                        <div className="flex items-center">
                          <h4 className="text-lg font-semibold text-white pr-4">
                            {faq.question}
                          </h4>
                          {faq.videoDemo && (
                            <div className="bg-violet-500/20 px-2 py-1 rounded text-xs text-violet-400 border border-violet-500/30">
                              Video Demo
                            </div>
                          )}
                        </div>
                        <Icon
                          name={isOpen ? "ChevronUp" : "ChevronDown"}
                          size={20}
                          className="text-slate-400 flex-shrink-0"
                        />
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-6">
                          <div className="border-t border-slate-700/50 pt-4">
                            <div className="text-slate-300 leading-relaxed whitespace-pre-line">
                              {faq.answer}
                            </div>

                            {faq.videoDemo && (
                              <div className="mt-4 bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <Icon name="Play" size={16} className="text-violet-400 mr-2" />
                                    <span className="text-sm text-violet-400 font-medium">
                                      Watch AI Transformation Demo
                                    </span>
                                  </div>
                                  <button className="bg-violet-500 hover:bg-violet-600 text-white px-3 py-1 rounded text-sm transition-colors">
                                    Play Video
                                  </button>
                                </div>
                                <p className="text-xs text-slate-400 mt-2">
                                  See the AI transformation process in real-time (2 min)
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-16 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-2xl p-8 border border-violet-500/30 text-center">
          <Icon name="MessageCircle" size={48} className="text-violet-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-4">
            Still Have Questions?
          </h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Our support team is here to help! Get answers within 2 hours during business hours, 
            or schedule a live demo to see the platform in action.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center">
              <Icon name="MessageCircle" size={16} className="mr-2" />
              Live Chat Support
            </button>
            <button className="border border-violet-400 text-violet-400 hover:bg-violet-500/10 px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center">
              <Icon name="Calendar" size={16} className="mr-2" />
              Schedule Demo Call
            </button>
            <button className="border border-slate-600 text-slate-300 hover:bg-slate-700/50 px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center">
              <Icon name="Mail" size={16} className="mr-2" />
              Email Support
            </button>
          </div>

          {/* Support Stats */}
          <div className="grid grid-cols-3 gap-6 mt-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-lg font-bold text-violet-400">2 hours</div>
              <div className="text-xs text-slate-400">Avg Response</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">99.5%</div>
              <div className="text-xs text-slate-400">Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">24/7</div>
              <div className="text-xs text-slate-400">Chat Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;