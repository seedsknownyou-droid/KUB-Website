import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileHeader } from '../components/MobileHeader';
import { storageService } from '../services/storageService';

/** Shrinks the chosen picture to a small square JPEG so it fits in local storage. */
function resizeToSquareJpeg(file: File, size = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the picture'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Could not open the picture'));
      img.onload = () => {
        const side = Math.min(img.width, img.height);
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Could not process the picture'));
        ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

const LABEL = 'text-[11px] leading-[14px] text-[#9A9A9A]';
const INPUT =
  'w-full bg-transparent text-[16px] leading-[22px] text-[#1F1F1F] py-[4px] pr-[14px] border-0 border-b border-[#DADADA] rounded-none focus:outline-none focus:border-[#0A7CFF]';

export const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const saved = storageService.getUser();
  const [name, setName] = useState(saved?.name || '');
  const [email, setEmail] = useState(saved?.email || '');
  const [photo, setPhoto] = useState<string | undefined>(saved?.photo);
  const [errors, setErrors] = useState<{ name?: string; email?: string; photo?: string }>({});

  // Nobody is signed in on this device -> nothing to edit
  useEffect(() => {
    if (!saved) navigate('/profile', { replace: true });
  }, []);

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, photo: 'Please choose an image file' }));
      return;
    }
    try {
      setPhoto(await resizeToSquareJpeg(file));
      setErrors((prev) => ({ ...prev, photo: undefined }));
    } catch {
      setErrors((prev) => ({ ...prev, photo: 'Could not use this picture. Please try another one.' }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const next: { name?: string; email?: string } = {};
    if (!name.trim()) next.name = 'Please enter your name';
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      next.email = 'Please enter a valid email address';
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    storageService.updateUser({ name: name.trim(), email: email.trim(), photo });
    navigate('/profile', { replace: true, state: { toast: 'Profile Updated' } });
  };

  return (
    <div className="min-h-screen bg-white text-[#1F1F1F] flex flex-col font-sans">
      <MobileHeader title="Edit Profile" showBack onBack={() => navigate('/profile')} />

      <form onSubmit={handleSave} noValidate className="w-full mx-auto flex-1 pb-[30px]">
        {/* Avatar with the pencil badge */}
        <div className="flex flex-col items-center pt-[19px] pb-[26px]">
          <div className="relative w-[92px] h-[92px]">
            {photo ? (
              <img src={photo} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <div className="w-full h-full rounded-full bg-[#56608A] overflow-hidden flex items-end justify-center">
                <svg width="92" height="92" viewBox="0 0 92 92" fill="none">
                  <circle cx="46" cy="36" r="14" fill="#E9ECF1" />
                  <path d="M16 92c0-20 13-30 30-30s30 10 30 30z" fill="#E9ECF1" />
                </svg>
              </div>
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              aria-label="Change profile picture"
              className="absolute right-[-4px] bottom-[2px] w-[30px] h-[30px] rounded-full bg-[#EEEEEE] flex items-center justify-center shadow-[0_0_0_2px_#fff] active:opacity-70 focus:outline-none"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A4A4A" strokeWidth="1.800" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 20l1-4L16.500 4.500a2.100 2.100 0 0 1 3 3L8 19l-4 1z" />
                <path d="M14.500 6.500l3 3" />
              </svg>
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
          </div>
          {errors.photo && <span className="text-[11px] text-red-500 mt-2 px-4 text-center">{errors.photo}</span>}
        </div>

        {/* Fields */}
        <div className="pl-[14px] space-y-[8px]">
          <div>
            <label htmlFor="profile-name" className={LABEL}>Name</label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className={INPUT}
            />
            {errors.name && <span className="block text-[11px] text-red-500 mt-1">{errors.name}</span>}
          </div>

          <div>
            <label htmlFor="profile-email" className={LABEL}>Your email</label>
            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className={INPUT}
            />
            {errors.email && <span className="block text-[11px] text-red-500 mt-1">{errors.email}</span>}
          </div>

          {/* The phone number is the account key (purchases are linked to it), so it cannot be edited here */}
          <div>
            <label htmlFor="profile-phone" className={LABEL}>Your phone</label>
            <input
              id="profile-phone"
              type="tel"
              value={saved?.phone || ''}
              readOnly
              className={INPUT}
            />
          </div>
        </div>

        <div className="px-[14px] pt-[30px]">
          <button
            type="submit"
            className="w-full h-[40px] rounded-full bg-[#0A7CFF] text-white text-[16px] font-normal active:opacity-80 transition-opacity focus:outline-none"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};
