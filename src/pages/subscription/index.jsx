"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import Button from "../../components/ui/Button"
import Icon from "../../components/AppIcon"
import { makeRazorpayPayment } from "../../utils/razorpay"

const SubscriptionPage = () => {
  const navigate = useNavigate()
  const [eventSize, setEventSize] = useState(100)
  const [billingCycle, setBillingCycle] = useState("monthly")
  const [selectedPlan, setSelectedPlan] = useState("professional")
  const [isProcessing, setIsProcessing] = useState(false)

  const { user, userProfile, signOut } = useAuth()

  // Function to get the correct database user ID
  // Function to get the correct database user ID
  const getDatabaseUserId = () => {
    // The user object from useAuth() provides the id from the auth.users table.
    // Your database trigger ensures this ID exists in your public.users table.
    if (user?.id) {
      console.log('Using authenticated user ID:', user.id);
      return user.id;
    }

    // This case should ideally not be hit if a user is logged in.
    console.error("Could not determine user ID.");
    return null;
  }

  const handleLogout = async () => {
    try {
      await signOut()
      navigate("/login")
    } catch (error) {
      console.error("Logout error:", error)
      navigate("/login")
    }
  }
const plans = [
    {
      id: "starter",
      name: "Starter",
      description: "Perfect for getting started with AI photo generation",
      monthlyPrice: 24, // 2000 INR converted to USD (approx $24)
      yearlyPrice: 19, // 20% discount for yearly
      transformsIncluded: 100,
      features: [
        "100 AI photo credits (never expire)",
        "Basic face swap style",
        "HD quality downloads",
        "Email support",
        "Mobile app access",
        "Basic photo editing",
        "Credits roll over monthly",
      ],
      limitations: ["Limited to face swap only", "No advanced styles"],
      popular: false,
      color: "blue",
    },
    {
      id: "pro",
      name: "Pro",
      description: "Most popular for unlimited creativity",
      monthlyPrice: 60, // 5000 INR converted to USD (approx $60)
      yearlyPrice: 48, // 20% discount for yearly
      transformsIncluded: 250,
      features: [
        "250 AI photo credits (never expire)",
        "All premium art styles",
        "Advanced face swap",
        "Style mixing & blending",
        "HD quality downloads",
        "Priority support",
        "Bulk processing",
        "Custom style creation",
        "Advanced photo editing",
        "Credits roll over monthly",
      ],
      limitations: [],
      popular: true,
      color: "violet",
    },
  ]

  const calculatePrice = (plan) => {
    const basePrice = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice
    return basePrice
  }

  const calculatePerPhoto = (plan) => {
    if (plan.transformsIncluded === "unlimited") return 0
    const price = calculatePrice(plan)
    return (price / plan.transformsIncluded).toFixed(3)
  }

  const getEventSizeMultiplier = () => {
    if (eventSize <= 50) return 1
    if (eventSize <= 100) return 1.2
    if (eventSize <= 200) return 1.5
    if (eventSize <= 500) return 2
    return 3
  }

  const handleSelectPlan = async (planId) => {
    if (isProcessing) return

    setSelectedPlan(planId)
    const plan = plans.find((p) => p.id === planId)
    const name = getUserDisplayName()
    const email = getUserEmail()
    const baseAmount = calculatePrice(plan) * getEventSizeMultiplier()

    // Get the correct database user ID
    const databaseUserId = getDatabaseUserId()
    const authUserId = user?.id

    console.log('=== USER ID DEBUG ===')
    console.log('Database User ID:', databaseUserId)
    console.log('Auth User ID:', authUserId)
    console.log('User Profile:', userProfile)
    console.log('====================')

    if (planId === "enterprise") {
      // For enterprise, still log the interest in Firebase
      try {
        const { createPaymentRecord } = await import("../../services/paymentService");

        await createPaymentRecord({
          userId: databaseUserId, // Use database UUID
          email: email,
          userName: name,
          planId: planId,
          planName: plan.name,
          amount: baseAmount,
          currency: 'INR',
          billingCycle,
          eventSize,
          status: 'enterprise_inquiry',
          paymentMethod: 'enterprise_contact',
          metadata: {
            authUserId: authUserId, // Store auth ID for reference
            transformsIncluded: plan.transformsIncluded,
            features: plan.features,
            inquiry_type: 'enterprise_plan_interest',
            timestamp: new Date().toISOString()
          }
        })
      } catch (error) {
        console.error('Error logging enterprise inquiry:', error)
      }

      alert("We'll contact you soon. Or reach out to sales@ai.com.")
      return
    }

    if (!user?.id) {
      alert("Please log in to continue with payment.")
      navigate("/login")
      return
    }

    if (!databaseUserId) {
      alert("Unable to identify user account. Please log in again.")
      navigate("/login")
      return
    }

    setIsProcessing(true)

    try {
      await makeRazorpayPayment({
        name,
        email,
        amountInRupees: baseAmount,
        planDetails: plan,
        userId: databaseUserId,  // Use database UUID
        authUserId: authUserId,  // Pass auth ID for reference
        eventSize,
        billingCycle,
        onSuccess: (response) => {
          console.log("Payment successful:", response)
          setIsProcessing(false)

          // Show success message with more details
          alert(`Payment successful! 
Subscription: ${plan.name} (${billingCycle})
Payment ID: ${response.razorpay_payment_id}
Your subscription is now active!`)

          // Redirect to dashboard
          navigate("/dashboard")
        },
        onFailure: (error) => {
          console.error("Payment failed:", error)
          setIsProcessing(false)

          // Show more descriptive error message
          const errorMessage = error.description || "Payment failed. Please try again."
          alert(`Payment Failed: ${errorMessage}`)
        },
      })
    } catch (error) {
      console.error("Error initiating payment:", error)
      setIsProcessing(false)
      alert("Error initiating payment. Please try again.")
    }
  }

  const getUserDisplayName = () => {
    if (userProfile?.name) return userProfile.name
    if (user?.user_metadata?.name) return user.user_metadata.name
    if (user?.email) return user.email.split('@')[0]
    return "User"
  }

  const getUserEmail = () => {
    return user?.email || ""
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f23] to-[#1a1a2e]">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Icon name="Sparkles" size={24} color="white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white"> Photobooth AI</h1>
                <p className="text-sm text-slate-400">AI-Powered Event Photography</p>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/dashboard"
                    className="text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Icon name="LayoutDashboard" size={16} />
                    Dashboard
                  </Link>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm text-white font-medium">{getUserDisplayName()}</p>
                      <p className="text-xs text-slate-400">{getUserEmail()}</p>
                    </div>
                    <button onClick={handleLogout} className="text-slate-300 hover:text-white transition-colors">
                      <Icon name="LogOut" size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-slate-300 hover:text-white transition-colors">
                    Sign In
                  </Link>
                  <Button variant="outline" size="sm" className="border-violet-400 text-violet-400 bg-transparent">
                    Contact Sales
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Choose Your Perfect Plan</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Transform your events with AI-powered photo . All plans include unlimited support, regular updates,
              and a 30-day money-back guarantee.
            </p>
          </div>

          {/* Event Size Slider */}
          

          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-slate-800/50 rounded-lg p-1 border border-slate-600">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2 rounded-md transition-all duration-300 ${billingCycle === "monthly" ? "bg-violet-500 text-white" : "text-slate-400 hover:text-white"
                  }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-6 py-2 rounded-md transition-all duration-300 relative ${billingCycle === "yearly" ? "bg-violet-500 text-white" : "text-slate-400 hover:text-white"
                  }`}
              >
                Yearly
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  20% OFF
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
     <div className="grid lg:grid-cols-2 gap-8 mb-16 justify-center mx-auto max-w-4xl">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border transition-all duration-300 ${plan.popular
                    ? "border-violet-500 scale-105 shadow-2xl shadow-violet-500/20"
                    : selectedPlan === plan.id
                      ? "border-violet-500/50"
                      : "border-slate-700/50 hover:border-slate-600"
                  }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-2 rounded-full text-white text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-slate-400 mb-6">{plan.description}</p>

                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">${calculatePrice(plan)}</span>
                    <span className="text-slate-400 ml-2">/{billingCycle === "monthly" ? "month" : "month"}</span>
                  </div>

                  {billingCycle === "yearly" && (
                    <div className="text-sm text-green-400 mb-4">
                      Save ${(plan.monthlyPrice - plan.yearlyPrice) * 12}/year
                    </div>
                  )}

                  <div className="text-sm text-slate-400">
                    {plan.transformsIncluded === "unlimited"
                      ? "Unlimited transformations"
                      : `${plan.transformsIncluded.toLocaleString()} transformations included`}
                  </div>

                  {plan.transformsIncluded !== "unlimited" && (
                    <div className="text-xs text-slate-500">${calculatePerPhoto(plan)} per photo</div>
                  )}
                </div>

                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-white mb-4">What's included:</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Icon name="Check" size={16} className="text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.limitations.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-slate-400 mb-2">Limitations:</h5>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-start">
                            <Icon name="X" size={14} className="text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-400 text-xs">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  variant={plan.popular ? "primary" : "outline"}
                  size="lg"
                  disabled={isProcessing}
                  className={`w-full ${plan.popular
                      ? "bg-gradient-to-r from-violet-500 to-purple-600"
                      : "border-violet-400 text-violet-400 hover:bg-violet-500/10"
                    } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                  iconName={isProcessing ? "Loader" : (plan.id === "enterprise" ? "Phone" : "CreditCard")}
                  iconPosition="left"
                >
                  {isProcessing
                    ? "Processing..."
                    : (plan.id === "enterprise" ? "Contact Sales" : "Choose Plan")
                  }
                </Button>

                {plan.id !== "enterprise" && (
                  <p className="text-center text-xs text-slate-400 mt-3">
                    30-day money-back guarantee • Cancel anytime
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="text-center">
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="flex items-center">
                <Icon name="Shield" size={20} className="text-green-400 mr-2" />
                <span className="text-slate-400 text-sm">SSL Secured</span>
              </div>
              <div className="flex items-center">
                <Icon name="CreditCard" size={20} className="text-blue-400 mr-2" />
                <span className="text-slate-400 text-sm">Secure Payments</span>
              </div>
              <div className="flex items-center">
                <Icon name="Award" size={20} className="text-amber-400 mr-2" />
                <span className="text-slate-400 text-sm">99.9% Uptime</span>
              </div>
              <div className="flex items-center">
                <Icon name="Users" size={20} className="text-violet-400 mr-2" />
                <span className="text-slate-400 text-sm">10,000+ Happy Customers</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SubscriptionPage