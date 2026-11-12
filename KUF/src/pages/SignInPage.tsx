import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileHeader } from '../components/MobileHeader';
import { LoadingModal } from '../components/LoadingModal';
import { PrivacyPolicyModal } from '../components/PrivacyPolicyModal';
import { AuthButton, AuthField, ContinuingTerms, OtpStep, SwitchLine } from '../components/AuthParts';
import { apiService } from '../services/apiService';
import { finishSignIn, isValidPhone } from '../services/authFlow';

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);

  const message = (err: unknown) => (err as Error)?.message || 'Something went wrong. Please try again.';

  const sendCode = async (onSent: () => void, onFail: (text: string) => void) => {
    setLoading(true);
    try {
      await apiService.sendOtp({ phone, purpose: 'signin' });
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
    if (!isValidPhone(phone)) {
      setPhoneError('Please enter a valid 10-digit mobile number');
      return;
    }
    setPhoneError('');
    sendCode(() => setStep('otp'), setPhoneError);
  };

  const handleVerify = async (code: string) => {
    if (code.length !== 6) {
      setOtpError('Please enter the 6 digit verification code');
      return;
    }
    setOtpError('');
    setLoading(true);
    try {
      const res = await apiService.verifyOtp({ phone, otp: code, purpose: 'signin' });
      await finishSignIn(res.customer);
      navigate('/purchases', { replace: true });
    } catch (err) {
      setOtpError(message(err));
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step === 'otp') {
      setStep('phone');
      setPhone('');
      setOtpError('');
      setNotice(null);
    } else {
      navigate('/welcome');
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      <MobileHeader title="Sign In" showBack onBack={goBack} emphasis />

      {step === 'phone' ? (
        <form noValidate onSubmit={handleSubmit} className="pt-[42px]">
          <AuthField
            id="signin-phone"
            label="Phone"
            placeholder="Enter your phone"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            autoComplete="tel"
            value={phone}
            onChange={(v) => setPhone(v.replace(/\D/g, '').slice(0, 10))}
            error={phoneError}
          />

          <div className="mt-[40px] px-[30px]">
            <ContinuingTerms onPolicy={() => setPolicyOpen(true)} />
          </div>

          <div className="mt-[20px] px-[30px]">
            <AuthButton type="submit">Submit</AuthButton>
          </div>

          <div className="mt-[20px]">
            <SwitchLine text="New user?" linkText="Sign up now" dark onClick={() => navigate('/signup', { replace: true })} />
          </div>
        </form>
      ) : (
        <OtpStep
          phone={phone}
          variant="signin"
          error={otpError}
          busy={loading}
          notice={notice}
          onNoticeClose={() => setNotice(null)}
          onVerify={handleVerify}
          onResend={() => sendCode(() => setOtpError(''), setOtpError)}
          onPolicy={() => setPolicyOpen(true)}
          onSwitch={() => navigate('/signup', { replace: true })}
        />
      )}

      <LoadingModal isOpen={loading} large />
      <PrivacyPolicyModal isOpen={policyOpen} onClose={() => setPolicyOpen(false)} />
    </div>
  );
};
