import { useState } from 'react';
import type { LayoutSlot, Template } from '../types';

function withDefaults(slots: LayoutSlot[]): LayoutSlot[] {
  return slots.map(s => ({ cropX: 0.5, cropY: 0.5, ...s }));
}

export function useLayout(defaultTemplate: Template) {
  const [slots, setSlots] = useState<LayoutSlot[]>(
    () => withDefaults(structuredClone(defaultTemplate.slots))
  );

  function assignImage(slotId: string, imageId: string) {
    setSlots(prev =>
      prev.map(slot => slot.id === slotId ? { ...slot, imageId, cropX: 0.5, cropY: 0.5 } : slot)
    );
  }

  function loadTemplate(template: Template) {
    setSlots(withDefaults(structuredClone(template.slots)));
  }

  function clearSlot(slotId: string) {
    setSlots(prev =>
      prev.map(slot => slot.id === slotId ? { ...slot, imageId: null, cropX: 0.5, cropY: 0.5 } : slot)
    );
  }

  function updateCrop(slotId: string, cropX: number, cropY: number) {
    setSlots(prev =>
      prev.map(slot => slot.id === slotId ? { ...slot, cropX, cropY } : slot)
    );
  }

  function setCornerRadius(radius: number) {
    setSlots(prev => prev.map(slot => ({ ...slot, cornerRadius: radius })));
  }

  return { slots, assignImage, clearSlot, loadTemplate, updateCrop, setCornerRadius };
}
