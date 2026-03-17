"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { ArrowRight, Mail, Lock, Eye, EyeOff } from "lucide-react";

import { motion } from "motion/react";
import { useShake } from "@/hooks";

interface LoginFormProps {
  onSubmit: (credentials: { email: string; password: string; rememberMe: boolean }) => void;
  onNavigate: (page: string) => void;
  isLoading?: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export function LoginForm({ onSubmit, onNavigate, isLoading = false }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false,
  });

  const { shakeTrigger, triggerShake } = useShake();

  // Email validation
  const validateEmail = (email: string): string | undefined => {
    if (!email) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return undefined;
  };

  // Password validation
  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    return undefined;
  };

  // Handle field blur
  const handleBlur = (field: "email" | "password") => {
    setTouched({ ...touched, [field]: true });

    if (field === "email") {
      const emailError = validateEmail(email);
      setErrors({ ...errors, email: emailError });
    } else if (field === "password") {
      const passwordError = validatePassword(password);
      setErrors({ ...errors, password: passwordError });
    }
  };

  // Handle email change
  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (touched.email) {
      const emailError = validateEmail(value);
      setErrors({ ...errors, email: emailError });
    }
  };

  // Handle password change
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (touched.password) {
      const passwordError = validatePassword(value);
      setErrors({ ...errors, password: passwordError });
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ email: true, password: true });

    // Validate all fields
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
      });
      triggerShake();
      return;
    }

    // Clear errors and submit
    setErrors({});
    onSubmit({ email, password, rememberMe });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-5"
      animate={
        shakeTrigger > 0
          ? {
              x: [0, -10, 10, -10, 10, 0],
            }
          : {}
      }
      transition={{ duration: 0.4 }}
      key={shakeTrigger}
    >
      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Mail className="w-5 h-5" />
          </div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            onBlur={() => handleBlur("email")}
            className={`w-full mt-4 pl-11 pr-4 py-3 bg-card border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
              errors.email && touched.email
                ? "border-red-500 focus:ring-red-500/50 focus:border-red-500"
                : "border-border focus:ring-primary/50 focus:border-primary"
            }`}
            placeholder="you@example.com"
            disabled={isLoading}
          />
        </div>
        {errors.email && touched.email && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <span className="text-xs">⚠</span> {errors.email}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <button
            type="button"
            onClick={() => onNavigate("forgot-password")}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Forgot Password?
          </button>
        </div>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Lock className="w-5 h-5" />
          </div>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            onBlur={() => handleBlur("password")}
            className={`w-full mt-2 pl-11 pr-12 py-3 bg-card border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
              errors.password && touched.password
                ? "border-red-500 focus:ring-red-500/50 focus:border-red-500"
                : "border-border focus:ring-primary/50 focus:border-primary"
            }`}
            placeholder="••••••••"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground/70 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && touched.password && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <span className="text-xs">⚠</span> {errors.password}
          </p>
        )}
      </div>

      {/* Remember Me */}
      <div className="flex items-center">
        <input
          id="remember"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="w-4 h-4 rounded border-border bg-card text-primary focus:ring-primary/50 focus:ring-2 cursor-pointer"
          disabled={isLoading}
        />
        <label htmlFor="remember" className="ml-2 text-sm text-muted-foreground cursor-pointer">
          Remember me for 30 days
        </label>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-7 text-base transition-all hover:shadow-[0_0_30px_rgba(38,213,120,0.3)] disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            Signing in...
          </span>
        ) : (
          <>
            Sign In
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </Button>
    </motion.form>
  );
}
