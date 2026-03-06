import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Package, BarChart3, Users, Shield, ArrowRight, Check, TrendingUp, Bell, ChevronDown, LogOut, LayoutDashboard, User, Star, Zap, Building2, Rocket, Globe, Twitter, Github, Linkedin, Mail, Phone, MapPin, ChevronLeft, ChevronRight, Play, Sparkles } from 'lucide-react'

// CSS for animations
const animationStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }
  @keyframes floatReverse {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(20px) rotate(-5deg); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: scale(0.5); }
    to { opacity: 1; transform: scale(1); }
  }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-float-reverse { animation: floatReverse 8s ease-in-out infinite; }
  .animate-pulse-slow { animation: pulse 4s ease-in-out infinite; }
  .animate-gradient { 
    background-size: 200% 200%;
    animation: gradientShift 8s ease infinite; 
  }
  .animate-slide-up { animation: slideUp 0.6s ease forwards; }
  .feature-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .feature-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(79, 70, 229, 0.3);
    border-color: rgba(139, 92, 246, 0.5);
  }
  .pricing-card {
    transition: all 0.3s ease;
  }
  .pricing-card:hover {
    transform: translateY(-5px) scale(1.02);
  }
  .cta-button {
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }
  .cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(79, 70, 229, 0.4);
  }
  .stat-item {
    transition: all 0.3s ease;
  }
  .stat-item:hover {
    transform: scale(1.05);
  }
  .nav-link {
    position: relative;
    transition: color 0.2s ease;
  }
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: #a5b4fc;
    transition: width 0.2s ease;
  }
  .nav-link:hover::after {
    width: 100%;
  }
