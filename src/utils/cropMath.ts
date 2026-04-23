// cropX / cropY are normalised 0-1 offsets (0.5 = centred)
export function getCoverCrop(
  imgW: number, imgH: number,
  slotW: number, slotH: number,
  cropX = 0.5, cropY = 0.5,
) {
  const slotAspect = slotW / slotH;
  let cropW: number, cropH: number;
  if (imgW / imgH > slotAspect) {
    cropH = imgH;
    cropW = imgH * slotAspect;
  } else {
    cropW = imgW;
    cropH = imgW / slotAspect;
  }
  return {
    x: (imgW - cropW) * cropX,
    y: (imgH - cropH) * cropY,
    width: cropW,
    height: cropH,
  };
}
