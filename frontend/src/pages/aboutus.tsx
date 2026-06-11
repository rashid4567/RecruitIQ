'use client'

import { useState } from 'react'
import { Menu, X, Users, Building2, TrendingUp, Clock, Zap, Shield, BarChart3, Headphones, Lightbulb, Star, Share2, Mail, Link as LinkIcon, Share, Eye, Database } from 'lucide-react'
import Header from './landing/sections/Header'

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Stats data
  const stats = [
    { icon: Users, value: '10,000+', label: 'Enterprise Users' },
    { icon: Building2, value: '5,000+', label: 'Companies Using' },
    { icon: TrendingUp, value: '98%', label: 'Success Rate' },
    { icon: Clock, value: '24/7', label: 'Support Available' },
  ]

  // Features data
  const features = [
    {
      icon: Zap,
      title: 'Smart Matching',
      description: 'Advanced AI algorithms match candidates with perfect job fits automatically',
    },
    {
      icon: Users,
      title: 'Quick Onboarding',
      description: 'Get your team up and running in minutes with our intuitive setup',
    },
    {
      icon: Shield,
      title: 'Data Security',
      description: 'Enterprise-grade security ensures candidate data stays protected always',
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Track hiring metrics and gain actionable insights in real-time',
    },
    {
      icon: Headphones,
      title: 'Expert Support',
      description: 'Dedicated support team available 24/7 for assistance and guidance',
    },
    {
      icon: Lightbulb,
      title: 'Continuous Innovation',
      description: 'Regular updates with new AI-powered features and improvements',
    },
  ]

  // Journey milestones
  const milestones = [
    {
      year: '2020',
      title: 'Company Founded',
      description: 'We started with a mission to revolutionize recruitment technology',
    },
    {
      year: '2021',
      title: 'Series A Funding',
      description: 'Raised $10M to accelerate platform development and team growth',
    },
    {
      year: '2022',
      title: 'Market Expansion',
      description: 'Expanded to 15+ countries with enterprise clients across industries',
    },
    {
      year: '2024',
      title: 'AI Integration',
      description: 'Launched advanced AI-powered matching engine transforming hiring',
    },
  ]

  // Team members
  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      bio: 'Former VP at TechCorp with 15+ years in recruitment',
      color: 'bg-blue-100',
    },
    {
      name: 'Marcus Chen',
      role: 'CTO',
      bio: 'AI expert with background in machine learning at leading tech firms',
      color: 'bg-purple-100',
    },
    {
      name: 'Elena Rodriguez',
      role: 'VP Operations',
      bio: 'Led HR transformation at Fortune 500 companies globally',
      color: 'bg-pink-100',
    },
    {
      name: 'James Park',
      role: 'Head of Product',
      bio: 'Product strategist who scaled platforms to millions of users',
      color: 'bg-green-100',
    },
    {
      name: 'Amelia Wilson',
      role: 'Chief People Officer',
      bio: 'Talent management expert building exceptional teams',
      color: 'bg-yellow-100',
    },
    {
      name: 'Daniel Kumar',
      role: 'VP Sales',
      bio: 'Enterprise sales leader with proven track record',
      color: 'bg-orange-100',
    },
  ]

  // Testimonials
  const testimonials = [
    {
      rating: 5,
      text: 'RecruitIQ transformed our hiring process. We reduced time-to-hire by 60% and found better candidates than ever before.',
      author: 'Rachel Smith',
      company: 'Tech Innovations Inc',
    },
    {
      rating: 5,
      text: 'The AI matching is remarkable. We now get pre-screened candidates that actually fit our requirements perfectly.',
      author: 'Michael Torres',
      company: 'Global Ventures Ltd',
    },
    {
      rating: 5,
      text: 'The platform is intuitive and the support team is exceptional. They truly care about our success.',
      author: 'Jennifer Lee',
      company: 'Dynamic Solutions Corp',
    },
  ]

  // Security features
  const securityFeatures = [
    { icon: Shield, title: 'Enterprise Security', description: 'Bank-level encryption and security protocols' },
    { icon: Share, title: 'Data Privacy', description: 'GDPR and compliance certified for peace of mind' },
    { icon: Eye, title: 'Transparency', description: 'Complete audit trails and access logs' },
    { icon: Database, title: 'Backup & Recovery', description: 'Redundant systems ensure 99.9% uptime' },
  ]

  return (
    <main className="min-h-screen bg-white">
      {/* HEADER */}
      <Header/>

      {/* HERO SECTION */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-12">
        <div className="text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600">
            ✨ Introducing RecruitIQ 3.0
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Transforming <br /> Recruitment <br /> Through Intelligence
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Experience the future of recruitment with AI-powered candidate matching, intelligent screening, and comprehensive analytics to transform your hiring process.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition">
              Explore Our Platform →
            </button>
            <button className="px-8 py-3 border border-gray-900 text-gray-900 rounded-full font-medium hover:bg-gray-50 transition">
              Schedule Demo →
            </button>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <stat.icon className="w-8 h-8 text-gray-900" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose RecruitIQ?</h2>
          <p className="text-lg text-gray-600">
            We combine cutting-edge technology with human insight to transform hiring
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-8 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition">
              <feature.icon className="w-8 h-8 text-gray-900 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* JOURNEY SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
          <p className="text-lg text-gray-600">
            From inception to innovation, building the future of recruitment
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-200"></div>

          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <div key={index} className={`flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className="w-1/2 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 border-4 border-white">
                    {index + 1}
                  </div>
                </div>
                <div className={`w-1/2 ${index % 2 === 0 ? 'pl-12' : 'pr-12'}`}>
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="text-sm font-semibold text-gray-600 mb-1">{milestone.year}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                    <p className="text-gray-600 text-sm">{milestone.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section id="team" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Leadership Team</h2>
          <p className="text-lg text-gray-600">
            Experienced leaders driving innovation in recruitment technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div key={index} className="text-center">
              <div className={`w-24 h-24 ${member.color} rounded-lg mx-auto mb-4`}></div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
              <p className="text-sm text-gray-600 font-medium mb-3">{member.role}</p>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{member.bio}</p>
              <div className="flex justify-center gap-3">
                <button className="text-gray-400 hover:text-gray-600">
                  <Share2 size={18} />
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <Mail size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
          <p className="text-lg text-gray-600">
            Hear from companies transforming their recruitment with RecruitIQ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-8">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-gray-900 text-gray-900" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">{testimonial.text}</p>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.author}</p>
                <p className="text-sm text-gray-600">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECURITY SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
            <Shield className="w-6 h-6 text-gray-900" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Data is Safe</h2>
          <p className="text-lg text-gray-600">
            Enterprise-grade security protecting your most valuable asset
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {securityFeatures.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-lg mb-4">
                <feature.icon className="w-7 h-7 text-gray-900" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gray-900 rounded-2xl px-8 sm:px-16 py-16 text-center text-white">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Ready to Transform Your Recruitment?
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10">
            Join thousands of companies already using RecruitIQ to hire smarter and faster. Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition">
              Get Started Free →
            </button>
            <button className="px-8 py-3 border border-white text-white rounded-full font-medium hover:bg-white hover:bg-opacity-10 transition">
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-gray-900 font-bold text-sm">
                  R
                </div>
                <span className="font-bold">RecruitIQ</span>
              </div>
              <p className="text-gray-400 text-sm">
                Transforming recruitment through intelligent technology.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm text-center sm:text-left mb-4 sm:mb-0">
                © 2024 RecruitIQ. All rights reserved.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <LinkIcon size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <Share2 size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <Share size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
