"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Sparkles, Play, Zap, Award, Palette } from "lucide-react"

const HeroSection = () => {
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  

  const beforeAfterImages = [
    {
      before: "https://res.cloudinary.com/dk1xqwr3g/image/upload/v1751369446/istockphoto-1303500951-612x612_jvep8j.jpg",
      after: "https://res.cloudinary.com/dk1xqwr3g/image/upload/v1751369447/ai-transformed-package_pwucax.png",
      style: "TrainBox",
    },
    {
      before: "https://res.cloudinary.com/dk1xqwr3g/image/upload/v1751369596/df_dt9pve.jpg",
      after: "https://res.cloudinary.com/dk1xqwr3g/image/upload/v1751369597/ai-transformed-ghibli_n1ilgq.png",
      style: "Ghibli",
    },
    {
      before: "https://res.cloudinary.com/dk1xqwr3g/image/upload/v1751369595/photo-1438761681033-6461ffad8d80_fkh3xz.jpg",
      after: "https://res.cloudinary.com/dk1xqwr3g/image/upload/v1751369595/ai-transformed-pixar_pwzmsl.png",
      style: "Pixar Art",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % beforeAfterImages.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const handleBuyNow = () => {
    navigate("/subscription")
  }

  return (
    <section className="relative py-16 bg-gradient-to-b from-[#0f0f23] to-[#1a1a2e] overflow-hidden min-h-screen flex items-center">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Transform
              <span className="block bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Every Photo
              </span>
              Into Art
            </h1>

            <p className="text-lg text-slate-300 mb-8 max-w-2xl leading-relaxed">
              Replace expensive photobooth rentals with AI-powered transformations. Create stunning, shareable moments
              that guests will love—instantly and affordably.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button
                onClick={handleBuyNow}
                className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-2xl shadow-violet-500/25 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <Sparkles size={20} />
                Buy Now - Start Creating
              </button>
         
            </div>
          </div>

          {/* Right Content - Before/After Demo */}
          <div className="relative">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white mb-2 leading-tight">See the  in Action</h3>
                <p className="text-slate-400 leading-tight">Real transformations in seconds</p>
              </div>

              {/* Before/After Images */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-sm font-medium text-slate-300 mb-3 leading-none">Before</div>
                  <div className="relative overflow-hidden rounded-xl border-2 border-slate-600">
                    <img
                      src={beforeAfterImages[currentImageIndex].before || "/placeholder.svg"}
                      alt="Before transformation"
                      className="w-full h-96 object-cover transition-all duration-500" // increased height
                    />
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-sm font-medium text-violet-300 mb-3 leading-none">After</div>
                  <div className="relative overflow-hidden rounded-xl border-2 border-violet-500">
                    <img
                      src={beforeAfterImages[currentImageIndex].after || "/placeholder.svg"}
                      alt="After transformation"
                      className="w-full h-96 object-cover transition-all duration-500" // increased height
                    />
                    <div className="absolute top-2 right-2">
                      <div className="bg-violet-500/90 px-2 py-1 rounded text-xs text-white font-medium">
                        {beforeAfterImages[currentImageIndex].style}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <Zap size={20} className="text-violet-400 mx-auto mb-2" />
                  <div className="text-xs text-slate-300 leading-none">Instant</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <Award size={20} className="text-green-400 mx-auto mb-2" />
                  <div className="text-xs text-slate-300 leading-none">4K Quality</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <Palette size={20} className="text-amber-400 mx-auto mb-2" />
                  <div className="text-xs text-slate-300 leading-none">Custom</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
