"use client"

import { useState } from "react"
import { Brain, Settings, MessageCircle, Plus, Minus } from "lucide-react"

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState(0)

  const faqs = [
    {
      question: "How does the AI transformation work?",
      answer: `Our AI uses advanced machine learning to transform photos into stunning artwork in just 2-3 seconds. It analyzes facial features and applies artistic styles while maintaining the subject's likeness.`,
      category: "technology",
    },
    {
      question: "What art styles are available?",
      answer: `We offer 24+ professional art styles including Digital Portraits, Watercolor, Oil Painting, Pop Art, Vintage Effects, and Custom Brand Styles. New styles are added monthly.`,
      category: "technology",
    },
    {
      question: "How long does setup take?",
      answer: `Zero setup time! Simply share the event link or QR code with guests. They use their smartphones to take photos and transform them instantly. No equipment or technicians needed.`,
      category: "setup",
    },
    {
      question: "What equipment do I need?",
      answer: `No equipment needed! Guests use their smartphones to access the AI photobooth through a web browser. Optionally, you can provide tablets for a dedicated station.`,
      category: "setup",
    },
  ]

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? -1 : index)
  }

  return (
    <section className="py-20 bg-gradient-to-b from-[#1a1a2e] to-[#0f0f23]">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Everything you need to know about our AI photobooth technology
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6">
            {faqs.map((faq, index) => {
              const isOpen = openFAQ === index
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-violet-500/30 transition-all duration-300 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full p-8 text-left flex items-center justify-between hover:bg-slate-700/20 transition-all duration-300 group"
                  >
                    <div className="flex items-center flex-1">
                      <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center mr-6 group-hover:bg-violet-500/30 transition-colors">
                        {faq.category === "technology" ? (
                          <Brain size={20} className="text-violet-400" />
                        ) : (
                          <Settings size={20} className="text-violet-400" />
                        )}
                      </div>
                      <h3 className="text-xl font-semibold text-white group-hover:text-violet-300 transition-colors">
                        {faq.question}
                      </h3>
                    </div>
                    <div className="ml-6 w-8 h-8 bg-slate-700/50 rounded-full flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
                      {isOpen ? (
                        <Minus size={16} className="text-slate-400 group-hover:text-violet-400" />
                      ) : (
                        <Plus size={16} className="text-slate-400 group-hover:text-violet-400" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-8 pb-8">
                      <div className="ml-18 border-l-2 border-violet-500/30 pl-6">
                        <p className="text-lg text-slate-300 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-3xl p-10 border border-violet-500/20 text-center">
            <div className="w-16 h-16 bg-violet-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageCircle size={32} className="text-violet-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Ready to See It in Action?</h3>
            <p className="text-lg text-slate-300 mb-8 max-w-xl mx-auto">
              Book a personalized demo and see how our AI photobooth can transform your next event
            </p>
            <div className="flex justify-center">
              <button
                onClick={() =>
                  window.open(
                    "https://wa.me/919964299111?text=Hi! I would like to book a demo for the AI photobooth service.",
                    "_blank",
                  )
                }
                className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                <MessageCircle size={20} />
                Book a Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQSection
