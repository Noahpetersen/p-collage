import { Document, Page, Image, Text } from '@react-pdf/renderer';
import type { CanvasDecoration, CanvasText } from '../../types';
import type { PdfPhoto } from '../../hooks/useExport';
import { A4 } from '../../constants';

// Map canvas font families → built-in PDF fonts (no network loading needed)
const PDF_FONT: Record<string, string> = {
  'Lora': 'Times-Roman',
  'Playfair Display': 'Times-Roman',
  'JetBrains Mono': 'Courier',
};
function pdfFont(family: string): string {
  return PDF_FONT[family] ?? 'Helvetica';
}

interface PdfDocumentProps {
  bgColor: string;
  bgImageUrl: string | null;
  photoSlots: PdfPhoto[];
  freePhotos: PdfPhoto[];
  decorations: CanvasDecoration[];
  texts: CanvasText[];
}

const S = 0.75; // 96dpi canvas px → 72pt PDF

function photoStyle(p: PdfPhoto) {
  return {
    position: 'absolute' as const,
    left: p.x * S,
    top: p.y * S,
    width: p.width * S,
    height: p.height * S,
    borderRadius: p.cornerRadius * S,
    // Match Konva's rotation: clockwise around the node's top-left corner
    ...(p.rotation !== 0 && {
      transform: `rotate(${p.rotation}deg)`,
      transformOrigin: '0 0',
    }),
  };
}

export default function PdfDocument({ bgColor, bgImageUrl, photoSlots, freePhotos, decorations, texts }: PdfDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={{ position: 'relative', backgroundColor: bgColor }}>
        {bgImageUrl && (
          <Image
            src={bgImageUrl}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
        )}
        {photoSlots.map(p => (
          <Image key={p.id} src={p.src} style={photoStyle(p)} />
        ))}
        {freePhotos.map(p => (
          <Image key={p.id} src={p.src} style={photoStyle(p)} />
        ))}
        {decorations.map(d => (
          <Image
            key={d.id}
            src={d.url}
            style={{
              position: 'absolute',
              left: d.x * S,
              top: d.y * S,
              width: d.size * S,
              height: d.size * S,
              ...(d.rotation !== 0 && {
                transform: `rotate(${d.rotation}deg)`,
                transformOrigin: '0 0',
              }),
            }}
          />
        ))}
        {texts.map(t => (
          <Text
            key={t.id}
            style={{
              position: 'absolute',
              left: t.x * S,
              top: t.y * S,
              width: (t.width ?? A4.width) * S,
              fontFamily: pdfFont(t.fontFamily),
              fontSize: t.fontSize * S,
              fontWeight: t.bold ? 700 : 400,
              ...(t.italic && { fontStyle: 'italic' }),
              ...(t.underline && { textDecoration: 'underline' }),
              textAlign: t.align,
              color: t.color,
            }}
          >
            {t.text}
          </Text>
        ))}
      </Page>
    </Document>
  );
}
