"use client"

import Altcha from "@/components/core/altcha";
import { Nav } from "@/components/core/nav";
import { TbLogin } from "react-icons/tb";
import { useState, useEffect, Suspense } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/util/auth-client";

interface LoginForm {
  email: string;
  password: string;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [altchaState, setAltchaState] = useState<{ status: "success" | "error" | "expired" | "waiting", token: string }>({ status: "waiting", token: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  useEffect(() => {
    const message = searchParams.get('message');
    if (message) {
      setSuccessMessage(message);
    }
  }, [searchParams]);

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    if (altchaState.status !== "success") {
      setApiError("Please complete the captcha");
      return;
    }

    setIsLoading(true);
    setApiError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          token: altchaState.token,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setApiError(result.error || "Failed to sign in");
        return;
      }

      try {
        await authClient.signIn.email({
          email: data.email,
          password: data.password,
        });
        const redirectTo = searchParams.get('redirect') || "/";
        router.push(redirectTo);
      } catch (signInError) {
        console.error("Auth client sign in failed:", signInError);
        const redirectTo = searchParams.get('redirect') || "/";
        router.push(redirectTo);
      }
    } catch (error) {
      console.error("Login error:", error);
      setApiError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAltchaStateChange = (e: Event | CustomEvent) => {
    if ('detail' in e && e.detail?.payload) {
      setAltchaState({ status: "success", token: e.detail.payload });
    } else {
      setAltchaState({ status: "error", token: "" });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-18 sm:my-16 px-4 gap-18">
      <div className="flex flex-row items-center justify-between gap-2">
        <TbLogin size={32} className="sm:w-9 sm:h-9" />
        <h1 className="text-3xl sm:text-4xl font-bold">
          login
        </h1>
      </div>
      <form className="flex flex-col bg-foreground/10 rounded-2xl sm:rounded-4xl p-4 gap-4 w-1/4 min-w-80" onSubmit={handleSubmit(onSubmit)}>
        {successMessage && (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}

        <h2 className="text-2xl sm:text-3xl font-light text-center w-full flex flex-wrap">
          email
        </h2>
        <input
          type="email"
          placeholder="enter your email"
          className="w-full p-2 rounded-md bg-foreground/10"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email address"
            }
          })}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <h2 className="text-2xl sm:text-3xl font-light text-center w-full flex flex-wrap">
          password
        </h2>
        <input
          type="password"
          placeholder="enter your password"
          className="w-full p-2 rounded-md bg-foreground/10"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 1,
              message: "Password is required"
            }
          })}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        <h2 className="text-2xl sm:text-3xl font-light text-center w-full flex flex-wrap">
          captcha
        </h2>
        <Altcha onStateChange={handleAltchaStateChange} />

        {apiError && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {apiError}
          </div>
        )}

        <button
          className="bg-blue-400 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={isLoading || altchaState.status !== "success" || !altchaState.token}
        >
          {isLoading ? "Signing in..." : altchaState.status === "success" ? "login" : "waiting for captcha"}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-blue-400 hover:underline">
            Sign up here
          </a>
        </p>
      </form>
    </div>
  );
}

export default function Login() {
  return (
    <main>
      <Nav />
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
