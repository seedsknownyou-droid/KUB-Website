import React, { useEffect, useState } from 'react';

interface SuccessToastProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  actionText?: string;
  bottomOffset?: string;
  /** How long the message stays on screen before it fades away (ms). */
  duration?: number;
}

const EXIT_MS = 300;

export const SuccessToast: React.FC<SuccessToastProps> = ({
  message,
  isOpen,
  onClose,
  actionText = 'Ok',
  bottomOffset = 'bottom-0',
  duration = 4000
}) => {
  const [shown, setShown] = useState(false); // drives the slide / fade animation

  useEffect(() => {
    if (!isOpen) {
      setShown(false);
      return;
    }

    // slide in on the next frame
    const enter = requestAnimationFrame(() => setShown(true));
    // fade out after `duration`, then tell the parent to remove the message
    const hide = setTimeout(() => setShown(false), duration);
    const done = setTimeout(onClose, duration + EXIT_MS);

    return () => {
      cancelAnimationFrame(enter);
      clearTimeout(hide);
      clearTimeout(done);
    };
  }, [isOpen, message, duration]);

  if (!isOpen) return null;

  const handleOk = () => {
    setShown(false);
    setTimeout(onClose, EXIT_MS);
  };

  return (
    <div
      className={`fixed ${bottomOffset} left-0 right-0 z-40 flex justify-center pointer-events-none`}
      role="status"
      aria-live="polite"
    >
      <div
        className={`w-full max-w-[576px] bg-[#4ACC6A] text-white min-h-[48px] py-[10px] pl-[15px] pr-[22px] flex items-center justify-between gap-[16px] pointer-events-auto transition-all ease-out ${
          shown ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
        style={{ transitionDuration: `${EXIT_MS}ms` }}
      >
        <p className="text-[13.5px] font-normal leading-[18px] select-none">{message}</p>
        <button
          type="button"
          onClick={handleOk}
          className="shrink-0 text-white text-[16px] font-normal active:opacity-70 transition-opacity focus:outline-none"
        >
          {actionText}
        </button>
      </div>
    </div>
  );
};
