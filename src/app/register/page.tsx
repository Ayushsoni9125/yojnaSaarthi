"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";

type FieldErrors = Partial<
  Record<"name" | "email" | "password" | "confirmPassword", string[]>
>;

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );

const CheckIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const passwordRules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
  { label: "One special character", test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors?.fieldErrors) {
          setFieldErrors(data.errors.fieldErrors);
          toast.error("Please fix the errors below.");
          return;
        }
        toast.error(data.message || "Registration failed.");
        return;
      }

      toast.success("Account created! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1800);
    } catch {
      toast.error("Something went wrong. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = passwordRules.filter((r) => r.test(formData.password)).length;
  const strengthLabel = ["", "Weak", "Weak", "Fair", "Good", "Strong"][passwordStrength];
  const strengthColor = ["", "#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"][passwordStrength];

  return (
    <main className="flex-1 flex">
      {/* ── Left panel — branding ── */}
      <div
        className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #064e3b 0%, #065f46 40%, #047857 75%, #059669 100%)",
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #6ee7b7, transparent)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #a7f3d0, transparent)" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #ffffff, transparent)" }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
              style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", color: "#fff" }}
            >
              य
            </div>
            <span className="text-white text-xl font-bold tracking-wide">YojanaSaarthi</span>
          </Link>
        </div>

        {/* Center copy */}
        <div className="relative z-10 space-y-6">
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              Your guide to every government scheme
            </h2>
            <p className="mt-4 text-emerald-200 text-base leading-relaxed">
              Create your free account and get personalized recommendations across thousands of central and state government schemes.
            </p>
          </div>

          {/* Feature pills */}
          <div className="space-y-3">
            {[
              "🎯 AI-powered scheme recommendations",
              "📌 Bookmark schemes for later",
              "🔔 Get alerts for new schemes",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-emerald-100 text-sm"
              >
                <div
                  className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.12)" }}
                >
                  <svg className="w-3 h-3 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="relative z-10">
          <p className="text-emerald-300 text-xs">
            Trusted by citizens across India · Completely free
          </p>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8 hover:opacity-90 transition-opacity w-fit">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
              style={{ background: "linear-gradient(135deg, #064e3b, #059669)" }}
            >
              य
            </div>
            <span className="font-bold text-slate-800">YojanaSaarthi</span>
          </Link>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Create your account</h1>
            <p className="mt-2 text-slate-500 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                Sign in instead
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Your Name"
                disabled={loading}
                className={`w-full rounded-xl border px-4 py-3 text-sm bg-white text-slate-900 placeholder-slate-400 outline-none transition-all
                  focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                  disabled:bg-slate-50 disabled:text-slate-400
                  ${fieldErrors.name ? "border-red-400 focus:ring-red-400 focus:border-red-400 bg-red-50" : "border-slate-200"}`}
              />
              {fieldErrors.name && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <XIcon /> {fieldErrors.name[0]}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                disabled={loading}
                className={`w-full rounded-xl border px-4 py-3 text-sm bg-white text-slate-900 placeholder-slate-400 outline-none transition-all
                  focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                  disabled:bg-slate-50 disabled:text-slate-400
                  ${fieldErrors.email ? "border-red-400 focus:ring-red-400 focus:border-red-400 bg-red-50" : "border-slate-200"}`}
              />
              {fieldErrors.email && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <XIcon /> {fieldErrors.email[0]}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="Create a strong password"
                  disabled={loading}
                  className={`w-full rounded-xl border px-4 py-3 pr-11 text-sm bg-white text-slate-900 placeholder-slate-400 outline-none transition-all
                    focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                    disabled:bg-slate-50 disabled:text-slate-400
                    ${fieldErrors.password ? "border-red-400 focus:ring-red-400 focus:border-red-400 bg-red-50" : "border-slate-200"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>

              {/* Strength bar */}
              {formData.password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                          background: i <= passwordStrength ? strengthColor : "#e2e8f0",
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-medium" style={{ color: strengthColor }}>
                    {strengthLabel}
                  </p>
                </div>
              )}

              {/* Password checklist — shown on focus or when typing */}
              {(passwordFocused || formData.password.length > 0) && (
                <ul className="mt-3 space-y-1.5 bg-slate-50 rounded-xl p-3 border border-slate-100">
                  {passwordRules.map((rule) => {
                    const passed = rule.test(formData.password);
                    return (
                      <li key={rule.label} className="flex items-center gap-2 text-xs">
                        <span
                          className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-all duration-200"
                          style={{ background: passed ? "#22c55e" : "#e2e8f0", color: passed ? "#fff" : "#94a3b8" }}
                        >
                          {passed ? <CheckIcon /> : <XIcon />}
                        </span>
                        <span className={passed ? "text-slate-700" : "text-slate-400"}>
                          {rule.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}

              {fieldErrors.password && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <XIcon /> {fieldErrors.password[0]}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  disabled={loading}
                  className={`w-full rounded-xl border px-4 py-3 pr-11 text-sm bg-white text-slate-900 placeholder-slate-400 outline-none transition-all
                    focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                    disabled:bg-slate-50 disabled:text-slate-400
                    ${fieldErrors.confirmPassword
                      ? "border-red-400 focus:ring-red-400 focus:border-red-400 bg-red-50"
                      : formData.confirmPassword && formData.password === formData.confirmPassword
                      ? "border-emerald-400 focus:ring-emerald-400"
                      : "border-slate-200"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <XIcon /> {fieldErrors.confirmPassword[0]}
                </p>
              )}
              {formData.confirmPassword && !fieldErrors.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="mt-1.5 text-xs text-emerald-600 flex items-center gap-1">
                  <CheckIcon /> Passwords match
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden"
              style={{
                background: loading
                  ? "#6b7280"
                  : "linear-gradient(135deg, #064e3b 0%, #059669 100%)",
                boxShadow: loading ? "none" : "0 4px 16px rgba(5,150,105,0.35)",
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                )}
                {loading ? "Creating account..." : "Create Account"}
              </span>
            </button>

            {/* Divider */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-slate-50 px-3 text-xs text-slate-400">or continue with</span>
              </div>
            </div>

            {/* Google OAuth */}
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400">
            By creating an account, you agree to our{" "}
            <span className="underline cursor-pointer hover:text-slate-600">Terms of Service</span>
            {" "}and{" "}
            <span className="underline cursor-pointer hover:text-slate-600">Privacy Policy</span>
          </p>
        </div>
      </div>
    </main>
  );
}