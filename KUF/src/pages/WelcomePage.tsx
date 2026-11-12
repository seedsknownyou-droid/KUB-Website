import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthButton } from '../components/AuthParts';
import logoImage from '../assets/images/known-you-seed-logo.jpg';

/** Opened from "Access Your Account" in the welcome email. */
export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col items-center">
      <div className="mt-[116px] w-[152px] h-[152px] rounded-full border border-[#E3E4EA] bg-white flex items-center justify-center overflow-hidden">
        <img
          src={logoImage}
          alt="Known-You Seed (India) Pvt. Ltd."
          draggable={false}
          className="w-[100px] h-auto select-none"
        />
      </div>

      <p className="mt-[15px] text-[14px] leading-[20px] font-bold text-[#6D6C71] text-center">
        Please Sign in or Sign up to proceed
      </p>

      <div className="w-full mt-[16px] px-[30px] space-y-[16px]">
        <AuthButton variant="outline" onClick={() => navigate('/signin')}>
          Sign In
        </AuthButton>
        <AuthButton onClick={() => navigate('/signup')}>Sign Up</AuthButton>
      </div>
    </div>
  );
};
