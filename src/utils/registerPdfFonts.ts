import { Font } from '@react-pdf/renderer';

const CDN = 'https://cdn.jsdelivr.net/npm/@fontsource';

function reg(family: string, slug: string, { italic = true, bold = true } = {}) {
  const fonts: { src: string; fontWeight: number; fontStyle?: string }[] = [
    { src: `${CDN}/${slug}/files/${slug}-latin-400-normal.woff2`, fontWeight: 400 },
  ];
  if (bold) {
    fonts.push({ src: `${CDN}/${slug}/files/${slug}-latin-700-normal.woff2`, fontWeight: 700 });
  }
  if (italic) {
    fonts.push({ src: `${CDN}/${slug}/files/${slug}-latin-400-italic.woff2`, fontWeight: 400, fontStyle: 'italic' });
  }
  Font.register({ family, fonts });
}

reg('Plus Jakarta Sans', 'plus-jakarta-sans');
reg('Inter', 'inter');
reg('Nunito', 'nunito');
reg('Lora', 'lora');
reg('Playfair Display', 'playfair-display');
reg('Caveat', 'caveat');
reg('Pacifico', 'pacifico', { italic: false, bold: false });
reg('JetBrains Mono', 'jetbrains-mono');
