import React, { useState } from 'react';
import { SuccessToast } from './SuccessToast';

const BLUE = '#0078FF';

/* ------------------------------------------------------------------ */
/* Small building blocks shared by Sign In, Sign Up and the OTP step   */
/* ------------------------------------------------------------------ */

interface AuthFieldProps {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  maxLength?: number;
  autoComplete?: string;
  error?: string;
}

/** Small grey label, one underlined line - like the Material "standard" text field. */
export const AuthField: React.FC<AuthFieldProps> = ({
  id,
  label,
  value,
  placeholder,
  onChange,
  type = 'text',
  inputMode,
  maxLength,
  autoComplete,
  error
}) => (
  <div className="pl-[30px] pr-[15px]">
    <label htmlFor={id} className="block text-[11px] leading-[14px] text-[#A3A3A3] mb-[8px]">
      {label}
    </label>
    <input
      id={id}
      type={type}
      inputMode={inputMode}
      maxLength={maxLength}
      autoComplete={autoComplete}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-[30px] bg-transparent p-0 text-[16px] text-[#1F1F1F] placeholder:text-[#B8B8B8] border-0 border-b border-[#DCDFE6] rounded-none focus:outline-none focus:border-[#0078FF]"
    />
    {error && <p className="text-[12px] leading-[16px] text-red-500 mt-[4px]">{error}</p>}
  </div>
);

interface AuthButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'solid' | 'outline';
  disabled?: boolean;
}

/** Full-width pill button (solid blue or blue outline). */
export const AuthButton: React.FC<AuthButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'solid',
  disabled = false
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={
      'w-full h-[42px] rounded-full text-[16px] font-semibold leading-none transition-opacity active:opacity-80 focus:outline-none disabled:opacity-60 ' +
      (variant === 'solid'
        ? 'bg-[#0078FF] text-white'
        : 'bg-white text-[#0078FF] border-[1.5px] border-[#0078FF]')
    }
  >
    {children}
  </button>
);

/** "By continuing, you agree to  Privacy Policy" */
export const ContinuingTerms: React.FC<{ onPolicy: () => void }> = ({ onPolicy }) => (
  <p className="flex items-baseline gap-[8px] leading-[20px]">
    <span className="text-[13px] text-[#6D6C71]">By continuing, you agree to</span>
    <button
      type="button"
      onClick={onPolicy}
      className="text-[15px] text-[#0078FF] bg-transparent p-0 focus:outline-none"
    >
      Privacy Policy
    </button>
  </p>
);

/** "New user?  Sign up now" / "Existing user?  Sign in now" */
export const SwitchLine: React.FC<{ text: string; linkText: string; onClick: () => void; dark?: boolean }> = ({
  text,
  linkText,
  onClick,
  dark = false
}) => (
  <p className={`text-center text-[15px] leading-[20px] ${dark ? 'text-[#111]' : 'text-[#6D6C71]'}`}>
    {text}{' '}
    <button
      type="button"
      onClick={onClick}
      className="text-[#0B6BD6] underline bg-transparent p-0 focus:outline-none"
    >
      {linkText}
    </button>
  </p>
);

/* ------------------------------------------------------------------ */
/* Step 2 of both flows: "Please enter 6 digits verification code"    */
/* ------------------------------------------------------------------ */

interface OtpStepProps {
  phone: string;
  /** Sign In shows the "By continuing" line, Sign Up shows "Existing user?" at the bottom */
  variant: 'signin' | 'signup';
  error: string;
  busy: boolean;
  /** Green bar at the bottom ("Please enter OTP sent on your mobile number ...") */
  notice: string | null;
  onNoticeClose: () => void;
  onVerify: (code: string) => void;
  onResend: () => void;
  onPolicy: () => void;
  onSwitch: () => void;
}

export const OtpStep: React.FC<OtpStepProps> = ({
  phone,
  variant,
  error,
  busy,
  notice,
  onNoticeClose,
  onVerify,
  onResend,
  onPolicy,
  onSwitch
}) => {
  const [code, setCode] = useState('');

  return (
    <>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          onVerify(code);
        }}
        className="pt-[34px]"
      >
        <h2 className="px-[30px] text-[17px] leading-[24px] font-bold text-black">
          Please enter 6 digits verification code sent to {phone}
        </h2>

        <div className="mt-[39px] pl-[30px] pr-[13px]">
          <label htmlFor="otp-code" className="block text-[11px] leading-[14px] text-[#A3A3A3] mb-[3px]">
            Verification Code
          </label>
          <input
            id="otp-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            placeholder="Code"
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="w-full h-[57px] bg-white text-center text-[20px] font-bold tracking-[0.4em] text-black placeholder:text-[#A8A8A8] placeholder:text-[17px] placeholder:tracking-[0.3em] border border-[#A8A8A8] rounded-[2px] focus:outline-none focus:border-[#0078FF]"
          />
          {error && <p className="text-[12px] leading-[16px] text-red-500 mt-[6px]">{error}</p>}
        </div>

        {variant === 'signin' && (
          <div className="mt-[40px] px-[30px]">
            <ContinuingTerms onPolicy={onPolicy} />
          </div>
        )}

        <div className={`px-[30px] ${variant === 'signin' ? 'mt-[24px]' : 'mt-[44px]'}`}>
          <AuthButton type="submit" disabled={busy}>
            Verify
          </AuthButton>
        </div>

        <div className="mt-[20px] flex justify-center">
          <button
            type="button"
            onClick={onResend}
            disabled={busy}
            className="text-[16px] leading-[24px] font-semibold bg-transparent p-0 focus:outline-none active:opacity-70 disabled:opacity-60"
            style={{ color: BLUE }}
          >
            Resend
          </button>
        </div>

        {variant === 'signup' && (
          <div className="mt-[56px]">
            <SwitchLine text="Existing user?" linkText="Sign in now" onClick={onSwitch} />
          </div>
        )}
      </form>

      <SuccessToast message={notice || ''} isOpen={!!notice} onClose={onNoticeClose} />
    </>
  );
};
