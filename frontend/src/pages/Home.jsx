import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Package, BarChart3, Users, Shield, ArrowRight, Check, TrendingUp, Bell, ChevronDown, LogOut, LayoutDashboard, User, ChevronLeft, Star, Zap, Building2, Rocket } from 'lucide-react'

export default function Home() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await logout()
    setProfileOpen(false)
  }

  const features = [
    {
      icon: Package,
      title: 'Inventory Tracking',
      description: 'Track all your products, stock levels, and movements in real-time.',
      color: '#4f46e5'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Get insights into your inventory with powerful analytics and reports.',
      color: '#10b981'
    },
    {
      icon: TrendingUp,
      title: 'Smart Predictions',
      description: 'AI-powered consumption forecasting and reorder suggestions.',
      color: '#f59e0b'
    },
    {
      icon: Bell,
      title: 'Low Stock Alerts',
      description: 'Get notified when products are running low on stock.',
      color: '#ef4444'
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Invite team members and manage roles with admin controls.',
      color: '#3b82f6'
    },
    {
      icon: Shield,
      title: 'Secure & Isolated',
      description: 'Your data is completely isolated and secure from other companies.',
      color: '#8b5cf6'
    }
  ]

  const stats = [
    { value: '10,000+', label: 'Active Users' },
    { value: '99.9%', label: 'Uptime' },
    { value: '2M+', label: 'Products Tracked' },
    { value: '50+', label: 'Countries' },
  ]

  const testimonials = [
    {
      quote: "StockFlow transformed how we manage inventory. We reduced stockouts by 80% in just 3 months.",
      author: "Sarah Johnson",
      role: "Operations Manager",
      company: "TechRetail Co",
      avatar: "SJ",
    },
    {
      quote: "The predictions feature is incredible. It's like having a data scientist on the team 24/7.",
      author: "Michael Chen",
      role: "CEO",
      company: "GrowthMart",
      avatar: "MC",
    },
    {
      quote: "Finally, an inventory system that's actually easy to use. Our team adopted it in days, not weeks.",
      author: "Emily Rodriguez",
      role: "Warehouse Director",
      company: "FastShip Logistics",
      avatar: "ER",
    },
  ]

  const pricing = [
    {
      name: 'Starter',
      price: 'Free',
      period: 'forever',
      description: 'Perfect for small teams getting started',
      icon: Zap,
      features: ['Up to 500 products', '3 team members', 'Basic analytics', 'Email support'],
      cta: 'Start Free',
      popular: false,
    },
    {
      name: 'Professional',
      price: '$29',
      period: '/month',
      description: 'For growing businesses with more needs',
      icon: Rocket,
      features: ['Unlimited products', '10 team members', 'Advanced analytics', 'AI predictions', 'Priority support', 'API access'],
      cta: 'Start Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: '/month',
      description: 'For large organizations with complex needs',
      icon: Building2,
      features: ['Everything in Pro', 'Unlimited team members', 'Custom integrations', 'Dedicated support', 'SLA guarantee', 'On-premise option'],
      cta: 'Contact Sales',
      popular: false,
    },
  ]

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIndex(prev => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4f46e5 100%)' }}>
      {/* Navigation */}
      <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '0 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 70 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={22} color="white" />
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, color: 'white' }}>StockFlow</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {user ? (
              /* Logged in - show profile dropdown */
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    background: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 12,
                    padding: '8px 16px',
                    cursor: 'pointer',
                    color: 'white',
                  }}
                >
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: '#4f46e5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 14,
                  }}>
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</span>
                  <ChevronDown size={16} style={{ opacity: 0.7, transform: profileOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                </button>
                
                {profileOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    background: 'white',
                    borderRadius: 12,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                    minWidth: 200,
                    overflow: 'hidden',
                    animation: 'fadeIn 0.15s ease',
                    zIndex: 100,
                  }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
                      <div style={{ fontWeight: 700, color: '#1e1b4b' }}>{user.name}</div>
                      <div style={{ fontSize: 13, color: '#6b7280' }}>{user.email}</div>
                      <div style={{ marginTop: 6 }}>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          background: user.role === 'admin' ? '#4f46e5' : '#6b7280',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: 4,
                        }}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                    <div style={{ padding: '8px' }}>
                      <Link
                        to="/dashboard"
                        onClick={() => setProfileOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 12px',
                          borderRadius: 8,
                          color: '#374151',
                          textDecoration: 'none',
                          fontWeight: 500,
                          fontSize: 14,
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.target.style.background = '#f3f4f6'}
                        onMouseLeave={e => e.target.style.background = 'transparent'}
                      >
                        <LayoutDashboard size={16} />
                        Go to Dashboard
                      </Link>
                      <Link
                        to="/dashboard/profile"
                        onClick={() => setProfileOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 12px',
                          borderRadius: 8,
                          color: '#374151',
                          textDecoration: 'none',
                          fontWeight: 500,
                          fontSize: 14,
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.target.style.background = '#f3f4f6'}
                        onMouseLeave={e => e.target.style.background = 'transparent'}
                      >
                        <User size={16} />
                        Profile Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 12px',
                          borderRadius: 8,
                          color: '#ef4444',
                          fontWeight: 500,
                          fontSize: 14,
                          width: '100%',
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                        onMouseEnter={e => e.target.style.background = '#fef2f2'}
                        onMouseLeave={e => e.target.style.background = 'transparent'}
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Not logged in - show sign in / register */
              <>
                <Link to="/login" style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: 15 }}>
                  Sign In
                </Link>
                <Link to="/register" style={{ background: 'white', color: '#4f46e5', padding: '10px 20px', borderRadius: 10, fontWeight: 700, fontSize: 15 }}>
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h1 style={{ fontSize: 52, fontWeight: 900, color: 'white', marginBottom: 20, lineHeight: 1.15 }}>
            Intelligent Inventory<br />
            <span style={{ color: '#a5b4fc' }}>Management System</span>
          </h1>
          <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.7)', marginBottom: 40, lineHeight: 1.6 }}>
            Track stock, predict demand, manage suppliers, and never run out of inventory again.
            Built for small businesses that want to grow smarter.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'white', color: '#4f46e5', padding: '16px 32px',
              borderRadius: 12, fontWeight: 700, fontSize: 17,
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}>
              Start Free Trial <ArrowRight size={20} />
            </Link>
            <Link to="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'rgba(255,255,255,0.15)', color: 'white', padding: '16px 32px',
              borderRadius: 12, fontWeight: 600, fontSize: 17, border: '1px solid rgba(255,255,255,0.2)'
            }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '60px 24px 100px', background: 'rgba(255,255,255,0.03)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: 'white', textAlign: 'center', marginBottom: 50 }}>
            Everything You Need to Manage Inventory
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {features.map((feature, index) => (
              <div key={index} style={{
                background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 28,
                border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)'
              }}>
                <div style={{
                  width: 50, height: 50, borderRadius: 12,
                  background: feature.color + '25', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 16
                }}>
                  <feature.icon size={24} color={feature.color} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 8 }}>{feature.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '60px 24px', background: 'linear-gradient(135deg, rgba(79,70,229,0.3), rgba(139,92,246,0.3))' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, textAlign: 'center' }}>
            {stats.map((stat, index) => (
              <div key={index}>
                <div style={{ fontSize: 48, fontWeight: 900, color: 'white', marginBottom: 8 }}>{stat.value}</div>
                <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: 'white', marginBottom: 50 }}>
            Trusted by Growing Businesses
          </h2>
          
          <div style={{ position: 'relative', minHeight: 200 }}>
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: index === testimonialIndex ? 1 : 0,
                  transform: index === testimonialIndex ? 'translateX(0)' : 'translateX(20px)',
                  transition: 'all 0.5s ease',
                  pointerEvents: index === testimonialIndex ? 'auto' : 'none',
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}>
                  {[1,2,3,4,5].map(star => (
                    <Star key={star} size={20} fill="#fbbf24" color="#fbbf24" />
                  ))}
                </div>
                <blockquote style={{
                  fontSize: 24,
                  color: 'white',
                  fontWeight: 500,
                  lineHeight: 1.5,
                  marginBottom: 30,
                  fontStyle: 'italic',
                }}>
                  "{testimonial.quote}"
                </blockquote>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                  <div style={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: '#4f46e5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    color: 'white',
                  }}>
                    {testimonial.avatar}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, color: 'white' }}>{testimonial.author}</div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setTestimonialIndex(index)}
                style={{
                  width: index === testimonialIndex ? 32 : 10,
                  height: 10,
                  borderRadius: 5,
                  background: index === testimonialIndex ? '#4f46e5' : 'rgba(255,255,255,0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: 'white', marginBottom: 16 }}>
              Simple, Transparent Pricing
            </h2>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)' }}>
              Start free, upgrade when you're ready
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {pricing.map((plan, index) => (
              <div
                key={index}
                style={{
                  background: plan.popular ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'rgba(255,255,255,0.08)',
                  borderRadius: 20,
                  padding: 32,
                  border: plan.popular ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  position: 'relative',
                  transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#fbbf24',
                    color: '#1e1b4b',
                    padding: '4px 16px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}>
                    Most Popular
                  </div>
                )}

                <div style={{
                  width: 50,
                  height: 50,
                  borderRadius: 12,
                  background: plan.popular ? 'rgba(255,255,255,0.2)' : 'rgba(79,70,229,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}>
                  <plan.icon size={24} color={plan.popular ? 'white' : '#4f46e5'} />
                </div>

                <h3 style={{ fontSize: 24, fontWeight: 700, color: 'white', marginBottom: 8 }}>{plan.name}</h3>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 40, fontWeight: 900, color: 'white' }}>{plan.price}</span>
                  <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)' }}>{plan.period}</span>
                </div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 24 }}>{plan.description}</p>

                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 28 }}>
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, color: 'rgba(255,255,255,0.8)' }}>
                      <Check size={18} color={plan.popular ? '#a5b4fc' : '#4f46e5'} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/register"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '14px 24px',
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: 15,
                    background: plan.popular ? 'white' : 'rgba(79,70,229,0.3)',
                    color: plan.popular ? '#4f46e5' : 'white',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 24px', background: '#4f46e5', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: 'white', marginBottom: 16 }}>
            Ready to Take Control of Your Inventory?
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', marginBottom: 32 }}>
            Join thousands of businesses managing their stock with StockFlow. Free forever for small teams.
          </p>
          <Link to="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'white', color: '#4f46e5', padding: '16px 40px',
            borderRadius: 12, fontWeight: 700, fontSize: 17
          }}>
            Create Your Free Account <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '30px 24px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
          © 2026 StockFlow. Built for smart inventory management.
        </p>
      </footer>
    </div>
  )
}
