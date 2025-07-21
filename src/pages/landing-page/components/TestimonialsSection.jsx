"use client"

import { useState, useEffect, useRef } from "react"
import { Calendar } from "lucide-react"

const EventShowcaseSection = () => {
  const [currentEvent, setCurrentEvent] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [lastX, setLastX] = useState(0)
  const [velocity, setVelocity] = useState(0)
  const [animationPaused, setAnimationPaused] = useState(false)
  const carouselRef = useRef(null)
  const momentumRef = useRef(null)

  const events = [
    {
      id: 1,
      title: "Corporate Tech Summit",
      eventType: "Corporate Event",
      description: `We transformed a major corporate tech summit with our AI photobooth technology. Over 500 employees experienced instant digital art transformations during their company retreat. The professional digital portrait style was perfect for LinkedIn profiles and company newsletters. Setup took just 5 minutes and ran flawlessly for 8 hours straight.`,
      eventImage: "https://res.cloudinary.com/dk1xqwr3g/image/upload/v1751370556/IMG_0793_nfsun9.jpg",
      category: "corporate",
    },
    {
      id: 2,
      title: "Luxury Wedding Reception",
      eventType: "Wedding Event",
      description: `A beautiful garden wedding where we provided watercolor and vintage AI transformations for the happy couple and their guests. The bride loved how the watercolor style matched her wedding theme perfectly. Guests were amazed by the instant artistic transformations and shared them immediately on social media. No equipment setup stress for the wedding planner.`,
      eventImage: "https://res.cloudinary.com/dk1xqwr3g/image/upload/v1751370554/IMG_0788_goktk6.jpg",
      category: "wedding",
    },
    {
      id: 3,
      title: "Product Launch Expo",
      eventType: "Brand Activation",
      description: `We powered a major product launch event with custom AI styles matching the brand colors and theme. The pop art transformations created incredible social media buzz with attendees sharing their branded photos instantly. The marketing team was thrilled with the organic reach and engagement. Perfect for brand awareness and customer engagement.`,
      eventImage: "https://res.cloudinary.com/dk1xqwr3g/image/upload/v1751370555/IMG_0791_mug3tz.jpg",
      category: "brand",
    },
    {
      id: 4,
      title: "Annual Charity Gala",
      eventType: "Fundraising Event",
      description: `A prestigious charity gala where we provided elegant AI transformations for VIP guests and donors. The sophisticated art styles perfectly matched the upscale venue atmosphere. Guests loved the instant keepsakes and the event organizers saved significantly on traditional photobooth costs. The photos became lasting memories of their generous contributions.`,
      eventImage: "https://res.cloudinary.com/dk1xqwr3g/image/upload/v1751370553/IMG_0786_hvisho.jpg",
      category: "gala",
    },
  ]

  const logos = [
    { name: "Corporate", logo: "/assets/images/logo1.png" },
    { name: "Weddings", logo: "/assets/images/logo2.png" },
    { name: "Exhibitions", logo: "/assets/images/logo3.png" },
    { name: "Conferences", logo: "/assets/images/logo4.png" },
    { name: "Galas", logo: "/assets/images/logo5.png" },
    { name: "CGI", logo: "/assets/images/logo6.png" },
    { name: "Scoda", logo: "/assets/images/logo7.png" },
  ]

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentEvent((prev) => (prev + 1) % events.length)
      }, 6000)
      return () => clearInterval(interval)
    }
  }, [isAutoPlaying, events.length])

  const handleEventChange = (index) => {
    setCurrentEvent(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  // Momentum scrolling effect
  const applyMomentum = () => {
    if (Math.abs(velocity) > 0.1) {
      setDragOffset(prev => prev + velocity)
      setVelocity(prev => prev * 0.95) // Friction
      momentumRef.current = requestAnimationFrame(applyMomentum)
    }
  }

  const handleStart = (clientX) => {
    setIsDragging(true)
    setAnimationPaused(true)
    setStartX(clientX)
    setLastX(clientX)
    setVelocity(0)
    if (momentumRef.current) {
      cancelAnimationFrame(momentumRef.current)
    }
    if (carouselRef.current) {
      carouselRef.current.style.animationPlayState = 'paused'
    }
  }

  const handleMove = (clientX) => {
    if (!isDragging) return
    const diff = clientX - lastX
    setDragOffset(prev => prev + diff * 1.2) // Amplify movement
    setVelocity(diff * 0.8) // Track velocity for momentum
    setLastX(clientX)
  }

  const handleEnd = () => {
    if (isDragging) {
      setIsDragging(false)
      setAnimationPaused(false)
      
      // Apply momentum scrolling
      if (Math.abs(velocity) > 1) {
        momentumRef.current = requestAnimationFrame(applyMomentum)
      }
      
      setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.style.animationPlayState = 'running'
        }
      }, 1000) // Resume auto-scroll after momentum stops
    }
  }

  // Mouse events
  const handleMouseDown = (e) => {
    e.preventDefault()
    handleStart(e.clientX)
  }

  const handleMouseMove = (e) => {
    e.preventDefault()
    handleMove(e.clientX)
  }

  const handleMouseUp = () => {
    handleEnd()
  }

  // Touch events
  const handleTouchStart = (e) => {
    handleStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e) => {
    e.preventDefault()
    handleMove(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    handleEnd()
  }

  const handleMouseEnter = () => {
    if (!isDragging && carouselRef.current) {
      carouselRef.current.style.animationPlayState = 'paused'
    }
  }

  const handleMouseLeave = () => {
    if (!isDragging && carouselRef.current) {
      carouselRef.current.style.animationPlayState = 'running'
    }
    if (isDragging) {
      handleEnd()
    }
  }

  // Cleanup momentum animation on unmount
  useEffect(() => {
    return () => {
      if (momentumRef.current) {
        cancelAnimationFrame(momentumRef.current)
      }
    }
  }, [])

  const currentEventData = events[currentEvent]

  return (
    <>
      <style jsx>{`
        @keyframes slideLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .sliding-logos {
          animation: slideLeft 30s linear infinite;
        }
        
        .no-select {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        
        .touch-pan-x {
          touch-action: pan-x;
        }
      `}</style>
      
      <section className="py-20 bg-gradient-to-b from-[#1a1a2e] to-[#0f0f23]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Real Events, Real Results</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              See how we've transformed events across industries with our AI-powered photo booth. From corporate summits
              to luxury weddings, we deliver unforgettable experiences.
            </p>
          </div>

          {/* Featured Event */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 mb-16">
            <div className="grid lg:grid-cols-2">
              {/* Event Content */}
              <div className="p-8 lg:p-12">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center border-2 border-violet-500">
                    <Calendar size={24} className="text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-white">{currentEventData.title}</h3>
                    <p className="text-violet-400">{currentEventData.eventType}</p>
                    <p className="text-sm text-slate-400">Professional Event Services</p>
                  </div>
                </div>

                {/* Event Type Badge */}
                <div className="flex items-center mb-6">
                  <div className="bg-violet-500/20 px-3 py-1 rounded-full border border-violet-500/30">
                    <span className="text-violet-300 text-sm font-medium">✓ Successfully Completed</span>
                  </div>
                </div>

                {/* Description */}
                <blockquote className="text-lg text-slate-300 mb-8 leading-relaxed">
                  {currentEventData.description}
                </blockquote>

                {/* Navigation Dots */}
                <div className="flex space-x-2">
                  {events.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleEventChange(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentEvent ? "bg-violet-500" : "bg-slate-600 hover:bg-slate-500"
                        }`}
                    />
                  ))}
                </div>
              </div>

              {/* Event Image */}
              <div className="relative min-h-[500px] h-[500px] max-h-[500px] flex items-center justify-center">
                <img
                  src={currentEventData.eventImage || "/placeholder.svg"}
                  alt={currentEventData.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2">{currentEventData.title}</h4>
                    <p className="text-slate-300 text-sm">Powered by AI Photobooth</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Client Types - Sliding Carousel */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-8">Trusted by Leading Companies & Event Professionals</h3>
            <div className="relative overflow-hidden py-4">
              <div 
                ref={carouselRef}
                className="flex items-center gap-16 sliding-logos cursor-grab active:cursor-grabbing no-select touch-pan-x"
                style={{
                  transform: `translateX(${dragOffset}px)`,
                  width: 'fit-content'
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Double the logos for seamless loop */}
                {[...logos, ...logos, ...logos].map((eventType, index) => (
                  <div 
                    key={`${eventType.name}-${index}`} 
                    className="flex-shrink-0 flex items-center justify-center"
                    style={{ minWidth: '140px' }}
                  >
                    <img
                      src={eventType.logo}
                      alt={`${eventType.name} events`}
                      className="max-h-12 w-auto filter grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                      draggable="false"
                    />
                  </div>
                ))}
              </div>
              
              {/* Gradient overlays for smooth edges */}
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0f0f23] to-transparent pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0f0f23] to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default EventShowcaseSection