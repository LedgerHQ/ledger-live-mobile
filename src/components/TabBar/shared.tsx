export const BAR_HEIGHT = 56;

export const HAS_GRADIENT = true;
export const GRADIENT_HEIGHT = 103;

export const MAIN_BUTTON_SIZE = 64;
export const MAIN_BUTTON_BOTTOM = 16;

export const BAR_SAFE_HEIGHT = Math.max(
  HAS_GRADIENT ? GRADIENT_HEIGHT : 0,
  Math.max(BAR_HEIGHT, MAIN_BUTTON_SIZE + MAIN_BUTTON_BOTTOM),
);
