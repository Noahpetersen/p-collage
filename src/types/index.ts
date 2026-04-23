export interface UploadedImage {
  id: string;
  url: string;
  name: string;
}

export interface LayoutSlot {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  imageId: string | null;
  cornerRadius?: number;
  cropX: number;
  cropY: number;
}

export interface CanvasDecoration {
  id: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
  url: string;
}

export interface FreeImage {
  id: string;
  imageId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  cropX: number;
  cropY: number;
}

export interface CanvasText {
  id: string;
  text: string;
  x: number;
  y: number;
  fontFamily: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  align: 'left' | 'center' | 'right';
  color: string;
  width: number;
}

export interface Template {
  id: string;
  name: string;
  slots: LayoutSlot[];
}
