"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";

import Input, { InputVariant } from "../components/Input";
import Button, { ButtonVariant } from "../components/Button";
import { useMutation } from "@tanstack/react-query";
import { ResetPasswordAPI } from "../api/auth.api";

interface ResetPasswordForm {
  newPassword: string;
  confirmPassword: string;
}

interface PasswordChecks {
  has8Character: boolean;
  hasLowercase: boolean;
  hasUppercase: boolean;
  hasDigit: boolean;
  hasSpecialCharacter: boolean;
  matchedWithConfirmPassword: boolean;
}

const ResetPassword = () => {
  const [resetPasswordForm, setResetPasswordForm] = useState<ResetPasswordForm>(
    { newPassword: "", confirmPassword: "" },
  );
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordChecks, setPasswordChecks] = useState<PasswordChecks>({
    has8Character: false,
    hasDigit: false,
    hasLowercase: false,
    hasSpecialCharacter: false,
    hasUppercase: false,
    matchedWithConfirmPassword: false,
  });

  // Hooks
  const searchParams = useSearchParams()
  const router = useRouter()

  const handleValidation = () => {
    setPasswordChecks({
      ...passwordChecks,
      matchedWithConfirmPassword:
        resetPasswordForm.newPassword == resetPasswordForm.confirmPassword &&
        resetPasswordForm.newPassword != ""
          ? true
          : false,
      has8Character: resetPasswordForm.newPassword.length >= 8?true:false,
      hasUppercase: /[A-Z]/.test(resetPasswordForm.newPassword),
      hasLowercase: /[a-z]/.test(resetPasswordForm.newPassword),
      hasDigit: /[0-9]/.test(resetPasswordForm.newPassword),
      hasSpecialCharacter: /[!@#$%^&*(),.?":{}|<>]/.test(resetPasswordForm.newPassword)
    });
  };

  const handleResetPassword = () => {
    if(!searchParams.get('token')){
      // Later toast will be implemented.

      throw new Error('No token query is provided.')
    }

    if(Object.values(passwordChecks).every(value => value !== true)) return;

    resetPasswordMutation.mutate({
      ...resetPasswordForm,
      token: searchParams.get('token') as string
    })
  }

  useEffect(() => {
    handleValidation();
    return () => {};
  }, [resetPasswordForm]);


  // Mutations
  const resetPasswordMutation = useMutation({
    mutationFn: ResetPasswordAPI,
    onSuccess: (data) =>{
      if(data.ok){
        router.push('/login')
        return 
      }
      console.log(data)
    },
    onError: (error) => {}
  })

  return (
    <>
      <main className="w-screen h-screen flex items-center justify-center select-none">
        <div className="px-3 py-2 bg-secondary-bg border border-primary-border w-[25vw] flex flex-col gap-4 items-start justify-center h-fit rounded-xl">
          <span className="font-semibold text-xl">Reset Password</span>

          <div className="flex flex-col w-full items-center justify-center gap-3">
            <Input
              variant={InputVariant.PRIMARY}
              value={resetPasswordForm.newPassword}
              onChange={(e) => {
                setResetPasswordForm({
                  ...resetPasswordForm,
                  newPassword: e.target.value,
                });
              }}
              placeholder="New Password"
              type={showPassword?'text':'password'}
            />
            <Input
              variant={InputVariant.PRIMARY}
              value={resetPasswordForm.confirmPassword}
              onChange={(e) => {
                setResetPasswordForm({
                  ...resetPasswordForm,
                  confirmPassword: e.target.value,
                });
              }}
              placeholder="Confirm Password"
              type={showPassword?'text':'password'}
            />

            <button className="text-sm ml-auto text-primary-blue hover:text-primary-blue-hover font-medium cursor-pointer transition-all duration-300 outline-none" onClick={()=>setShowPassword(!showPassword)}>
              {showPassword?'Hide Password':"Show Password"}
            </button>
          </div>

          <Button text="Reset Password" variant={ButtonVariant.PRIMARY} onClick={handleResetPassword} onLoadingText="Reseting..." isLoading={resetPasswordMutation.isPending}/>

          <div className="w-full flex flex-col gap-1">
            <div className="flex w-full gap-2 items-center">
              <Image
                src={
                  passwordChecks.has8Character
                    ? "/circle-check-green-icon.png"
                    : "/circle-check-icon.png"
                }
                width={15}
                height={15}
                alt="check box"
              />
              <span className="text-sm font-medium">Minimum 8 characters</span>
            </div>
            <div className="flex w-full gap-2 items-center">
              <Image
                src={
                  passwordChecks.hasUppercase
                    ? "/circle-check-green-icon.png"
                    : "/circle-check-icon.png"
                }
                width={15}
                height={15}
                alt="check box"
              />
              <span className="text-sm font-medium">Has uppercase letter</span>
            </div>
            <div className="flex w-full gap-2 items-center">
              <Image
                src={
                  passwordChecks.hasLowercase
                    ? "/circle-check-green-icon.png"
                    : "/circle-check-icon.png"
                }
                width={15}
                height={15}
                alt="check box"
              />
              <span className="text-sm font-medium">Has lowercase letter</span>
            </div>
            <div className="flex w-full gap-2 items-center">
              <Image
                src={
                  passwordChecks.hasDigit
                    ? "/circle-check-green-icon.png"
                    : "/circle-check-icon.png"
                }
                width={15}
                height={15}
                alt="check box"
              />
              <span className="text-sm font-medium">Has digit</span>
            </div>
            <div className="flex w-full gap-2 items-center">
              <Image
                src={
                  passwordChecks.hasSpecialCharacter
                    ? "/circle-check-green-icon.png"
                    : "/circle-check-icon.png"
                }
                width={15}
                height={15}
                alt="check box"
              />
              <span className="text-sm font-medium">Has special character</span>
            </div>
            <div className="flex w-full gap-2 items-center">
              <Image
                src={
                  passwordChecks.matchedWithConfirmPassword
                    ? "/circle-check-green-icon.png"
                    : "/circle-check-icon.png"
                }
                width={15}
                height={15}
                alt="check box"
              />
              <span className="text-sm font-medium">
                Matched with Confirm Password
              </span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ResetPassword;
