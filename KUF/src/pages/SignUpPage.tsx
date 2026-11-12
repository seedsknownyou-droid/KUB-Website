import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { MobileHeader } from '../components/MobileHeader';
import { LoadingModal } from '../components/LoadingModal';
import { PrivacyPolicyModal } from '../components/PrivacyPolicyModal';
import { AuthButton, AuthField, OtpStep, SwitchLine } from '../components/AuthParts';
import { apiService } from '../services/apiService';
import { finishSignIn, isValidEmail, isValidPhone } from '../services/authFlow';

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  policy?: string;
}

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [otpError, setOtpError] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);

  const message = (err: unknown) => (err as Error)?.message || 'Something went wrong. Please try again.';

  const sendCode = async (onSent: () => void, onFail: (text: string) => void) => {
    setLoading(true);
    try {
      await apiService.sendOtp({ phone, purpose: 'signup', name: name.trim(), email: email.trim() });
      onSent();
      setNotice(`Please enter OTP sent on your mobile number ${phone}`);
    } catch (err) {
      onFail(message(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: FormErrors = {};
    if (!name.trim()) next.name = 'Please enter your name';
    if (email.trim() && !isValidEmail(email.trim())) next.email = 'Please enter a valid email address';
    if (!isValidPhone(phone)) next.phone = 'Please enter a valid 10-digit mobile number';
    if (!agreed) next.policy = 'Please agree to the Privacy Policy to continue';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    sendCode(
      () => setStep('otp'),
      (text) => setErrors({ phone: text })
    );
  };

  const handleVerify = async (code: string) => {
    if (code.length !== 6) {
      setOtpError('Please enter the 6 digit verification code');
      return;
    }
    setOtpError('');
    setLoading(true);
    try {
      const res = await apiService.verifyOtp({ phone, otp: code, purpose: 'signup' });
      await finishSignIn(res.customer);
      navigate('/purchases', { replace: true });
    } catch (err) {
      setOtpError(message(err));
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step === 'otp') {
      setStep('form');
      setName('');
      setEmail('');
      setPhone('');
      setAgreed(true);
      setErrors({});
      setOtpError('');
      setNotice(null);
    } else {
      navigate('/welcome');
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      <MobileHeader title="Create Your New Account" showBack onBack={goBack} emphasis />

      {step === 'form' ? (
        <form noValidate onSubmit={handleSubmit} className="pt-[42px]">
          <div className="space-y-[39px]">
            <AuthField
              id="signup-name"
              label="Name *"
              placeholder="Your full name"
              autoComplete="name"
              value={name}
              onChange={setName}
              error={errors.name}
            />
            <AuthField
              id="signup-email"
              label="Email"
              placeholder="Your email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={setEmail}
              error={errors.email}
            />
            <AuthField
              id="signup-phone"
              label="Phone *"
              placeholder="Your phone"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              autoComplete="tel"
              value={phone}
              onChange={(v) => setPhone(v.replace(/\D/g, '').slice(0, 10))}
              error={errors.phone}
            />
          </div>

          <div className="mt-[51px] pl-[30px] pr-[15px]">
            <div className="flex items-center gap-[6px]">
              <button
                type="button"
                role="checkbox"
                aria-checked={agreed}
                aria-label="I agree to Privacy Policy"
                onClick={() => setAgreed((v) => !v)}
                className={`w-[22px] h-[22px] shrink-0 rounded-full flex items-center justify-center focus:outline-none ${
                  agreed ? 'bg-[#0078FF]' : 'bg-white border border-[#A3A3A3]'
                }`}
              >
                {agreed && <Check size={15} strokeWidth={3} className="text-white" />}
              </button>
              <span className="text-[13px] leading-[18px] text-[#111]">
                I agree to{' '}
                <button
                  type="button"
                  onClick={() => setPolicyOpen(true)}
                  className="text-[#0078FF] bg-transparent p-0 focus:outline-none"
                >
                  Privacy Policy
                </button>
              </span>
            </div>
            {errors.policy && <p className="text-[12px] leading-[16px] text-red-500 mt-[6px]">{errors.policy}</p>}
          </div>

          <div className="mt-[53px] px-[30px]">
            <AuthButton type="submit">Sign Up</AuthButton>
          </div>

          <div className="mt-[40px]">
            <SwitchLine text="Existing user?" linkText="Sign in now" onClick={() => navigate('/signin', { replace: true })} />
          </div>
        </form>
      ) : (
        <OtpStep
          phone={phone}
          variant="signup"
          error={otpError}
          busy={loading}
          notice={notice}
          onNoticeClose={() => setNotice(null)}
          onVerify={handleVerify}
          onResend={() => sendCode(() => setOtpError(''), setOtpError)}
          onPolicy={() => setPolicyOpen(true)}
          onSwitch={() => navigate('/signin', { replace: true })}
        />
      )}

      <LoadingModal isOpen={loading} large />
      <PrivacyPolicyModal isOpen={policyOpen} onClose={() => setPolicyOpen(false)} />
    </div>
  );
};
