"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Input, { InputVariant } from "../components/Input";
import Button, { ButtonVariant } from "../components/Button";
import { useMutation } from "@tanstack/react-query";

// API
import { LoginAPI } from "../api/auth.api";
import { AxiosError } from "axios";

const Login = () => {
  // States
  const [loginForm, setLoginForm] = useState<{
    email: string;
    password: string;
  }>({ email: "", password: "" });

  // Hooks
  const router = useRouter();

  // Mutations
  const loginMutation = useMutation({
    mutationFn: LoginAPI,
    onSuccess: (data) => {
      if(data.ok) router.push("/dashboard");
    },
    onError: (error) => {
    }
  })


  const handleLogin = () => {
    if(!loginForm.email || !loginForm.password) return;

    loginMutation.mutate(loginForm);
  }

  return (
    <main className="w-screen h-screen flex items-center justify-center select-none">
      <div className="bg-secondary-bg flex px-3 py-3 gap-4 w-[60vw] h-[70vh] rounded-xl border border-primary-border">
        <div className="w-full h-full bg-white rounded-lg"></div>

        <div className="w-[60%] h-full flex flex-col items-start justify-start gap-4" onKeyDown={(e) => {
          if(e.key == 'enter')
            handleLogin()
        }}>
          <span className="text-xl font-semibold">Login</span>

          <div className="flex flex-col gap-2 items-center justify-center w-full">
            <Input variant={InputVariant.PRIMARY} placeholder="Email" value={loginForm.email} onChange={(e) => {
              setLoginForm({...loginForm, email: e.target.value})
            }}/>
            <Input
              variant={InputVariant.PRIMARY}
              placeholder="Password"
              type="password"
              value={loginForm.password}
              onChange={(e) => {
                setLoginForm({...loginForm, password: e.target.value})
              }}
            />
          </div>

          <Link
            href="/forgot-password"
            className="text-xs text-primary-blue font-medium hover:underline ml-auto"
          >
            Forgot Password?
          </Link>

          <Button variant={ButtonVariant.PRIMARY} text="Login" onClick={handleLogin} onLoadingText={'Logging in...'} isLoading={loginMutation.isPending}/>

          <div className="flex w-full items-center justify-center my-6">
            <div className="w-full h-px bg-primary-border"></div>
            <span className="mx-2 text-primary-text">OR</span>
            <div className="w-full h-px bg-primary-border"></div>
          </div>

          <div className="flex flex-col gap-4 w-full items-center justify-center">
            <Button
              variant={ButtonVariant.SECONDARY_OUTLINE}
              text="Login with Google"
              onClick={() => {
                if(window)
                  window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`
              }}
            />
            <div>
              <span className="text-sm font-semibold">
                Don't have an account?{" "}
              </span>
              <Link
                href="/signup"
                className="text-sm text-primary-blue font-medium hover:underline"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
