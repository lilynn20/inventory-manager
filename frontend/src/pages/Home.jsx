import { Link } from 'react-router-dom'
import { Package, BarChart3, Users, Shield, ArrowRight, Check } from 'lucide-react'

export default function Home() {
  const features = [
    {
      icon: Package,
      title: 'Inventory Tracking',
      description: 'Track all your products, stock levels, and movements in real-time.'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Get insights into your inventory with powerful analytics and reports.'
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Invite team members and manage roles with admin controls.'
    },
    {
      icon: Shield,
      title: 'Secure & Isolated',
      description: 'Your data is completely isolated and secure from other companies.'
    }
  ]

  const pricingFeatures = [
    'Unlimited products',
    'Unlimited categories',
    'Stock movement tracking',
    'Team collaboration',
    'Analytics dashboard',
    'Low stock alerts'
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Package className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold text-white">StockFlow</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Manage Your Inventory
            <span className="text-blue-500"> Effortlessly</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            The all-in-one inventory management platform for businesses of all sizes.
            Track stock, manage teams, and grow your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors border border-gray-700"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Everything You Need to Manage Inventory
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-400 mb-12">Start free, upgrade when you're ready.</p>
          
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="mb-6">
              <span className="text-5xl font-bold text-white">Free</span>
              <span className="text-gray-400 ml-2">to get started</span>
            </div>
            <ul className="grid sm:grid-cols-2 gap-3 mb-8">
              {pricingFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-300">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold w-full sm:w-auto transition-colors"
            >
              Create Your Account
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Take Control of Your Inventory?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join thousands of businesses managing their stock with StockFlow.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Get Started Now
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-blue-500" />
            <span className="font-semibold text-white">StockFlow</span>
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} StockFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
