"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Sparkles, Play, Zap, Award, Palette } from "lucide-react"

const HeroSection = () => {
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const beforeAfterImages = [
    {
      before: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      after: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
      style: "Digital Portrait",
    },
    {
      before: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      after: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=300&fit=crop",
      style: "Watercolor Dream",
    },
    {
      before: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      after: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
      style: "Pop Art",
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
              <button className="border-2 border-violet-400 text-violet-400 hover:bg-violet-500/10 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                <Play size={20} />
                Watch Demo
              </button>
            </div>
          </div>

          {/* Right Content - Before/After Demo */}
          <div className="relative">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white mb-2 leading-tight">See the Magic in Action</h3>
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
                      className="w-full h-64 object-cover transition-all duration-500"
                    />
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-sm font-medium text-violet-300 mb-3 leading-none">After</div>
                  <div className="relative overflow-hidden rounded-xl border-2 border-violet-500">
                    <img
                      src={beforeAfterImages[currentImageIndex].after || "/placeholder.svg"}
                      alt="After transformation"
                      className="w-full h-64 object-cover transition-all duration-500"
                    />
                    <div className="absolute top-2 right-2">
                      <div className="bg-violet-500/90 px-2 py-1 rounded text-xs text-white font-medium">
                        {beforeAfterImages[currentImageIndex].style}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transformation Arrow */}
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-violet-400"></div>
                  <div className="bg-violet-500 rounded-full p-2 mx-3">
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-violet-400"></div>
                </div>
              </div>

              {/* Style Indicators */}
              <div className="flex justify-center space-x-2 mb-6">
                {beforeAfterImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentImageIndex ? "bg-violet-500" : "bg-slate-600 hover:bg-slate-500"
                    }`}
                  />
                ))}
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
