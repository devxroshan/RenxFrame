"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

import Input, { InputVariant } from "../components/Input";
import Button, { ButtonVariant } from "../components/Button";
import { useMutation } from "@tanstack/react-query";

// Wrappres
import NonProtectedRoute from "../Wrappers/NonProtectedRoute";

// Stores
import { useAppStore } from "../stores/app.store";

// API
import { SignUpAPI } from "../api/auth.api";
import { APIErrorReseponse, APISuccessResponse } from "../config/api.config";

import { ToastIcon } from "../config/types.config";

interface SignUpForm {
  name: string;
  email: string;
  password: string;
}

interface SignUpFormChecks {
  name: {
    ok: boolean;
    msg: string;
  };
  email: {
    ok: boolean;
    msg: string;
  };
  password: {
    ok: boolean;
    msg: string;
  };
}

const SignUp = () => {
  // States
  const [signUpForm, setSignUpForm] = useState<SignUpForm>({
    name: "",
    email: "",
    password: "",
  });
  const [signUpFormChecks, setSignUpFormChecks] = useState<SignUpFormChecks>({
    name: { ok: false, msg: "Name is required." },
    email: { ok: false, msg: "Email shoule be valid." },
    password: {
      ok: false,
      msg: "Password should be 8 character long, has a uppercase letter, a lowercase letter, a digi and special character.",
    },
  });

  // Stores
  const appStore = useAppStore();

  // Mutations
  const signUpMutation = useMutation({
    mutationFn: SignUpAPI,
    onSuccess: (data: APISuccessResponse) => {},
    onError: (error: APIErrorReseponse) => {
      appStore.addToast({
        msg: error.msg,
        code: error.code,
        iconType: error.status == 500 ? ToastIcon.ERROR : ToastIcon.WARNING,
      });
    },
  });

  const handleSignUp = () => {
    if (!Object.values(signUpFormChecks).every((value) => value.ok === true)) {
      const invalidValueKeys = Object.keys(signUpFormChecks);
      invalidValueKeys.map((key) => {
        if (signUpFormChecks[key as keyof SignUpFormChecks].ok == false) {
          appStore.addToast({
            msg: signUpFormChecks[key as keyof SignUpFormChecks].msg ?? "",
            code: "VALIDATION ERROR",
            iconType: ToastIcon.WARNING,
          });
        }
      });
    } else {
      signUpMutation.mutate(signUpForm);
    }
  };

  const handleSignUpValidation = () => {
    setSignUpFormChecks({
      ...signUpFormChecks,
      name: {
        ok: signUpForm.name.length > 0,
        msg: signUpFormChecks.name.msg,
      },
      email: {
        ok: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
          signUpForm.email,
        ),
        msg: signUpFormChecks.email.msg,
      },
      password: {
        ok: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          signUpForm.password,
        ),
        msg: signUpFormChecks.password.msg,
      },
    });
  };

  useEffect(() => {
    handleSignUpValidation();
    return () => {};
  }, [signUpForm]);

  return (
    <NonProtectedRoute>
      <main className="w-screen h-screen flex items-center justify-center select-none">
        <div className="bg-secondary-bg flex px-3 py-3 gap-4 w-[60vw] md:w-[40vw] lg:w-[60vw] h-[70vh] rounded-xl border border-primary-border">
          <div className="w-full h-full bg-white rounded-lg hidden lg:flex"></div>

          <div
            className="w-full lg:w-[60%] h-full flex flex-col items-start justify-start gap-4"
            onKeyDown={(e) => {
              if (e.key == "Enter") handleSignUp();
            }}
          >
            <span className="text-xl font-semibold">Sign Up</span>

            <div className="flex flex-col gap-2 items-center justify-center w-full">
              <Input
                variant={InputVariant.PRIMARY}
                placeholder="Name"
                value={signUpForm.name}
                onChange={(e) => {
                  setSignUpForm({ ...signUpForm, name: e.target.value });
                }}
              />
              <Input
                variant={InputVariant.PRIMARY}
                placeholder="Email"
                value={signUpForm.email}
                onChange={(e) =>
                  setSignUpForm({ ...signUpForm, email: e.target.value })
                }
              />
              <Input
                variant={InputVariant.PRIMARY}
                placeholder="Password"
                type="password"
                value={signUpForm.password}
                onChange={(e) =>
                  setSignUpForm({ ...signUpForm, password: e.target.value })
                }
              />
            </div>

            <Button
              variant={ButtonVariant.PRIMARY}
              text="Sign Up"
              onLoadingText="Signing Up...."
              onClick={handleSignUp}
              isLoading={signUpMutation.isPending}
            />

            <div className="flex w-full items-center justify-center my-6">
              <div className="w-full h-px bg-primary-border"></div>
              <span className="mx-2 text-primary-text">OR</span>
              <div className="w-full h-px bg-primary-border"></div>
            </div>

            <div className="flex flex-col gap-4 w-full items-center justify-center">
              <Button
                variant={ButtonVariant.SECONDARY_OUTLINE}
                text="Sign Up with Google"
                onClick={() => {
                  if (window)
                    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
                }}
              />

              <div>
                <span className="text-sm font-semibold">
                  Already have an account?{" "}
                </span>
                <Link
                  href="/login"
                  className="text-sm text-primary-blue font-medium hover:underline"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </NonProtectedRoute>
  );
};

export default SignUp;
