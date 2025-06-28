"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Eye, MessageCircle, Palette } from "lucide-react"

const TemplateGallery = () => {
  const [activeCategory, setActiveCategory] = useState("all")

  const categories = [
    { id: "all", name: "All Styles", count: 6 },
    { id: "ghibli", name: "Ghibli", count: 2 },
    { id: "pixar", name: "Pixar", count: 2 },
    { id: "packaging", name: "Packaging", count: 1 },
    { id: "faceswap", name: "Face Swap", count: 1 },
  ]

  const templates = [
    {
      id: 1,
      name: "Digital Portrait",
      category: "ghibli",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      name: "Watercolor Dream",
      category: "pixar",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop",
    },
    {
      id: 3,
      name: "Pop Art Explosion",
      category: "packaging",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    },
    {
      id: 4,
      name: "Oil Painting Classic",
      category: "ghibli",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop",
    },
    {
      id: 5,
      name: "Cartoon Character",
      category: "pixar",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    },
    {
      id: 6,
      name: "Face Transform",
      category: "faceswap",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop",
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
            From Ghibli magic to Pixar charm, discover the perfect style for every event. Each template is fully
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

        {/* Template Grid - 2x3 Layout for 6 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 max-w-5xl mx-auto">
          <AnimatePresence mode="popLayout">
            {filteredTemplates.slice(0, 6).map((template, index) => (
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
              >
                <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 hover:border-violet-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/10">
                  {/* Main Image Container with Tilted Zoom */}
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={template.image || "/placeholder.svg"}
                      alt={template.name}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-3"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors duration-300">
                        {template.name}
                      </h3>
                      <div className="bg-slate-700/50 px-3 py-1 rounded-lg text-xs text-slate-400 capitalize whitespace-nowrap ml-2">
                        {template.category}
                      </div>
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
            Ghibli magic to unique artistic concepts.
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
