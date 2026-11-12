const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const Play = (p) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}>
    <path d="M8 5v14l11-7z" />
  </svg>
);

export const Search = (p) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const ThumbUp = (p) => (
  <svg {...base} {...p}>
    <path d="M7 10v11H3V10h4Zm0 0 4-7a2 2 0 0 1 2 2v4h6a2 2 0 0 1 2 2.3l-1.4 8A2 2 0 0 1 17.6 21H7" />
  </svg>
);

export const ThumbDown = (p) => (
  <svg {...base} {...p}>
    <g transform="rotate(180 12 12)">
      <path d="M7 10v11H3V10h4Zm0 0 4-7a2 2 0 0 1 2 2v4h6a2 2 0 0 1 2 2.3l-1.4 8A2 2 0 0 1 17.6 21H7" />
    </g>
  </svg>
);

export const Theater = (p) => (
  <svg {...base} {...p}>
    <rect x="2" y="6" width="20" height="12" rx="2" />
  </svg>
);

export const Expand = (p) => (
  <svg {...base} {...p}>
    <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" />
  </svg>
);