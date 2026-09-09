"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Users,
  Box,
  BarChart2,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between overflow-x-hidden font-sans selection:bg-blue-100 text-slate-900 bg-[#f4f7fc]">
      {/* 3D Flowing Silk Waves Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-45 mix-blend-multiply"
          style={{ backgroundImage: "url('/flowing_silk_bg.jpg')" }}
        />
        {/* Ambient subtle gradient glow filters */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 -right-32 w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-[120px]" />
        <div className="absolute -bottom-20 left-1/4 w-[500px] h-[400px] bg-sky-100/40 rounded-full blur-[90px]" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xl h-9 w-9 shadow-sm shadow-blue-500/25 group-hover:scale-105 transition-transform">
            N
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-none">
              NexaCRM
            </h1>
            <p className="text-[10px] text-slate-400 mt-0.5 font-medium tracking-wide">
              Sell. Deliver. Grow.
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <span>New here?</span>
          <Link
            href="/signup"
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Create an account
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10 py-2 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full my-auto">
          {/* Left Column: Brand Hero + Desk Setup Mockup */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50/90 border border-blue-200/60 text-blue-600 text-xs font-semibold shadow-2xs backdrop-blur-xs">
                <span>All-in-One CRM</span>
              </div>

              {/* Heading */}
              <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Turn
                <br />
                Opportunities
                <br />
                Into <span className="text-blue-600">Success</span>
              </h2>

              {/* Subtitle */}
              <p className="text-sm text-slate-600 leading-relaxed max-w-md">
                Manage leads, close deals, deliver projects and grow your business —
                all in one place.
              </p>

              {/* Feature Points */}
              <div className="space-y-2.5 pt-1">
                {[
                  {
                    icon: TrendingUp,
                    text: "Leads & Sales",
                    bg: "bg-blue-100/70 text-blue-600",
                  },
                  {
                    icon: Users,
                    text: "Team Collaboration",
                    bg: "bg-indigo-100/70 text-indigo-600",
                  },
                  {
                    icon: Box,
                    text: "Project Management",
                    bg: "bg-pink-100/70 text-pink-500",
                  },
                  {
                    icon: BarChart2,
                    text: "Real-time Analytics",
                    bg: "bg-emerald-100/70 text-emerald-600",
                  },
                  {
                    icon: ShieldCheck,
                    text: "Secure & Reliable",
                    bg: "bg-sky-100/70 text-sky-600",
                  },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${item.bg}`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">
                        {item.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Quote Card */}
              <div className="bg-white/80 backdrop-blur-md border border-white/80 rounded-2xl p-4 max-w-md shadow-sm">
                <div className="flex items-start gap-2.5">
                  <span className="text-2xl text-blue-400 font-serif leading-none inline-block">
                    “
                  </span>
                  <div>
                    <p className="text-xs italic text-slate-700 leading-normal">
                      &ldquo;A better process leads to a brighter future.&rdquo;
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">
                      — Your CRM, Your Growth Partner
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Photorealistic Laptop Desk Scene */}
            <div className="relative pt-2 max-w-md hidden sm:block">
              <div className="relative rounded-2xl overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.08)] border border-white/60 bg-white/40 backdrop-blur-xs group">
                <img
                  src="/login_laptop_desk.jpg"
                  alt="NexaCRM Dashboard on Laptop"
                  className="w-full h-48 object-cover object-center group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Right Column: Floating Login Card */}
          <div className="lg:col-span-6 xl:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-[28px] border border-white/90 shadow-[0_4px_24px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] p-8 sm:p-9 relative">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Welcome Back!
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Login to your NexaCRM account
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-xl bg-rose-50 border border-rose-100 px-3.5 py-2.5 text-xs font-medium text-rose-600">
                    {error}
                  </div>
                )}
                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="block w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-2xs"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="block w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <span>Remember me</span>
                  </label>
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white text-xs font-semibold py-3 px-4 rounded-xl transition-all shadow-md shadow-blue-600/25 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{loading ? "Signing in…" : "Login"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Or continue with divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100" />
                </div>
                <div className="relative flex justify-center text-[11px] text-slate-400 uppercase tracking-wider">
                  <span className="bg-white px-3">or continue with</span>
                </div>
              </div>

              {/* Social Login Buttons (Stacked full-width) */}
              <div className="space-y-2.5">
                {/* Google */}
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* Microsoft */}
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M1 1h10v10H1z" />
                    <path fill="#81bc06" d="M12 1h10v10H12z" />
                    <path fill="#05a6f0" d="M1 12h10v10H1z" />
                    <path fill="#ffba08" d="M12 12h10v10H12z" />
                  </svg>
                  <span>Continue with Microsoft</span>
                </button>
              </div>

              {/* Bottom Switcher */}
              <div className="text-center mt-6 text-xs text-slate-500">
                <span>New to NexaCRM? </span>
                <Link
                  href="/signup"
                  className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10 py-5 flex items-center justify-end">
        <div className="text-right">
          <p className="text-xs font-bold text-slate-900 leading-none">NexaCRM</p>
          <p className="text-[10px] text-slate-400 font-medium">Sell. Deliver. Grow.</p>
        </div>
      </footer>
    </div>
  );
}
