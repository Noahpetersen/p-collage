import { A4 } from '../constants';
import type { Template, LayoutSlot } from '../types';

const PAD = 20;
const GAP = 12;
const CORNER = 10;
const W = A4.width - PAD * 2;
const H = A4.height - PAD * 2;

function slot(id: string, x: number, y: number, w: number, h: number): LayoutSlot {
  return { id, x, y, width: w, height: h, imageId: null, cornerRadius: CORNER };
}

export function makeGrid(cols: number, rows: number, id: string, name: string): Template {
  const slotW = (W - GAP * (cols - 1)) / cols;
  const slotH = (H - GAP * (rows - 1)) / rows;
  const slots: LayoutSlot[] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      slots.push(slot(`${id}-${r}-${c}`, PAD + c * (slotW + GAP), PAD + r * (slotH + GAP), slotW, slotH));
  return { id, name, slots };
}

// 1 large top + 3 equal bottom
function makeHeroTop(): Template {
  const heroH = H * 0.58;
  const rowH = H - heroH - GAP;
  const smallW = (W - GAP * 2) / 3;
  return {
    id: 'hero-top', name: 'Hero Top', slots: [
      slot('h0', PAD, PAD, W, heroH),
      slot('h1', PAD, PAD + heroH + GAP, smallW, rowH),
      slot('h2', PAD + smallW + GAP, PAD + heroH + GAP, smallW, rowH),
      slot('h3', PAD + (smallW + GAP) * 2, PAD + heroH + GAP, smallW, rowH),
    ],
  };
}

// 1 large left + 3 stacked right
function makeHeroLeft(): Template {
  const heroW = W * 0.58;
  const colW = W - heroW - GAP;
  const smallH = (H - GAP * 2) / 3;
  return {
    id: 'hero-left', name: 'Hero Left', slots: [
      slot('h0', PAD, PAD, heroW, H),
      slot('h1', PAD + heroW + GAP, PAD, colW, smallH),
      slot('h2', PAD + heroW + GAP, PAD + smallH + GAP, colW, smallH),
      slot('h3', PAD + heroW + GAP, PAD + (smallH + GAP) * 2, colW, smallH),
    ],
  };
}

// 3 stacked left + 1 large right
function makeHeroRight(): Template {
  const heroW = W * 0.58;
  const colW = W - heroW - GAP;
  const smallH = (H - GAP * 2) / 3;
  return {
    id: 'hero-right', name: 'Hero Right', slots: [
      slot('h0', PAD, PAD, colW, smallH),
      slot('h1', PAD, PAD + smallH + GAP, colW, smallH),
      slot('h2', PAD, PAD + (smallH + GAP) * 2, colW, smallH),
      slot('h3', PAD + colW + GAP, PAD, heroW, H),
    ],
  };
}

// 2 large top + 4 small bottom
function makeFeatured(): Template {
  const topH = H * 0.52;
  const botH = H - topH - GAP;
  const halfW = (W - GAP) / 2;
  const qW = (W - GAP * 3) / 4;
  return {
    id: 'featured', name: 'Featured', slots: [
      slot('f0', PAD, PAD, halfW, topH),
      slot('f1', PAD + halfW + GAP, PAD, halfW, topH),
      slot('f2', PAD, PAD + topH + GAP, qW, botH),
      slot('f3', PAD + qW + GAP, PAD + topH + GAP, qW, botH),
      slot('f4', PAD + (qW + GAP) * 2, PAD + topH + GAP, qW, botH),
      slot('f5', PAD + (qW + GAP) * 3, PAD + topH + GAP, qW, botH),
    ],
  };
}

// Alternating rows: 2×2 grid ↔ large hero
function makeMixed(): Template {
  const rowH = (H - GAP * 2) / 3;
  const smallH = (rowH - GAP) / 2;
  const smallW = smallH;
  const smallSecW = smallW * 2 + GAP;
  const largeW = W - GAP - smallSecW;
  const slots: LayoutSlot[] = [];
  let i = 0;
  [PAD, PAD + rowH + GAP, PAD + (rowH + GAP) * 2].forEach((rowY, rowIdx) => {
    const smallOnLeft = rowIdx !== 1;
    const sX = smallOnLeft ? PAD : PAD + largeW + GAP;
    const lX = smallOnLeft ? PAD + smallSecW + GAP : PAD;
    for (let r = 0; r < 2; r++)
      for (let c = 0; c < 2; c++)
        slots.push(slot(`m${i++}`, sX + c * (smallW + GAP), rowY + r * (smallH + GAP), smallW, smallH));
    slots.push(slot(`m${i++}`, lX, rowY, largeW, rowH));
  });
  return { id: 'mixed', name: 'Mixed', slots };
}

// Top: 2×2 small left + large right | Middle: full-width banner | Bottom: same as top
function makeBannerMid(): Template {
  const bannerH = H * 0.22;
  const outerH = (H - bannerH - GAP * 2) / 2;
  const smallH = (outerH - GAP) / 2;
  const smallW = smallH;
  const smallSecW = smallW * 2 + GAP;
  const largeW = W - GAP - smallSecW;

  const topY = PAD;
  const midY = PAD + outerH + GAP;
  const botY = midY + bannerH + GAP;

  const slots: LayoutSlot[] = [];
  let i = 0;

  // top and bottom rows: 2×2 small left, large right
  [topY, botY].forEach(rowY => {
    for (let r = 0; r < 2; r++)
      for (let c = 0; c < 2; c++)
        slots.push(slot(`b${i++}`, PAD + c * (smallW + GAP), rowY + r * (smallH + GAP), smallW, smallH));
    slots.push(slot(`b${i++}`, PAD + smallSecW + GAP, rowY, largeW, outerH));
  });

  // middle full-width banner
  slots.push(slot(`b${i++}`, PAD, midY, W, bannerH));

  return { id: 'banner-mid', name: 'Banner', slots };
}

export const templateBannerMid = makeBannerMid();

export const templateSingle   = makeGrid(1, 1,  '1x1', 'Single');
export const templateDiptych  = makeGrid(2, 1,  '2x1', 'Diptych');
export const templateTriptych = makeGrid(3, 1,  '3x1', 'Triptych');
export const template2x2      = makeGrid(2, 2,  '2x2', '2 × 2');
export const template3x2      = makeGrid(3, 2,  '3x2', '3 × 2');
export const template3x4      = makeGrid(3, 4,  '3x4', '3 × 4');
export const template4x4      = makeGrid(4, 4,  '4x4', '4 × 4');
export const templateHeroTop   = makeHeroTop();
export const templateHeroLeft  = makeHeroLeft();
export const templateHeroRight = makeHeroRight();
export const templateFeatured  = makeFeatured();
export const templateMixed     = makeMixed();

export const templates: Template[] = [
  templateMixed,
  templateBannerMid,
  templateFeatured,
  templateHeroTop,
  templateHeroLeft,
  templateHeroRight,
  templateSingle,
  templateDiptych,
  templateTriptych,
  template2x2,
  template3x2,
  template3x4,
  template4x4,
];
