import React from 'react';
import { X } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <h2 className="text-base font-bold text-gray-900">Privacy Policy</h2>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1 rounded-full text-gray-500 hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto text-sm text-gray-700 space-y-4">
          <p className="font-semibold text-gray-900">
            Known-You Seed (India) Pvt. Ltd. & DYRECT Authenticity Verification
          </p>
          <p>
            This Privacy Policy describes how your personal and device information is collected, used, and protected when you register products, verify authenticity, or submit inquiries through our verification platform.
          </p>
          <h3 className="font-semibold text-gray-900">1. Information We Collect</h3>
          <p>
            When you register a seed packet product or contact customer support, we collect your name, mobile phone number, email address, and product serial number. With your permission, we may also collect device location solely to log the authenticity verification point.
          </p>
          <h3 className="font-semibold text-gray-900">2. How We Use Information</h3>
          <p>
            We use this information to authenticate your genuine seeds, track seed warranty, provide farming advisory assistance, prevent counterfeiting, and contact you regarding product inquiries.
          </p>
          <h3 className="font-semibold text-gray-900">3. Data Security</h3>
          <p>
            Your verification records are securely managed through DYRECT anti-counterfeit protection systems. We do not sell or rent your personal information to third parties.
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-200 flex justify-end bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-[#0070F3] text-white font-medium text-sm hover:bg-blue-600 active:scale-98 transition-all"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
