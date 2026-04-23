export interface Background {
  id: string;
  name: string;
  url: string;
}

function svg(patternSize: number, shape: string): string {
  const content = `<svg xmlns="http://www.w3.org/2000/svg" width="794" height="1123">
  <defs>
    <pattern id="p" x="0" y="0" width="${patternSize}" height="${patternSize}" patternUnits="userSpaceOnUse">
      ${shape}
    </pattern>
  </defs>
  <rect width="794" height="1123" fill="url(#p)"/>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(content)}`;
}

export const backgrounds: Background[] = [
  {
    id: 'dots-blue',
    name: 'Dots Blue',
    url: svg(40, '<circle cx="20" cy="20" r="5" fill="#bfdbfe"/>'),
  },
  {
    id: 'dots-pink',
    name: 'Dots Pink',
    url: svg(40, '<circle cx="20" cy="20" r="5" fill="#fbcfe8"/>'),
  },
  {
    id: 'dots-yellow',
    name: 'Dots Yellow',
    url: svg(40, '<circle cx="20" cy="20" r="5" fill="#fde68a"/>'),
  },
  {
    id: 'stripes',
    name: 'Stripes',
    url: svg(24, '<line x1="0" y1="24" x2="24" y2="0" stroke="#e0e7ff" stroke-width="4"/>'),
  },
  {
    id: 'stripes-pink',
    name: 'Stripes Pink',
    url: svg(24, '<line x1="0" y1="24" x2="24" y2="0" stroke="#fce7f3" stroke-width="4"/>'),
  },
  {
    id: 'grid',
    name: 'Grid',
    url: svg(40, '<path d="M40 0 L0 0 0 40" fill="none" stroke="#e2e8f0" stroke-width="1.5"/>'),
  },
  {
    id: 'stars',
    name: 'Stars',
    url: svg(60, `<polygon points="30,4 35,22 54,22 39,33 45,51 30,40 15,51 21,33 6,22 25,22" fill="#fde68a" opacity="0.6"/>`),
  },
  {
    id: 'triangles',
    name: 'Confetti',
    url: svg(50, `
      <polygon points="10,5 20,25 0,25" fill="#bfdbfe" opacity="0.7"/>
      <polygon points="35,28 45,48 25,48" fill="#fbcfe8" opacity="0.7"/>
      <rect x="30" y="5" width="12" height="12" rx="2" fill="#bbf7d0" opacity="0.7" transform="rotate(20 36 11)"/>
    `),
  },
  {
    id: 'hearts',
    name: 'Hearts',
    url: svg(50, `<path d="M25,38 C25,38 8,26 8,16 C8,10 13,6 19,8 C22,9 25,12 25,12 C25,12 28,9 31,8 C37,6 42,10 42,16 C42,26 25,38 25,38 Z" fill="#fda4af" opacity="0.5"/>`),
  },
  {
    id: 'zigzag',
    name: 'Zigzag',
    url: svg(40, `<polyline points="0,20 10,5 20,20 30,5 40,20" fill="none" stroke="#c7d2fe" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`),
  },
];
