export interface StickerDef {
  id: string;
  name: string;
  url: string;
}

function s(content: string, viewBox = '0 0 100 100') {
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${content}</svg>`)}`;
}

export const stickers: StickerDef[] = [
  {
    id: 'star',
    name: 'Star',
    url: s('<polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="#FCD34D" stroke="#F59E0B" stroke-width="2"/>'),
  },
  {
    id: 'heart',
    name: 'Heart',
    url: s('<path d="M50,85 C50,85 10,55 10,30 C10,16 22,8 35,14 C42,17 50,26 50,26 C50,26 58,17 65,14 C78,8 90,16 90,30 C90,55 50,85 50,85 Z" fill="#F9A8D4" stroke="#EC4899" stroke-width="2"/>'),
  },
  {
    id: 'flower',
    name: 'Flower',
    url: s('<circle cx="50" cy="50" r="12" fill="#FCD34D"/><ellipse cx="50" cy="20" rx="10" ry="16" fill="#F9A8D4"/><ellipse cx="50" cy="80" rx="10" ry="16" fill="#F9A8D4"/><ellipse cx="20" cy="50" rx="16" ry="10" fill="#F9A8D4"/><ellipse cx="80" cy="50" rx="16" ry="10" fill="#F9A8D4"/><ellipse cx="29" cy="29" rx="10" ry="16" fill="#FDA4AF" transform="rotate(45 29 29)"/><ellipse cx="71" cy="29" rx="10" ry="16" fill="#FDA4AF" transform="rotate(-45 71 29)"/><ellipse cx="29" cy="71" rx="10" ry="16" fill="#FDA4AF" transform="rotate(-45 29 71)"/><ellipse cx="71" cy="71" rx="10" ry="16" fill="#FDA4AF" transform="rotate(45 71 71)"/>'),
  },
  {
    id: 'sun',
    name: 'Sun',
    url: s('<circle cx="50" cy="50" r="22" fill="#FCD34D" stroke="#F59E0B" stroke-width="2"/><line x1="50" y1="5" x2="50" y2="18" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/><line x1="50" y1="82" x2="50" y2="95" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/><line x1="5" y1="50" x2="18" y2="50" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/><line x1="82" y1="50" x2="95" y2="50" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/><line x1="16" y1="16" x2="25" y2="25" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/><line x1="75" y1="75" x2="84" y2="84" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/><line x1="84" y1="16" x2="75" y2="25" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/><line x1="25" y1="75" x2="16" y2="84" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/>'),
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    url: s('<path d="M10,70 A40,40 0 0,1 90,70" fill="none" stroke="#EF4444" stroke-width="8" stroke-linecap="round"/><path d="M17,70 A33,33 0 0,1 83,70" fill="none" stroke="#F97316" stroke-width="7" stroke-linecap="round"/><path d="M24,70 A26,26 0 0,1 76,70" fill="none" stroke="#FCD34D" stroke-width="6" stroke-linecap="round"/><path d="M31,70 A19,19 0 0,1 69,70" fill="none" stroke="#4ADE80" stroke-width="6" stroke-linecap="round"/><path d="M38,70 A12,12 0 0,1 62,70" fill="none" stroke="#60A5FA" stroke-width="6" stroke-linecap="round"/>'),
  },
  {
    id: 'balloon',
    name: 'Balloon',
    url: s('<ellipse cx="50" cy="38" rx="28" ry="34" fill="#F87171" stroke="#EF4444" stroke-width="2"/><path d="M50,72 Q46,82 50,90 Q54,82 50,72" fill="#EF4444"/><line x1="50" y1="90" x2="50" y2="98" stroke="#6B7280" stroke-width="2"/><path d="M36,28 Q38,22 44,24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" opacity="0.6"/>'),
  },
  {
    id: 'crown',
    name: 'Crown',
    url: s('<path d="M10,70 L10,30 L30,50 L50,10 L70,50 L90,30 L90,70 Z" fill="#FCD34D" stroke="#F59E0B" stroke-width="2"/><circle cx="50" cy="20" r="6" fill="#F87171"/><circle cx="20" cy="44" r="5" fill="#60A5FA"/><circle cx="80" cy="44" r="5" fill="#4ADE80"/><rect x="10" y="65" width="80" height="12" rx="3" fill="#F59E0B"/>'),
  },
  {
    id: 'butterfly',
    name: 'Butterfly',
    url: s('<path d="M50,50 Q20,10 5,25 Q0,45 30,50 Q0,55 5,75 Q20,90 50,50" fill="#C084FC" stroke="#A855F7" stroke-width="1.5"/><path d="M50,50 Q80,10 95,25 Q100,45 70,50 Q100,55 95,75 Q80,90 50,50" fill="#E879F9" stroke="#A855F7" stroke-width="1.5"/><ellipse cx="50" cy="50" rx="4" ry="14" fill="#1F2937"/>'),
  },
  {
    id: 'lightning',
    name: 'Lightning',
    url: s('<polygon points="60,5 35,52 52,52 40,95 75,40 55,40 70,5" fill="#FCD34D" stroke="#F59E0B" stroke-width="2" stroke-linejoin="round"/>'),
  },
  {
    id: 'cloud',
    name: 'Cloud',
    url: s('<circle cx="30" cy="55" r="18" fill="white" stroke="#CBD5E1" stroke-width="2"/><circle cx="50" cy="42" r="22" fill="white" stroke="#CBD5E1" stroke-width="2"/><circle cx="70" cy="52" r="16" fill="white" stroke="#CBD5E1" stroke-width="2"/><rect x="14" y="55" width="72" height="22" rx="2" fill="white" stroke="#CBD5E1" stroke-width="0"/>'),
  },
  {
    id: 'diamond',
    name: 'Diamond',
    url: s('<polygon points="50,5 90,40 50,95 10,40" fill="#93C5FD" stroke="#3B82F6" stroke-width="2"/><polygon points="50,5 90,40 50,40" fill="#BFDBFE"/><line x1="30" y1="40" x2="50" y2="40" stroke="white" stroke-width="1.5"/><line x1="50" y1="40" x2="70" y2="40" stroke="#93C5FD" stroke-width="1.5"/>'),
  },
  {
    id: 'music',
    name: 'Music',
    url: s('<ellipse cx="32" cy="72" rx="14" ry="10" fill="#F9A8D4" stroke="#EC4899" stroke-width="2"/><ellipse cx="68" cy="65" rx="14" ry="10" fill="#F9A8D4" stroke="#EC4899" stroke-width="2"/><line x1="46" y1="72" x2="46" y2="20" stroke="#EC4899" stroke-width="3"/><line x1="82" y1="65" x2="82" y2="13" stroke="#EC4899" stroke-width="3"/><path d="M46,20 L82,13" fill="none" stroke="#EC4899" stroke-width="3"/>'),
  },
];
