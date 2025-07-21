"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Eye, MessageCircle, Palette } from "lucide-react"

const TemplateGallery = () => {
  const [activeCategory, setActiveCategory] = useState("all")

  const categories = [
    { id: "all", name: "All Styles"},
    { id: "ghibli", name: "Ghibli" },
    { id: "pixar", name: "Pixar" },
    { id: "packaging", name: "Packaging" },
    { id: "faceswap", name: "Face Swap"},
  ]

  const templates = [
    {
      id: 1,
      name: "Ghibli ",
      category: "ghibli",
      images: [
        "https://res.cloudinary.com/dk1xqwr3g/image/upload/v1751371140/image_20250627_121040_f4crjc.png",
        "https://res.cloudinary.com/dk1xqwr3g/image/upload/v1751373008/image_20250621_154501_q3uj8c.png",
        "https://res.cloudinary.com/dk1xqwr3g/image/upload/v1753100366/ai-transformed-ghibli_1_hf9f2t.png"


      ],
    },
    {
      id: 2,
      name: "Pixar Art",
      category: "pixar",
      images: [
        "https://res.cloudinary.com/dk1xqwr3g/image/upload/v1751371138/image_20250621_163838_gowdyd.png",
        "https://res.cloudinary.com/dk1xqwr3g/image/upload/v1751373009/image_20250628_122347_hle5hw.png",
        "https://res.cloudinary.com/dk1xqwr3g/image/upload/v1751373007/image_20250621_103551_stqgzf.png"

      ],
    },
    {
      id: 3,
      name: "Packaging Design",
      category: "packaging",
      images: [
        "https://res.cloudinary.com/dk1xqwr3g/image/upload/v1751369447/ai-transformed-package_pwucax.png",
        "https://res.cloudinary.com/dk1xqwr3g/image/upload/v1751373010/image_20250628_113955_vet6mk.png",
        "https://res.cloudinary.com/dk1xqwr3g/image/upload/v1751371140/image_20250621_104545_afntd1.png"

      ],
    },
    {
      id: 4,
      name: "Face Swap Fun",
      category: "faceswap",
      images: [
        "https://res.cloudinary.com/dk1xqwr3g/image/upload/v1751371139/IMG_0787_ps9i2x.jpg",
        "https://res.cloudinary.com/dk1xqwr3g/image/upload/v1751371139/IMG_0785_tvjtir.jpg",
        "https://res.cloudinary.com/dk1xqwr3g/image/upload/v1751371139/image_20250628_140718_wfyygd.png",
        "https://res.cloudinary.com/dk1xqwr3g/image/upload/v1751373007/W3_fmwglp.png",
        "https://res.cloudinary.com/dk1xqwr3g/image/upload/v1751373006/Frame_45_dxofej.png",
        "https://res.cloudinary.com/dk1xqwr3g/image/upload/v1751373004/M2_sqz9gv.png",




      ],
    },
  ]

  // Flatten images into individual cards
  const allTemplateImages = templates.flatMap((template) =>
    template.images.map((img, idx) => ({
      id: `${template.id}-${idx}`,
      name: template.name,
      category: template.category,
      image: img,
    }))
  )

  // Utility to shuffle an array
  function shuffleArray(array) {
    const arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  const filteredImages =
    activeCategory === "all"
      ? shuffleArray(allTemplateImages)
      : allTemplateImages.filter((item) => item.category === activeCategory)

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
            From Ghibli  to Pixar charm, discover the perfect style for every event. Each template is fully
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
              {/* <span className="ml-2 text-sm opacity-75">({category.count})</span> */}
            </motion.button>
          ))}
        </div>

        {/* Template Grid - 2x3 Layout for 6 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 max-w-5xl mx-auto">
          <AnimatePresence mode="popLayout">
            {filteredImages.slice(0, 6).map((item, index) => (
              <motion.div
                key={item.id}
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
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-3"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors duration-300">
                        {item.name}
                      </h3>
                      <div className="bg-slate-700/50 px-3 py-1 rounded-lg text-xs text-slate-400 capitalize whitespace-nowrap ml-2">
                        {item.category}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

   

    
      </div>
    </section>
  )
}

export default TemplateGallery
