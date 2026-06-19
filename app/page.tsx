"use client";

import Link from "next/link";
import { Heart, Shield, TrendingUp, Users, Zap, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-red-500" />
            <span className="text-2xl font-bold text-white">Resurgence</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="px-6 py-2 text-slate-300 hover:text-white transition">
              Login
            </Link>
            <Link href="/signup" className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Disaster Relief <span className="text-red-500">Powered by Blockchain</span>
        </h1>
        <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
          Fast, transparent, and secure emergency aid distribution using Stellar blockchain technology.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/signup" className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Deploy Emergency Fund
          </Link>
          <Link href="/dashboard" className="px-8 py-3 border border-slate-600 text-white rounded-lg hover:border-slate-400 transition font-semibold">
            View Dashboard
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">Platform Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: "Rapid Deployment", desc: "Deploy emergency funds in minutes with multi-sig security" },
            { icon: Shield, title: "Biometric-Free ID", desc: "Verify beneficiaries without biometric data collection" },
            { icon: TrendingUp, title: "Conditional Transfers", desc: "Set spending rules and location-based restrictions" },
            { icon: Users, title: "Merchant Network", desc: "Onboard local merchants for economic recovery" },
            { icon: Globe, title: "Supply Tracking", desc: "Track aid shipments with temperature monitoring" },
            { icon: Shield, title: "Fraud Prevention", desc: "Pattern detection and duplicate registration prevention" },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-red-500/50 transition">
                <Icon className="w-8 h-8 text-red-500 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Disaster Relief?</h2>
          <p className="text-red-100 mb-8">Join humanitarian organizations using blockchain for transparent aid delivery.</p>
          <Link href="/signup" className="px-8 py-3 bg-white text-red-600 rounded-lg hover:bg-slate-100 transition font-semibold inline-block">
            Start Your Journey
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-950/50 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-slate-400">
          <p>Built with ❤️ for the global humanitarian community</p>
          <p className="mt-2 text-sm">Using blockchain technology to deliver aid more efficiently, transparently, and securely.</p>
        </div>
      </footer>
    </div>
  );
}
