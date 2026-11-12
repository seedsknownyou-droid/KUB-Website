import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TAB_BASE =
  'flex-1 mx-[2px] my-[1.5px] rounded-[8px] flex flex-col items-center justify-center text-white transition-colors duration-150 focus:outline-none disabled:cursor-default';
const TAB_ACTIVE = 'bg-[#1458C4]';
const LABEL = 'text-[9.5px] leading-none mt-[4px] font-normal tracking-[0.01em]';

interface BottomNavigationProps {
  /** Shows the bar but makes it inert (used on pages that don't belong to any tab). */
  disabled?: boolean;
}

/** True when the current URL is this tab's own page (ignores a trailing slash). */
const matchesTab = (pathname: string, tabPath: string) => {
  const clean = pathname.replace(/\/+$/, '') || '/';
  return clean === tabPath;
};

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ disabled = false }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;

  // Only a tab's own page highlights it. Product details (/scanned-product-details)
  // is not a tab page, so no tab is highlighted there.
  const isFav = matchesTab(currentPath, '/favorites');
  const isPurchases = matchesTab(currentPath, '/purchases');
  const isProfile = matchesTab(currentPath, '/profile');

  const go = (path: string) => {
    if (!disabled) navigate(path);
  };

  return (
    <nav
      aria-label="Bottom Navigation"
      aria-disabled={disabled}
      className="fixed bottom-0 left-0 right-0 z-30 bg-[#378BFF] select-none"
    >
      <div className="max-w-[576px] mx-auto h-[50px] flex items-stretch px-[0px]">
        {/* My Favorites */}
        <button
          type="button"
          onClick={() => go('/favorites')}
          disabled={disabled}
          className={`${TAB_BASE} ${isFav ? TAB_ACTIVE : ''}`}
        >
          <svg width="22" height="20" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 20.500C12 20.500 2 14.400 2 7.800C2 4.700 4.300 2.500 7 2.500C9 2.500 10.800 3.600 12 5.300C13.200 3.600 15 2.500 17 2.500C19.700 2.500 22 4.700 22 7.800C22 14.400 12 20.500 12 20.500Z"
              stroke="white" strokeWidth="1.700" strokeLinejoin="round"
            />
          </svg>
          <span className={LABEL}>My Favorites</span>
        </button>

        {/* My Purchases */}
        <button
          type="button"
          onClick={() => go('/purchases')}
          disabled={disabled}
          className={`${TAB_BASE} ${isPurchases ? TAB_ACTIVE : ''}`}
        >
          <svg width="22" height="20" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11.500 19.500H6a3 3 0 0 1-3-3V5.500a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3V11"
              stroke="white" strokeWidth="1.700" strokeLinecap="round" strokeLinejoin="round"
            />
            <path d="M7.500 7.500h7M7.500 11h7M7.500 14.500h3.500" stroke="white" strokeWidth="1.600" strokeLinecap="round" />
            <circle cx="18" cy="17" r="4.500" fill="white" />
            <path d="M15.900 17.100l1.500 1.500 2.800-3" stroke={isPurchases ? '#1458C4' : '#378BFF'} strokeWidth="1.600" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className={LABEL}>My Purchases</span>
        </button>

        {/* My Profile */}
        <button
          type="button"
          onClick={() => go('/profile')}
          disabled={disabled}
          className={`${TAB_BASE} ${isProfile ? TAB_ACTIVE : ''}`}
        >
          <svg width="22" height="20" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="6.500" r="4.200" stroke="white" strokeWidth="1.700" />
            <path d="M3.500 20c0-4.200 3.600-6.700 8.500-6.700s8.500 2.500 8.500 6.700v.5h-17z" stroke="white" strokeWidth="1.700" strokeLinejoin="round" />
          </svg>
          <span className={LABEL}>My Profile</span>
        </button>
      </div>
    </nav>
  );
};
