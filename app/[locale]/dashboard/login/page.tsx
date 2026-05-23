"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Scissors, Loader2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/app/lib/utils";

export default function LoginPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale ?? "en";
  const isRTL = locale === "ar";
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const labels = {
    title: isRTL ? "دخول المالك" : "Owner Login",
    subtitle: isRTL ? "الوصول إلى لوحة تحكم صالونك" : "Access your barbershop dashboard",
    email: isRTL ? "البريد الإلكتروني" : "Email Address",
    password: isRTL ? "كلمة المرور" : "Password",
    login: isRTL ? "تسجيل الدخول" : "Sign In",
    error: isRTL ? "بريد إلكتروني أو كلمة مرور غير صحيحة" : "Invalid email or password",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError(labels.error);
    } else {
      router.push(`/${locale}/dashboard`);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 gold-gradient rounded-full flex items-center justify-center mx-auto mb-4">
            <Scissors className="w-8 h-8 text-black" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-serif font-bold text-cream">{labels.title}</h1>
          <p className="text-cream/50 text-sm mt-1">{labels.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="dark-card rounded-2xl p-8 space-y-5">
          <div>
            <label className={cn("block text-cream/60 text-xs mb-1.5", isRTL && "text-right")}>
              {labels.email}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={cn(
                "w-full bg-white/5 border border-gold/10 rounded-xl px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/40 transition-colors",
                isRTL && "text-right"
              )}
              placeholder="owner@royalcuts.com"
            />
          </div>

          <div>
            <label className={cn("block text-cream/60 text-xs mb-1.5", isRTL && "text-right")}>
              {labels.password}
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={cn(
                  "w-full bg-white/5 border border-gold/10 rounded-xl px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/40 transition-colors",
                  isRTL ? "text-right pr-4 pl-10" : "pr-10"
                )}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className={cn("absolute top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream/70", isRTL ? "left-3" : "right-3")}
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className={cn("text-red-400 text-sm", isRTL && "text-right")}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {labels.login}
          </button>
        </form>
      </div>
    </div>
  );
}
