'use client';
import Link from "next/link";
import { useState } from "react";

import Input, { InputVariant } from "../components/Input";
import Button, { ButtonVariant } from "../components/Button";
import { useMutation } from "@tanstack/react-query";

// API
import { SignUpAPI } from "../api/auth.api";

interface SignUpForm {
  name: string,
  email: string,
  password: string
}

const SignUp = () => {
  // States
  const [signUpForm, setSignUpForm] = useState<SignUpForm>({name: "", email: "", password: ""})

  // Mutations
  const signUpMutation = useMutation({
    mutationFn: SignUpAPI,
    onSuccess: (data) => {
    },
    onError: (error) => {
    }
  })

  const handleSignUp = () => {
    if(!signUpForm.name || !signUpForm.email || !signUpForm.password) return;

    signUpMutation.mutate(signUpForm)
  }

  return (
    <main className="w-screen h-screen flex items-center justify-center select-none">
      <div className="bg-secondary-bg flex px-3 py-3 gap-4 w-[60vw] h-[70vh] rounded-xl border border-primary-border">
        <div className="w-full h-full bg-white rounded-lg"></div>

        <div className="w-[60%] h-full flex flex-col items-start justify-start gap-4" onKeyDown={(e) => {
          if(e.key == 'Enter')
            handleSignUp()
        }}>
          <span className="text-xl font-semibold">Sign Up</span>

          <div className="flex flex-col gap-2 items-center justify-center w-full">
            <Input variant={InputVariant.PRIMARY} placeholder="Name" onChange={(e) => {
              setSignUpForm({...signUpForm, name: e.target.value})
            }} />
            <Input variant={InputVariant.PRIMARY} placeholder="Email" onChange={(e) => setSignUpForm({...signUpForm, email: e.target.value})} />
            <Input
              variant={InputVariant.PRIMARY}
              placeholder="Password"
              type="password"
              onChange={(e) => setSignUpForm({...signUpForm, password: e.target.value})}
            />
          </div>

          <Button variant={ButtonVariant.PRIMARY} text="Sign Up" onLoadingText="Signing Up...." onClick={handleSignUp} isLoading={signUpMutation.isPending} />

          <div className="flex w-full items-center justify-center my-6">
            <div className="w-full h-px bg-primary-border"></div>
            <span className="mx-2 text-primary-text">OR</span>
            <div className="w-full h-px bg-primary-border"></div>
          </div>

          <div className="flex flex-col gap-4 w-full items-center justify-center">
            <Button variant={ButtonVariant.SECONDARY_OUTLINE} text="Sign Up with Google" onClick={() => {
              if(window)
                window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`
            }}/>

            <div>
                <span className="text-sm font-semibold">Already have an account? </span>
                <Link href="/login" className="text-sm text-primary-blue font-medium hover:underline">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignUp;
