import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';
import { MobileHeader } from '../components/MobileHeader';
import { LoadingModal } from '../components/LoadingModal';
import { PrivacyPolicyModal } from '../components/PrivacyPolicyModal';
import { storageService } from '../services/storageService';
import { apiService, ApiError } from '../services/apiService';

export const ContactSupportPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // When opened from the red "already registered to another user" page, the incident is about
  // that scanned product (not about a product this device owns).
  const ctx = (location.state || null) as {
    serialNumber?: string;
    productName?: string;
    returnTo?: string;
    counterfeit?: boolean;
  } | null;
  const backTo = ctx?.returnTo || '/scanned-product-details';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [agreePolicy, setAgreePolicy] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; message?: string }>({});

  useEffect(() => {
    const user = storageService.getUser();
    if (user) {
      if (user.name) setName(user.name);
      if (user.phone) setPhone(user.phone);
      if (user.email) setEmail(user.email);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { name?: string; phone?: string; message?: string } = {};
    if (!name.trim()) newErrors.name = 'Please enter your name';
    if (!phone.trim()) newErrors.phone = 'Please enter your phone number';
    if (!message.trim()) newErrors.message = 'Please enter your message';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const serialNumber = ctx?.serialNumber || storageService.getCurrentProduct()?.serialNumber;
    if (!serialNumber) {
      setSubmitError('Please register your product first.');
      return;
    }

    setSubmitError('');
    setIsLoading(true);

    apiService
      .reportIncident({
        serialNumber,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: ctx?.counterfeit
          ? `[Product already registered to another user - possible counterfeit] ${message.trim()}`
          : message.trim()
      })
      .then((res) => {
        storageService.addSupportTicket({
          name,
          phone,
          email,
          message,
          type: 'incident'
        });
        setIsLoading(false);
        navigate(backTo, {
          state: { toast: 'Thank you for your valuable inputs. We shall get back to you shortly.' }
        });
      })
      .catch((err: ApiError) => {
        setIsLoading(false);
        setSubmitError(err.message || 'Could not send. Please try again.');
      });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-16 flex flex-col font-sans">
      <MobileHeader 
        title="Contact Support" 
        showBack={true} 
        onBack={() => navigate(backTo)}
      />

      <main className="max-w-[576px] w-full mx-auto px-[14px] pt-[20px] pb-8 flex-1">
        <form onSubmit={handleSubmit} className="flex flex-col gap-[35px]">
          {/* Name Field */}
          <div className="flex flex-col">
            <label htmlFor="contact-name" className="text-[11px] leading-[14px] font-normal text-[#9B9B9B] mb-[3px] select-none">
              Name *
            </label>
            <input
              id="contact-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full h-[34px] p-0 text-[16px] text-[#111] bg-transparent border-0 border-b border-[#D6D6D6] rounded-none focus:border-[#0A7CFF] focus:outline-none placeholder:text-[#B8B8B8] transition-colors"
            />
            {errors.name && (
              <span className="text-red-500 text-xs mt-1">{errors.name}</span>
            )}
          </div>

          {/* Phone Field */}
          <div className="flex flex-col">
            <label htmlFor="contact-phone" className="text-[11px] leading-[14px] font-normal text-[#9B9B9B] mb-[3px] select-none">
              Phone *
            </label>
            <input
              id="contact-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full h-[34px] p-0 text-[16px] text-[#111] bg-transparent border-0 border-b border-[#D6D6D6] rounded-none focus:border-[#0A7CFF] focus:outline-none placeholder:text-[#B8B8B8] transition-colors"
            />
            {errors.phone && (
              <span className="text-red-500 text-xs mt-1">{errors.phone}</span>
            )}
          </div>

          {/* Email Field */}
          <div className="flex flex-col">
            <label htmlFor="contact-email" className="text-[11px] leading-[14px] font-normal text-[#9B9B9B] mb-[3px] select-none">
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full h-[34px] p-0 text-[16px] text-[#111] bg-transparent border-0 border-b border-[#D6D6D6] rounded-none focus:border-[#0A7CFF] focus:outline-none placeholder:text-[#B8B8B8] transition-colors"
            />
          </div>

          {/* Message Field */}
          <div className="flex flex-col">
            <label htmlFor="contact-message" className="text-[11px] leading-[14px] font-normal text-[#9B9B9B] mb-[3px] select-none">
              Message *
            </label>
            <textarea
              id="contact-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-[87px] p-0 pt-[7px] text-[16px] leading-[22px] text-[#111] bg-transparent border-0 border-b border-[#D6D6D6] rounded-none resize-none focus:border-[#0A7CFF] focus:outline-none placeholder:text-[#B8B8B8] transition-colors"
            />
            {errors.message && (
              <span className="text-red-500 text-xs mt-1">{errors.message}</span>
            )}
          </div>

          {/* Privacy Policy Checkbox */}
          <div className="-mt-[5px]">
            <div className="flex items-center gap-[5px]">
              <button
                type="button"
                role="checkbox"
                aria-checked={agreePolicy}
                onClick={() => setAgreePolicy(!agreePolicy)}
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all shrink-0 ${
                  agreePolicy 
                    ? 'bg-[#0A7CFF] text-white' 
                    : 'border-2 border-gray-400 bg-white'
                }`}
              >
                {agreePolicy && <Check size={13} strokeWidth={3} />}
              </button>
              <div className="text-[11.5px] text-[#666] select-none">
                <span>I agree to </span>
                <button
                  type="button"
                  onClick={() => setShowPrivacyPolicy(true)}
                  className="text-[#0A66C2] hover:underline font-normal focus:outline-none"
                >
                  Privacy Policy
                </button>
              </div>
            </div>
          </div>

          {submitError && (
            <span className="text-red-500 text-sm block" role="alert">{submitError}</span>
          )}

          {/* Contact Support Button */}
          <div className="pt-[11px] mx-[13px]">
            <button
              type="submit"
              className="w-full h-[38px] rounded-full bg-[#0A7CFF] active:bg-[#0069DB] text-white font-normal text-[16px] transition-colors text-center select-none"
            >
              Contact Support
            </button>
          </div>
        </form>
      </main>

      {/* Loading Modal with Dyrect Logo */}
      <LoadingModal isOpen={isLoading} text="Loading..." />

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal 
        isOpen={showPrivacyPolicy} 
        onClose={() => setShowPrivacyPolicy(false)} 
      />
    </div>
  );
};