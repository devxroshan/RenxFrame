"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Input, { InputVariant } from "../components/Input";
import Button, { ButtonVariant } from "../components/Button";
import { useMutation } from "@tanstack/react-query";

// Wrappers
import NonProtectedRoute from "../Wrappers/NonProtectedRoute";

// Stores
import { useAppStore } from "../stores/app.store";

// API
import { ForgotPasswordAPI, LoginAPI } from "../api/auth.api";
import { ToastIcon } from "../config/types.config";
import { APIErrorReseponse, APISuccessResponse } from "../config/api.config";

const Login = () => {
  // States
  const [loginForm, setLoginForm] = useState<{
    email: string;
    password: string;
  }>({ email: "", password: "" });
  const [isForgotPassword, setForgotPassword] = useState<boolean>(false);

  // Hooks
  const router = useRouter();

  // Stores
  const appStore = useAppStore();

  // Mutations
  const loginMutation = useMutation({
    mutationFn: LoginAPI,
    onSuccess: (data: APISuccessResponse) => {
      if (data.ok) router.replace(process.env.NEXT_PUBLIC_LOGGED_IN_PAGE as string)
    },
    onError: (error: APIErrorReseponse) => {
      appStore.addToast({
        msg: error.msg,
        code: error.code,
        iconType: error.status == 500 ? ToastIcon.ERROR : ToastIcon.WARNING,
      });
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: ForgotPasswordAPI,
    onSuccess: (data) => {
      if(data.ok) appStore.addToast({
        msg: data.msg,
        code: 'Successfull',
        iconType: ToastIcon.SUCCESS
      })
    },
    onError: (error: APIErrorReseponse) => {
      appStore.addToast({
        msg: error.msg,
        code: error.code,
        iconType: error.status == 500 ? ToastIcon.ERROR : ToastIcon.WARNING,
      });
    },
  });

  const handleLogin = () => {
    if (!loginForm.email || !loginForm.password) return;

    loginMutation.mutate(loginForm);
  };

  const handleForgotPassword = () => {
    if (!loginForm.email) return;

    forgotPasswordMutation.mutate({ email: loginForm.email });
  };

  return (
    <NonProtectedRoute>
      <main className="w-screen h-screen flex items-center justify-center select-none">
        <div className="bg-secondary-bg flex px-3 py-3 gap-4 w-[60vw] md:w-[40vw] lg:w-[60vw] h-[70vh] rounded-xl border border-primary-border">
          <div className="w-full h-full bg-white rounded-lg hidden lg:flex"></div>

          <div
            className="w-full lg:w-[60%] h-full flex flex-col items-start justify-start gap-4"
            onKeyDown={(e) => {
              if (e.key == "Enter") handleLogin();
            }}
          >
            <span className="text-xl font-semibold">Login</span>

            {!isForgotPassword && (
              <div className="flex w-full flex-col gap-4 items-center justify-center">
                <div className="flex flex-col gap-2 items-center justify-center w-full">
                  <Input
                    variant={InputVariant.PRIMARY}
                    placeholder="Email"
                    value={loginForm.email}
                    onChange={(e) => {
                      setLoginForm({ ...loginForm, email: e.target.value });
                    }}
                  />
                  <Input
                    variant={InputVariant.PRIMARY}
                    placeholder="Password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => {
                      setLoginForm({ ...loginForm, password: e.target.value });
                    }}
                  />
                </div>

                <button
                  className="font-medium text-xs text-primary-blue hover:text-primary-blue-hover cursor-pointer transition-all duration-300 ml-auto outline-none"
                  onClick={() => setForgotPassword(true)}
                >
                  Forgot Password?
                </button>

                <Button
                  variant={ButtonVariant.PRIMARY}
                  text="Login"
                  onClick={handleLogin}
                  onLoadingText={"Logging in..."}
                  isLoading={loginMutation.isPending}
                />
              </div>
            )}

            {isForgotPassword && (
              <div
                className="flex flex-col gap-4 w-full items-center justify-center"
                onKeyDown={(e) => {
                  if (e.key == "Enter") handleForgotPassword();
                }}
              >
                <Input
                  variant={InputVariant.PRIMARY}
                  placeholder="Email"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                />

                <button
                  className="text-xs text-primary-blue hover:text-primary-blue-hover cursor-pointer font-medium ml-auto"
                  onClick={() => setForgotPassword(false)}
                >
                  Back to Login
                </button>

                <Button
                  variant={ButtonVariant.PRIMARY}
                  text="Send Reset Link"
                  onLoadingText="Sending..."
                  onClick={handleForgotPassword}
                  isLoading={forgotPasswordMutation.isPending}
                />
              </div>
            )}

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
                  if (window)
                    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
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
    </NonProtectedRoute>
  );
};

export default Login;