`

export default function Home() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const [visibleSections, setVisibleSections] = useState({})
  const dropdownRef = useRef(null)
  const sectionsRef = useRef({})

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

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => ({ ...prev, [entry.target.id]: true }))
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    
    const sections = ['features', 'stats', 'testimonials', 'pricing']
    sections.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    
    return () => observer.disconnect()
  }, [])

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex(prev => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = async () => {
    await logout()
    setProfileOpen(false)
  }

  const features = [
    {
      icon: Package,
      title: 'Inventory Tracking',
      description: 'Track all your products, stock levels, and movements in real-time with barcode scanning support.',
      color: '#4f46e5',
      gradient: 'linear-gradient(135deg, #4f46e5, #7c3aed)'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Get insights into your inventory with powerful analytics, charts, and custom reports.',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981, #059669)'
    },
    {
      icon: TrendingUp,
      title: 'Smart Predictions',
      description: 'AI-powered consumption forecasting and intelligent reorder suggestions.',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
    },
    {
      icon: Bell,
      title: 'Low Stock Alerts',
      description: 'Get instant notifications when products are running low on stock.',
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444, #dc2626)'
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Invite team members, assign roles, and manage permissions with ease.',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level encryption with complete data isolation per company.',
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
    }
  ]

  const stats = [
    { value: '10,000+', label: 'Active Users', icon: Users, color: '#4f46e5' },
    { value: '99.9%', label: 'Uptime SLA', icon: Zap, color: '#10b981' },
    { value: '2M+', label: 'Products Tracked', icon: Package, color: '#f59e0b' },
    { value: '50+', label: 'Countries', icon: Globe, color: '#3b82f6' },
  ]

  const testimonials = [
    {
      quote: "StockFlow transformed how we manage inventory. We reduced stockouts by 80% in just 3 months.",
      author: "Sarah Johnson",
      role: "Operations Manager",
      company: "TechRetail Co",
      avatar: "SJ",
      rating: 5
    },
    {
      quote: "The predictions feature is incredible. It's like having a data scientist on the team 24/7.",
      author: "Michael Chen",
      role: "CEO",
      company: "GrowthMart",
      avatar: "MC",
      rating: 5
    },
    {
      quote: "Finally, an inventory system that's actually easy to use. Our team adopted it in days, not weeks.",
      author: "Emily Rodriguez",
      role: "Warehouse Director",
      company: "FastShip Logistics",
      avatar: "ER",
      rating: 5
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

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0a1f 0%, #1e1b4b 30%, #312e81 70%, #4338ca 100%)' }}>
      <style>{animationStyles}</style>
      
      {/* Floating Background Elements */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        {/* Grid Pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        
        {/* Floating Shapes */}
        <div className="animate-float" style={{
          position: 'absolute', top: '10%', left: '5%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
        }} />
        <div className="animate-float-reverse" style={{
          position: 'absolute', top: '50%', right: '5%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79,70,229,0.2) 0%, transparent 70%)',
        }} />
        <div className="animate-pulse-slow" style={{
          position: 'absolute', bottom: '10%', left: '30%',
          width: 250, height: 250, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
        }} />
        
        {/* Decorative Lines */}
        <svg style={{ position: 'absolute', top: '20%', left: '10%', opacity: 0.1 }} width="200" height="200">
          <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="1" fill="none" />
        </svg>
        <svg style={{ position: 'absolute', bottom: '30%', right: '10%', opacity: 0.1 }} width="150" height="150">
          <rect x="25" y="25" width="100" height="100" stroke="white" strokeWidth="1" fill="none" transform="rotate(45 75 75)" />
        </svg>
      </div>

      {/* Navigation */}
      <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 24px', position: 'relative', zIndex: 10, backdropFilter: 'blur(10px)', background: 'rgba(15,10,31,0.5)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 70 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ 
              width: 42, height: 42, borderRadius: 12, 
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(79,70,229,0.4)'
            }}>
              <Package size={22} color="white" />
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: '-0.5px' }}>StockFlow</span>
          </div>
          
          {/* Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <a href="#features" className="nav-link" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>Features</a>
            <a href="#pricing" className="nav-link" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>Pricing</a>
            <a href="#testimonials" className="nav-link" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>Testimonials</a>
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
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 12,
                    padding: '8px 16px',
                    cursor: 'pointer',
                    color: 'white',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
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
                    background: 'linear-gradient(180deg, #1f1f2e 0%, #161622 100%)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
                    minWidth: 220,
                    overflow: 'hidden',
                    animation: 'fadeIn 0.15s ease',
                    zIndex: 100,
                  }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ fontWeight: 700, color: 'white' }}>{user.name}</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{user.email}</div>
                      <div style={{ marginTop: 6 }}>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          background: user.role === 'admin' ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'rgba(255,255,255,0.15)',
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
                          color: 'rgba(255,255,255,0.8)',
                          textDecoration: 'none',
                          fontWeight: 500,
                          fontSize: 14,
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
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
                          color: 'rgba(255,255,255,0.8)',
                          textDecoration: 'none',
                          fontWeight: 500,
                          fontSize: 14,
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
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
                        onMouseEnter={e => e.target.style.background = 'rgba(239,68,68,0.1)'}
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
                <Link to="/login" className="nav-link" style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
                  Sign In
                </Link>
                <Link to="/register" className="cta-button" style={{ 
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', 
                  color: 'white', 
                  padding: '10px 24px', 
                  borderRadius: 10, 
                  fontWeight: 700, 
                  fontSize: 15,
                  textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '100px 24px 80px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(139,92,246,0.2)',
            border: '1px solid rgba(139,92,246,0.3)',
            borderRadius: 100,
            padding: '6px 16px',
            marginBottom: 24,
          }}>
            <Sparkles size={14} color="#a5b4fc" />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#a5b4fc' }}>
              Trusted by 10,000+ businesses worldwide
            </span>
          </div>

          <h1 style={{ 
            fontSize: 64, 
            fontWeight: 900, 
            color: 'white', 
            marginBottom: 24, 
            lineHeight: 1.1,
            letterSpacing: '-2px'
          }}>
            Modern Inventory
            <br />
            <span style={{ 
              background: 'linear-gradient(135deg, #a5b4fc, #818cf8, #c084fc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Management Made Simple</span>
          </h1>
          
          <p style={{ 
            fontSize: 20, 
            color: 'rgba(255,255,255,0.6)', 
            marginBottom: 40, 
            lineHeight: 1.7,
            maxWidth: 650,
            margin: '0 auto 40px'
          }}>
            Track stock in real-time, predict demand with AI, manage suppliers effortlessly, 
            and never miss a reorder again. Built for modern businesses.
          </p>
          
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 }}>
            <Link to="/register" className="cta-button" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'white', color: '#4f46e5', padding: '18px 36px',
              borderRadius: 14, fontWeight: 700, fontSize: 17,
              boxShadow: '0 8px 30px rgba(79,70,229,0.4)',
              textDecoration: 'none'
            }}>
              Start Free Trial <ArrowRight size={20} />
            </Link>
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'rgba(255,255,255,0.1)', color: 'white', padding: '18px 36px',
              borderRadius: 14, fontWeight: 600, fontSize: 17, 
              border: '1px solid rgba(255,255,255,0.2)',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s ease'
            }}>
              <Play size={18} fill="white" /> Watch Demo
            </button>
          </div>

          {/* Dashboard Preview */}
          <div style={{
            position: 'relative',
            maxWidth: 1000,
            margin: '0 auto',
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)',
          }}>
            {/* Browser Chrome */}
            <div style={{
              background: 'linear-gradient(180deg, #1f1f2e 0%, #18181f 100%)',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} />
              </div>
              <div style={{
                flex: 1,
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 6,
                padding: '6px 12px',
                fontSize: 12,
                color: 'rgba(255,255,255,0.4)',
                textAlign: 'center'
              }}>
                app.stockflow.com/dashboard
              </div>
            </div>
            
            {/* Dashboard Preview Content */}
            <div style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
              padding: '24px',
              minHeight: 300,
            }}>
              {/* Mini Dashboard Layout */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
                {[
                  { label: 'Total Products', value: '2,847', color: '#4f46e5' },
                  { label: 'Low Stock', value: '23', color: '#ef4444' },
                  { label: 'Orders Today', value: '156', color: '#10b981' },
                  { label: 'Revenue', value: '$48.2K', color: '#f59e0b' },
                ].map((stat, i) => (
                  <div key={i} style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 12,
                    padding: 16,
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>{stat.label}</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: 'white' }}>{stat.value}</div>
                  </div>
                ))}
              </div>
              
              {/* Chart Placeholder */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 12,
                padding: 20,
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'flex-end',
                gap: 8,
                height: 120
              }}>
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 80].map((h, i) => (
                  <div key={i} style={{
                    flex: 1,
                    height: `${h}%`,
                    background: i === 11 ? 'linear-gradient(180deg, #4f46e5, #7c3aed)' : 'rgba(79,70,229,0.3)',
                    borderRadius: 4,
                  }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ 
        padding: '100px 24px', 
        background: 'rgba(0,0,0,0.2)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(79,70,229,0.2)',
              border: '1px solid rgba(79,70,229,0.3)',
              borderRadius: 100,
              padding: '6px 16px',
              marginBottom: 16,
            }}>
              <Zap size={14} color="#a5b4fc" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#a5b4fc' }}>Powerful Features</span>
            </div>
            <h2 style={{ fontSize: 42, fontWeight: 900, color: 'white', marginBottom: 16, letterSpacing: '-1px' }}>
              Everything You Need to
              <br />
              <span style={{ color: '#a5b4fc' }}>Manage Inventory</span>
            </h2>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', maxWidth: 600, margin: '0 auto' }}>
              From real-time tracking to AI predictions, we've got all the tools you need.
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
            gap: 24,
            opacity: visibleSections.features ? 1 : 0,
            transform: visibleSections.features ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.6s ease'
          }}>
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="feature-card"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                  borderRadius: 20,
                  padding: 32,
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(10px)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Gradient Accent */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: feature.gradient,
                  opacity: 0.8
                }} />
                
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: feature.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 20,
                  boxShadow: `0 8px 20px ${feature.color}40`
                }}>
                  <feature.icon size={26} color="white" />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 10 }}>{feature.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, fontSize: 15 }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" style={{ 
        padding: '80px 24px', 
        background: 'linear-gradient(135deg, rgba(79,70,229,0.15) 0%, rgba(139,92,246,0.15) 100%)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: 40,
            opacity: visibleSections.stats ? 1 : 0,
            transform: visibleSections.stats ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease'
          }}>
            {stats.map((stat, index) => (
              <div key={index} className="stat-item" style={{ textAlign: 'center' }}>
                <div style={{
                  width: 60, height: 60, borderRadius: 16,
                  background: `linear-gradient(135deg, ${stat.color}30, ${stat.color}10)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                  border: `1px solid ${stat.color}30`
                }}>
                  <stat.icon size={28} color={stat.color} />
                </div>
                <div style={{ fontSize: 48, fontWeight: 900, color: 'white', marginBottom: 4, letterSpacing: '-2px' }}>{stat.value}</div>
                <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" style={{ padding: '100px 24px', background: 'rgba(0,0,0,0.15)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(251,191,36,0.15)',
            border: '1px solid rgba(251,191,36,0.25)',
            borderRadius: 100,
            padding: '6px 16px',
            marginBottom: 16,
          }}>
            <Star size={14} color="#fbbf24" fill="#fbbf24" />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#fbbf24' }}>Customer Stories</span>
          </div>
          
          <h2 style={{ fontSize: 42, fontWeight: 900, color: 'white', marginBottom: 60, letterSpacing: '-1px' }}>
            Loved by Growing Businesses
          </h2>
          
          <div style={{ position: 'relative', minHeight: 260 }}>
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: index === testimonialIndex ? 1 : 0,
                  transform: index === testimonialIndex ? 'translateX(0) scale(1)' : 'translateX(40px) scale(0.95)',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  pointerEvents: index === testimonialIndex ? 'auto' : 'none',
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: 24,
                  gap: 4
                }}>
                  {[1,2,3,4,5].map(star => (
                    <Star key={star} size={22} fill="#fbbf24" color="#fbbf24" />
                  ))}
                </div>
                <blockquote style={{
                  fontSize: 26,
                  color: 'white',
                  fontWeight: 500,
                  lineHeight: 1.5,
                  marginBottom: 36,
                  fontStyle: 'italic',
                  maxWidth: 700,
                  margin: '0 auto 36px'
                }}>
                  "{testimonial.quote}"
                </blockquote>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    color: 'white',
                    fontSize: 18,
                    boxShadow: '0 4px 15px rgba(79,70,229,0.4)'
                  }}>
                    {testimonial.avatar}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, color: 'white', fontSize: 17 }}>{testimonial.author}</div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Navigation Arrows */}
            <button
              onClick={() => setTestimonialIndex(prev => (prev - 1 + testimonials.length) % testimonials.length)}
              style={{
                position: 'absolute',
                left: -60,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={() => setTestimonialIndex(prev => (prev + 1) % testimonials.length)}
              style={{
                position: 'absolute',
                right: -60,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {/* Carousel dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 50 }}>
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setTestimonialIndex(index)}
                style={{
                  width: index === testimonialIndex ? 32 : 10,
                  height: 10,
                  borderRadius: 5,
                  background: index === testimonialIndex ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'rgba(255,255,255,0.2)',
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
      <section id="pricing" style={{ padding: '100px 24px', background: 'rgba(0,0,0,0.1)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(16,185,129,0.15)',
              border: '1px solid rgba(16,185,129,0.25)',
              borderRadius: 100,
              padding: '6px 16px',
              marginBottom: 16,
            }}>
              <Check size={14} color="#10b981" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#10b981' }}>Simple Pricing</span>
            </div>
            <h2 style={{ fontSize: 42, fontWeight: 900, color: 'white', marginBottom: 16, letterSpacing: '-1px' }}>
              Choose Your Plan
            </h2>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', maxWidth: 500, margin: '0 auto' }}>
              Start free forever. Upgrade only when you need more power.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: 24,
            alignItems: 'stretch',
            opacity: visibleSections.pricing ? 1 : 0,
            transform: visibleSections.pricing ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.6s ease'
          }}>
            {pricing.map((plan, index) => (
              <div
                key={index}
                className="pricing-card"
                style={{
                  background: plan.popular 
                    ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #8b5cf6 100%)' 
                    : 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                  borderRadius: 24,
                  padding: plan.popular ? 36 : 32,
                  border: plan.popular ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.08)',
                  position: 'relative',
                  boxShadow: plan.popular ? '0 20px 60px rgba(79,70,229,0.4)' : 'none',
                }}
              >
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                    top: -14,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                    color: '#1e1b4b',
                    padding: '6px 20px',
                    borderRadius: 100,
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    boxShadow: '0 4px 15px rgba(251,191,36,0.4)'
                  }}>
                    Most Popular
                  </div>
                )}

                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: plan.popular ? 'rgba(255,255,255,0.2)' : 'linear-gradient(135deg, rgba(79,70,229,0.3), rgba(139,92,246,0.2))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 24,
                }}>
                  <plan.icon size={26} color={plan.popular ? 'white' : '#a5b4fc'} />
                </div>

                <h3 style={{ fontSize: 24, fontWeight: 800, color: 'white', marginBottom: 8 }}>{plan.name}</h3>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 48, fontWeight: 900, color: 'white', letterSpacing: '-2px' }}>{plan.price}</span>
                  <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', marginLeft: 4 }}>{plan.period}</span>
                </div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 28, lineHeight: 1.5 }}>{plan.description}</p>

                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 32 }}>
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 12, 
                      marginBottom: 14, 
                      color: 'rgba(255,255,255,0.85)',
                      fontSize: 15
                    }}>
                      <div style={{
                        width: 20,
                        height: 20,
                        borderRadius: 6,
                        background: plan.popular ? 'rgba(255,255,255,0.2)' : 'rgba(79,70,229,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Check size={14} color={plan.popular ? 'white' : '#a5b4fc'} />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/register"
                  className="cta-button"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '16px 24px',
                    borderRadius: 12,
                    fontWeight: 700,
                    fontSize: 15,
                    background: plan.popular ? 'white' : 'linear-gradient(135deg, rgba(79,70,229,0.4), rgba(139,92,246,0.3))',
                    color: plan.popular ? '#4f46e5' : 'white',
                    textDecoration: 'none',
                    border: plan.popular ? 'none' : '1px solid rgba(255,255,255,0.1)'
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
      <section style={{ 
        padding: '100px 24px', 
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #8b5cf6 100%)', 
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden'
      }}>
        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: -100,
          left: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          filter: 'blur(60px)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          filter: 'blur(60px)'
        }} />
        
        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative' }}>
          <div style={{
            width: 70,
            height: 70,
            borderRadius: 20,
            background: 'rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <Rocket size={32} color="white" />
          </div>
          
          <h2 style={{ fontSize: 44, fontWeight: 900, color: 'white', marginBottom: 20, letterSpacing: '-1px' }}>
            Ready to Get Started?
          </h2>
          <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.8)', marginBottom: 40, lineHeight: 1.6 }}>
            Join thousands of businesses managing their inventory smarter.
            <br />Start your free trial today — no credit card required.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="cta-button" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'white', color: '#4f46e5', padding: '18px 40px',
              borderRadius: 14, fontWeight: 700, fontSize: 17,
              textDecoration: 'none',
              boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
            }}>
              Create Free Account <ArrowRight size={20} />
            </Link>
            <Link to="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'rgba(255,255,255,0.15)', color: 'white', padding: '18px 40px',
              borderRadius: 14, fontWeight: 600, fontSize: 17,
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.3)'
            }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        padding: '60px 24px 30px', 
        background: 'linear-gradient(180deg, #0a0a12 0%, #0f0a1f 100%)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Footer Top */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: 40,
            marginBottom: 50
          }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ 
                  width: 40, height: 40, borderRadius: 12, 
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Package size={20} color="white" />
                </div>
                <span style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>StockFlow</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
                Modern inventory management for modern businesses. Track, predict, and grow smarter.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                {[Twitter, Github, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,0.5)',
                    transition: 'all 0.2s ease'
                  }}>
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 style={{ color: 'white', fontWeight: 700, marginBottom: 20, fontSize: 15 }}>Product</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {['Features', 'Pricing', 'Integrations', 'API', 'Changelog'].map((item, i) => (
                  <li key={i} style={{ marginBottom: 12 }}>
                    <a href="#" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, textDecoration: 'none', transition: 'color 0.2s' }}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 style={{ color: 'white', fontWeight: 700, marginBottom: 20, fontSize: 15 }}>Company</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {['About', 'Blog', 'Careers', 'Press', 'Contact'].map((item, i) => (
                  <li key={i} style={{ marginBottom: 12 }}>
                    <a href="#" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, textDecoration: 'none', transition: 'color 0.2s' }}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 style={{ color: 'white', fontWeight: 700, marginBottom: 20, fontSize: 15 }}>Contact</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
                  <Mail size={16} />
                  support@stockflow.com
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
                  <Phone size={16} />
                  +1 (555) 123-4567
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
                  <MapPin size={16} />
                  San Francisco, CA
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div style={{ 
            borderTop: '1px solid rgba(255,255,255,0.08)', 
            paddingTop: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16
          }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
              © 2026 StockFlow. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: 24 }}>
              {['Privacy Policy', 'Terms of Service', 'Cookies'].map((item, i) => (
                <a key={i} href="#" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textDecoration: 'none' }}>
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
