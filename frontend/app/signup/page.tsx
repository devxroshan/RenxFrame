'use client';
import Link from "next/link";


import Input, { InputVariant } from "../components/Input";
import Button, { ButtonVariant } from "../components/Button";

const SignUp = () => {
  return (
    <main className="w-screen h-screen flex items-center justify-center select-none">
      <div className="bg-secondary-bg flex px-3 py-3 gap-4 w-[60vw] h-[70vh] rounded-xl border border-primary-border">
        <div className="w-full h-full bg-white rounded-lg"></div>

        <div className="w-[60%] h-full flex flex-col items-start justify-start gap-4">
          <span className="text-xl font-semibold">Sign Up</span>

          <div className="flex flex-col gap-2 items-center justify-center w-full">
            <Input variant={InputVariant.PRIMARY} placeholder="Name" />
            <Input variant={InputVariant.PRIMARY} placeholder="Email" />
            <Input
              variant={InputVariant.PRIMARY}
              placeholder="Password"
              type="password"
            />
          </div>

          <Button variant={ButtonVariant.PRIMARY} text="Sign Up" />

          <div className="flex w-full items-center justify-center my-6">
            <div className="w-full h-px bg-primary-border"></div>
            <span className="mx-2 text-primary-text">OR</span>
            <div className="w-full h-px bg-primary-border"></div>
          </div>

          <div className="flex flex-col gap-4 w-full items-center justify-center">
            <Button variant={ButtonVariant.SECONDARY_OUTLINE} text="Sign Up with Google" />

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
