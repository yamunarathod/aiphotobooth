"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Sparkles, Plus, Eye, MessageCircle, Palette } from "lucide-react"

const TemplateGallery = () => {
  const [activeCategory, setActiveCategory] = useState("all")
  const [hoveredCard, setHoveredCard] = useState(null)

  const categories = [
    { id: "all", name: "All Styles", count: 12 },
    { id: "corporate", name: "Corporate", count: 3 },
    { id: "wedding", name: "Wedding", count: 4 },
    { id: "party", name: "Party", count: 3 },
    { id: "brand", name: "Brand Activation", count: 2 },
  ]

  const templates = [
    {
      id: 1,
      name: "Digital Portrait",
      category: "corporate",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
      description: "Professional digital art style perfect for corporate events",
      popular: true,
    },
    {
      id: 2,
      name: "Watercolor Dream",
      category: "wedding",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop",
      description: "Soft, romantic watercolor effect ideal for weddings",
      popular: false,
    },
    {
      id: 3,
      name: "Pop Art Explosion",
      category: "party",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
      description: "Bold, vibrant pop art style for energetic celebrations",
      popular: true,
    },
    {
      id: 4,
      name: "Oil Painting Classic",
      category: "corporate",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop",
      description: "Timeless oil painting style for sophisticated events",
      popular: false,
    },
    {
      id: 5,
      name: "Cartoon Character",
      category: "party",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
      description: "Fun cartoon transformation perfect for family events",
      popular: true,
    },
    {
      id: 6,
      name: "Vintage Sepia",
      category: "wedding",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop",
      description: "Classic vintage look with warm sepia tones",
      popular: false,
    },
  ]

  const filteredTemplates =
    activeCategory === "all" ? templates : templates.filter((template) => template.category === activeCategory)

  return (
    <section className="py-20 bg-gradient-to-b from-[#0f0f23] to-[#1a1a2e] min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            AI Art Styles Collection
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-300 max-w-3xl mx-auto"
          >
            From corporate elegance to party fun, discover the perfect style for every event. Each template is fully
            customizable with your brand colors and themes.
          </motion.p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full border transition-all duration-300 ${
                activeCategory === category.id
                  ? "border-violet-500 bg-violet-500/20 text-violet-300 shadow-lg shadow-violet-500/25"
                  : "border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500 hover:bg-slate-600/50"
              }`}
            >
              <span className="font-medium">{category.name}</span>
              <span className="ml-2 text-sm opacity-75">({category.count})</span>
            </motion.button>
          ))}
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
          <AnimatePresence mode="popLayout">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                className="group relative"
                onMouseEnter={() => setHoveredCard(template.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 hover:border-violet-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/10">
                  {/* Popular Badge */}
                  {template.popular && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="absolute top-4 left-4 z-20 bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg"
                    >
                      <Star size={12} className="inline mr-1" />
                      Popular
                    </motion.div>
                  )}

                  {/* Main Image Container with Cross Animation */}
                  <div className="aspect-[4/3] overflow-hidden relative">
                    {/* Base Image */}
                    <img
                      src={template.image || "/placeholder.svg"}
                      alt={template.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Cross Reveal Animation */}
                    <div className="absolute inset-0">
                      {/* Horizontal Cross Bar */}
                      <motion.div
                        className="absolute top-1/2 left-0 right-0 h-0 bg-gradient-to-r from-violet-500/20 via-violet-400/40 to-violet-500/20 transform -translate-y-1/2"
                        animate={{
                          height: hoveredCard === template.id ? "100%" : "0%",
                        }}
                        transition={{
                          duration: 0.6,
                          ease: "easeInOut",
                        }}
                      />

                      {/* Vertical Cross Bar */}
                      <motion.div
                        className="absolute left-1/2 top-0 bottom-0 w-0 bg-gradient-to-b from-violet-500/20 via-violet-400/40 to-violet-500/20 transform -translate-x-1/2"
                        animate={{
                          width: hoveredCard === template.id ? "100%" : "0%",
                        }}
                        transition={{
                          duration: 0.6,
                          ease: "easeInOut",
                          delay: 0.1,
                        }}
                      />

                      {/* Center Cross Icon */}
                      <motion.div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
                        initial={{ scale: 0, rotate: 0 }}
                        animate={{
                          scale: hoveredCard === template.id ? [0, 1.2, 1] : 0,
                          rotate: hoveredCard === template.id ? [0, 180, 360] : 0,
                        }}
                        transition={{
                          duration: 0.8,
                          ease: "easeInOut",
                          delay: 0.2,
                        }}
                      >
                        <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl">
                          <Plus size={24} className="text-violet-600" />
                        </div>
                      </motion.div>
                    </div>

                    {/* Hover Overlay with Gradient */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredCard === template.id ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="absolute bottom-4 left-4 right-4">
                        <motion.button
                          initial={{ y: 20, opacity: 0 }}
                          animate={{
                            y: hoveredCard === template.id ? 0 : 20,
                            opacity: hoveredCard === template.id ? 1 : 0,
                          }}
                          transition={{ delay: 0.3 }}
                          className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                          <Sparkles size={16} />
                          Try This Style
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors duration-300">
                        {template.name}
                      </h3>
                      <div className="bg-slate-700/50 px-2 py-1 rounded-lg text-xs text-slate-400 capitalize whitespace-nowrap ml-2">
                        {template.category}
                      </div>
                    </div>

                    <p className="text-slate-400 text-sm mb-4 leading-relaxed">{template.description}</p>

                    {/* Stats */}
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex gap-4">
                        <span className="text-emerald-400 font-medium">✓ 4K Quality</span>
                        <span className="text-blue-400 font-medium">✓ 2.3s Speed</span>
                      </div>
                      <span className="text-violet-400 font-medium">Customizable</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Load More */}
        <div className="text-center mb-16">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border-2 border-violet-400 text-violet-400 hover:bg-violet-500/10 px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <Plus size={20} />
            View All Styles
          </motion.button>
        </div>

        {/* Custom Style CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-3xl p-8 border border-violet-500/30 text-center backdrop-blur-sm"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <Palette size={48} className="text-violet-400 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-2xl font-bold text-white mb-4">Need a Custom Style?</h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Our AI artists can create bespoke styles tailored to your brand, event theme, or creative vision. From
            corporate branding to unique artistic concepts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} />
              Request Custom Style
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-violet-400 text-violet-400 hover:bg-violet-500/10 py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Eye size={20} />
              View Custom Examples
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default TemplateGallery
