import type { CSSProperties, ReactNode } from "react";

export type IconName =
  | "dashboard"
  | "trips"
  | "car"
  | "driver"
  | "map"
  | "weather"
  | "send"
  | "check"
  | "pin"
  | "shield"
  | "user"
  | "wallet"
  | "trending"
  | "logout"
  | "clock"
  | "plus"
  | "invoice"
  | "edit"
  | "trash"
  | "alert"
  | "sparkle";

// Stroke-based 24x24 icons that inherit the current text colour, so a single
// set works on light tiles, dark sidebars and coloured buttons alike.
const shapes: Record<IconName, ReactNode> = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
    </>
  ),
  trips: (
    <>
      <circle cx="6" cy="19" r="2.5" />
      <circle cx="18" cy="5" r="2.5" />
      <path d="M8.5 19H15a4 4 0 0 0 0-8H9a4 4 0 0 1 0-8h6.5" />
    </>
  ),
  car: (
    <>
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </>
  ),
  driver: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 2.5v7" />
      <path d="M4.2 16.8l5.6-3.3" />
      <path d="M19.8 16.8l-5.6-3.3" />
    </>
  ),
  map: (
    <>
      <path d="M1.5 6.5 8 3.5l8 3 6.5-3v14l-6.5 3-8-3-6.5 3z" />
      <path d="M8 3.5v14" />
      <path d="M16 6.5v14" />
    </>
  ),
  weather: (
    <>
      <circle cx="8" cy="7.5" r="3" />
      <path d="M8 1.5v1.5M3.4 2.9l1 1M1.5 7.5H3M12.6 2.9l-1 1" />
      <path d="M17.5 19.5H9a4.5 4.5 0 1 1 .9-8.9A5.5 5.5 0 1 1 17.5 19.5z" />
    </>
  ),
  send: (
    <>
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4z" />
    </>
  ),
  check: (
    <>
      <path d="M22 11.1V12a10 10 0 1 1-5.9-9.1" />
      <path d="M22 4 12 14l-3-3" />
    </>
  ),
  pin: (
    <>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  shield: <path d="M12 22s8-4 8-10V5.5L12 2.5 4 5.5V12c0 6 8 10 8 10z" />,
  user: (
    <>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  wallet: (
    <>
      <path d="M19 7V5.5A2.5 2.5 0 0 0 16.5 3H5.5A2.5 2.5 0 0 0 3 5.5v13A2.5 2.5 0 0 0 5.5 21h13a2.5 2.5 0 0 0 2.5-2.5V10a2 2 0 0 0-2-2H5.5" />
      <path d="M16.5 12.5h4v4h-4a2 2 0 0 1 0-4z" />
    </>
  ),
  trending: (
    <>
      <path d="M23 6 13.5 15.5 8.5 10.5 1 18" />
      <path d="M17 6h6v6" />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 6.5V12l3.5 2" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  invoice: (
    <>
      <path d="M14 2.5H6.5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8z" />
      <path d="M14 2.5V8h5.5" />
      <path d="M8.5 13h7M8.5 17h5" />
    </>
  ),
  edit: (
    <>
      <path d="M11 4.5H5.5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V13" />
      <path d="M18.4 3.1a2 2 0 0 1 2.8 2.8L12.5 14.6l-3.7.9.9-3.7z" />
    </>
  ),
  trash: (
    <>
      <path d="M3.5 6h17" />
      <path d="M8.5 6V4.5a1.5 1.5 0 0 1 1.5-1.5h4a1.5 1.5 0 0 1 1.5 1.5V6" />
      <path d="M18.5 6v13a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2V6" />
      <path d="M10 11v6M14 11v6" />
    </>
  ),
  alert: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 7.5V13" />
      <path d="M12 16.5h.01" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 2.5c.6 3.4 1.5 5 6 6-4.5 1-5.4 2.6-6 6-.6-3.4-1.5-5-6-6 4.5-1 5.4-2.6 6-6z" />
      <path d="M19 15.5c.3 1.6.7 2.3 2.5 2.7-1.8.4-2.2 1.1-2.5 2.7-.3-1.6-.7-2.3-2.5-2.7 1.8-.4 2.2-1.1 2.5-2.7z" />
    </>
  ),
};

export default function Icon({
  name,
  size = 20,
  strokeWidth = 1.8,
  style,
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, display: "block", ...style }}
      aria-hidden="true"
      focusable="false"
    >
      {shapes[name]}
    </svg>
  );
}
