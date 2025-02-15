export type SectionType = 'solidCircle' | 'circularHollow' | 'solidSquare' | 'squareHollow' | 'solidRectangle' | 'rectangleHollow' | 'iSection';

export interface CalculationResult {
  A: number;
  xc: number;
  yc: number;
  Ix: number;
  Iy: number;
  Zx: number;
  Zy: number;
  Sx: number;
  Sy: number;
  rx: number;
  ry: number;
}

export interface SavedResult extends CalculationResult {
  id: string;
  sectionType: SectionType;
  timestamp: string;
  parameters: Record<string, number>;
}