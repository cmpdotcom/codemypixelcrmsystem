"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import {
  User,
  Mail,
  Lock,
  Building2,
  Eye,
  EyeOff,
  ArrowUp,
  Users2,
  CheckCircle2,
  BarChart2,
  Rocket,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    workEmail: "",
    password: "",
    confirmPassword: "",
    companyName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        formData.workEmail,
        formData.password,
      );
      // Store a user profile document in Firestore.
      await setDoc(doc(db, "users", cred.user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.workEmail,
        company: formData.companyName,
        createdAt: new Date().toISOString(),
      });
      router.push("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message.replace("Firebase: ", "") : "Signup failed",
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between overflow-x-hidden font-sans selection:bg-blue-100 text-slate-900 bg-[#f4f7fc]">
      {/* 3D Flowing Silk Waves Ambient Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-multiply"
          style={{ backgroundImage: "url('/flowing_silk_bg.jpg')" }}
        />
        {/* Soft atmospheric gradient glows */}
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-blue-200/30 rounded-full blur-[110px]" />
        <div className="absolute top-1/3 -right-32 w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 left-1/4 w-[550px] h-[450px] bg-sky-100/45 rounded-full blur-[100px]" />
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
          <span>Already have an account?</span>
          <Link
            href="/login"
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Main Split Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10 py-2 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full my-auto">
          {/* Left Column: Value Prop & Photorealistic 3D Platform Visual */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50/90 border border-blue-200/60 text-blue-600 text-xs font-semibold shadow-2xs backdrop-blur-xs">
                <span>Join Thousands</span>
              </div>

              {/* Headline */}
              <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Build a
                <br />
                Stronger Business
                <br />
                with <span className="text-blue-600">NexaCRM</span>
              </h2>

              {/* Subtitle */}
              <p className="text-sm text-slate-600 leading-relaxed max-w-md">
                From first contact to final delivery — bring your sales, clients and
                projects together.
              </p>

              {/* 5 Feature Items */}
              <div className="space-y-2.5 pt-1">
                {[
                  {
                    icon: ArrowUp,
                    text: "Boost Sales Efficiency",
                    bg: "bg-emerald-100/70 text-emerald-600",
                  },
                  {
                    icon: Users2,
                    text: "Improve Team Collaboration",
                    bg: "bg-indigo-100/70 text-indigo-600",
                  },
                  {
                    icon: CheckCircle2,
                    text: "Deliver Projects on Time",
                    bg: "bg-amber-100/70 text-amber-500",
                  },
                  {
                    icon: BarChart2,
                    text: "Get Real-time Insights",
                    bg: "bg-blue-100/70 text-blue-600",
                  },
                  {
                    icon: Rocket,
                    text: "Scale Your Business",
                    bg: "bg-rose-100/70 text-rose-500",
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
            </div>

            {/* Photorealistic 3D Isometric Glass Cube Platform Scene */}
            <div className="relative pt-2 pb-2 max-w-md hidden sm:flex flex-col items-center">
              {/* Glowing aura */}
              <div className="w-64 h-64 bg-gradient-to-tr from-blue-300/35 via-sky-200/30 to-indigo-200/20 rounded-full blur-3xl absolute -z-10" />

              {/* Setters pill (Top) */}
              <div className="bg-white/95 backdrop-blur-md border border-white/90 shadow-[0_2px_10px_rgba(0,0,0,0.06)] rounded-full px-3.5 py-1 text-[11px] font-semibold text-slate-700 flex items-center gap-1.5 mb-1 hover:scale-105 transition-transform cursor-pointer z-10">
                <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                <span>Setters</span>
              </div>

              {/* Center Row: Closers - 3D Glass Cube - Developers */}
              <div className="flex items-center justify-center gap-2 w-full relative">
                {/* Closers pill (Left) */}
                <div className="bg-white/95 backdrop-blur-md border border-white/90 shadow-[0_2px_10px_rgba(0,0,0,0.06)] rounded-full px-3.5 py-1 text-[11px] font-semibold text-slate-700 flex items-center gap-1.5 hover:scale-105 transition-transform cursor-pointer z-10">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Closers</span>
                </div>

                {/* 3D Isometric Glass Cube Image with Caustics & Reflections */}
                <div className="relative w-40 h-40 flex items-center justify-center group">
                  <img
                    src="/signup_3d_cube.jpg"
                    alt="Unified 3D Platform"
                    className="w-full h-full object-contain rounded-2xl drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle glass reflection highlight */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent via-white/10 to-transparent pointer-events-none" />
                </div>

                {/* Developers pill (Right) */}
                <div className="bg-white/95 backdrop-blur-md border border-white/90 shadow-[0_2px_10px_rgba(0,0,0,0.06)] rounded-full px-3.5 py-1 text-[11px] font-semibold text-slate-700 flex items-center gap-1.5 hover:scale-105 transition-transform cursor-pointer z-10">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  <span>Developers</span>
                </div>
              </div>

              {/* One Unified Platform pill (Bottom) */}
              <div className="mt-1 bg-white/95 backdrop-blur-md border border-white/90 shadow-[0_4px_16px_rgba(0,0,0,0.08)] rounded-full px-4 py-1.5 text-xs font-bold text-slate-800 flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer z-10">
                <div className="w-4 h-4 bg-blue-600 rounded text-white flex items-center justify-center text-[9px] font-bold shadow-xs">
                  N
                </div>
                <span>One Unified Platform</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Create Your Account Card */}
          <div className="lg:col-span-6 xl:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-[28px] border border-white/90 shadow-[0_4px_24px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] p-7 sm:p-9 relative">
              <div className="mb-5">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Create Your Account
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Get started with NexaCRM today
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {error && (
                  <div className="rounded-xl bg-rose-50 border border-rose-100 px-3.5 py-2.5 text-xs font-medium text-rose-600">
                    {error}
                  </div>
                )}
                {/* First Name & Last Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        required
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        className="block w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Last Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        required
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        className="block w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Work Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Work Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="email"
                      required
                      name="workEmail"
                      value={formData.workEmail}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      className="block w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-2xs"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      className="block w-full pl-9 pr-9 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className="block w-full pl-9 pr-9 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Company Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      required
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Your company name"
                      className="block w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-2xs"
                    />
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="pt-0.5">
                  <label className="flex items-start gap-2 cursor-pointer select-none text-[11px] text-slate-600 leading-snug">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="w-4 h-4 mt-0.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <span>
                      I agree to the{" "}
                      <a href="#" className="font-semibold text-blue-600 hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="font-semibold text-blue-600 hover:underline">
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!agreedToTerms || loading}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white text-xs font-semibold py-3 px-4 rounded-xl transition-all shadow-md shadow-blue-600/25 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{loading ? "Creating account…" : "Create Account"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Or sign up with divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100" />
                </div>
                <div className="relative flex justify-center text-[11px] text-slate-400 uppercase tracking-wider">
                  <span className="bg-white px-3">or sign up with</span>
                </div>
              </div>

              {/* Social Sign Up Buttons (Side by Side) */}
              <div className="grid grid-cols-2 gap-3">
                {/* Google */}
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer"
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
                  <span>Google</span>
                </button>

                {/* Microsoft */}
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M1 1h10v10H1z" />
                    <path fill="#81bc06" d="M12 1h10v10H12z" />
                    <path fill="#05a6f0" d="M1 12h10v10H1z" />
                    <path fill="#ffba08" d="M12 12h10v10H12z" />
                  </svg>
                  <span>Microsoft</span>
                </button>
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
