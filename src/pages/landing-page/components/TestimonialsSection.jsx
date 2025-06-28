"use client"

import { useState, useEffect } from "react"
import { Calendar } from "lucide-react"

const EventShowcaseSection = () => {
  const [currentEvent, setCurrentEvent] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const events = [
    {
      id: 1,
      title: "Corporate Tech Summit",
      eventType: "Corporate Event",
      description: `We transformed a major corporate tech summit with our AI photobooth technology. Over 500 employees experienced instant digital art transformations during their company retreat. The professional digital portrait style was perfect for LinkedIn profiles and company newsletters. Setup took just 5 minutes and ran flawlessly for 8 hours straight.`,
      eventImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop",
      category: "corporate",
    },
    {
      id: 2,
      title: "Luxury Wedding Reception",
      eventType: "Wedding Event",
      description: `A beautiful garden wedding where we provided watercolor and vintage AI transformations for the happy couple and their guests. The bride loved how the watercolor style matched her wedding theme perfectly. Guests were amazed by the instant artistic transformations and shared them immediately on social media. No equipment setup stress for the wedding planner.`,
      eventImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
      category: "wedding",
    },
    {
      id: 3,
      title: "Product Launch Expo",
      eventType: "Brand Activation",
      description: `We powered a major product launch event with custom AI styles matching the brand colors and theme. The pop art transformations created incredible social media buzz with attendees sharing their branded photos instantly. The marketing team was thrilled with the organic reach and engagement. Perfect for brand awareness and customer engagement.`,
      eventImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
      category: "brand",
    },
    {
      id: 4,
      title: "Annual Charity Gala",
      eventType: "Fundraising Event",
      description: `A prestigious charity gala where we provided elegant AI transformations for VIP guests and donors. The sophisticated art styles perfectly matched the upscale venue atmosphere. Guests loved the instant keepsakes and the event organizers saved significantly on traditional photobooth costs. The photos became lasting memories of their generous contributions.`,
      eventImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop",
      category: "gala",
    },
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

  const currentEventData = events[currentEvent]

  return (
    <section className="py-20 bg-gradient-to-b from-[#1a1a2e] to-[#0f0f23]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Real Events, Real Results</h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            See how we've transformed events across industries with our AI-powered photo magic. From corporate summits
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
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentEvent ? "bg-violet-500" : "bg-slate-600 hover:bg-slate-500"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Event Image */}
            <div className="relative">
              <img
                src={currentEventData.eventImage || "/placeholder.svg"}
                alt={currentEventData.title}
                className="w-full h-full object-cover min-h-[400px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">{currentEventData.title}</h4>
                  <p className="text-slate-300 text-sm">Powered by AI Magic Photobooth</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Client Types - Moved to Middle */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-8">Trusted by Leading Companies & Event Professionals</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
            {[
              { name: "Corporate", logo: "https://via.placeholder.com/120x60/6366f1/ffffff?text=Corporate" },
              { name: "Weddings", logo: "https://via.placeholder.com/120x60/6366f1/ffffff?text=Weddings" },
              { name: "Exhibitions", logo: "https://via.placeholder.com/120x60/6366f1/ffffff?text=Exhibitions" },
              { name: "Conferences", logo: "https://via.placeholder.com/120x60/6366f1/ffffff?text=Conferences" },
              { name: "Galas", logo: "https://via.placeholder.com/120x60/6366f1/ffffff?text=Galas" },
              { name: "Parties", logo: "https://via.placeholder.com/120x60/6366f1/ffffff?text=Parties" },
            ].map((eventType, index) => (
              <div key={index} className="flex items-center justify-center">
                <img
                  src={eventType.logo || "/placeholder.svg"}
                  alt={`${eventType.name} events`}
                  className="max-h-12 w-auto filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default EventShowcaseSection
