export const space = [0, 5, 10, 15, 20, 30, 44, 50, 70];
export const fontSizes = [8, 9, 10, 12, 13, 16, 18, 22, 32];
export const radii = [0, 4];
export const zIndexes = [-1, 0, 1, 9, 10, 90, 100, 900, 1000];

// Those fonts are now defined in global.css, this is just a mapping for styled-system
export const fontFamilies = {
  Inter: {
    ExtraLight: {
      weight: 100,
      style: 'normal',
    },
    Light: {
      weight: 300,
      style: 'normal',
    },
    Regular: {
      weight: 400,
      style: 'normal',
    },
    Medium: {
      weight: 500,
      style: 'normal',
    },
    SemiBold: {
      weight: 600,
      style: 'normal',
    },
    Bold: {
      weight: 700,
      style: 'normal',
    },
    ExtraBold: {
      weight: 800,
      style: 'normal',
    },
  },
  Alpha: {
    Medium: {
      weight: 500,
      style: 'normal',
    },
  },
};

// @Rebrand remove this
const colors = {
  transparent: 'transparent',
  pearl: '#ff0000',
  alertRed: '#ea2e49',
  warning: '#f57f17',
  black: '#000000',
  dark: '#142533',
  separator: '#aaaaaa',
  fog: '#d8d8d8',
  gold: '#d6ad42',
  graphite: '#767676',
  grey: '#999999',
  identity: '#41ccb4',
  lightFog: '#eeeeee',
  sliderGrey: '#F0EFF1',
  lightGraphite: '#fafafa',
  lightGrey: '#f9f9f9',
  starYellow: '#FFD24A',
  orange: '#ffa726',
  positiveGreen: 'rgba(102, 190, 84, 1)',
  greenPill: '#41ccb4',
  smoke: '#666666',
  wallet: '#6490f1',
  blueTransparentBackground: 'rgba(100, 144, 241, 0.15)',
  pillActiveBackground: 'rgba(100, 144, 241, 0.1)',
  lightGreen: 'rgba(102, 190, 84, 0.1)',
  lightRed: 'rgba(234, 46, 73, 0.1)',
  lightWarning: 'rgba(245, 127, 23, 0.1)',
  white: '#ffffff',
  experimentalBlue: '#165edb',
  marketUp_eastern: '#ea2e49',
  marketUp_western: '#66be54',
  marketDown_eastern: '#6490f1',
  marketDown_western: '#ea2e49',
};

// prettier-ignore
const exportedColors = colors;

export {exportedColors as colors};
type Font = {
  weight: number;
  style: string;
};

export type Theme = {
  sizes: {
    topBarHeight: number;
    sideBarWidth: number;
  };
  radii: number[];
  fontFamilies: {[k: string]: {[k: string]: Font}};
  fontSizes: number[];
  space: number[];
  colors: Record<string, any>;
  zIndexes: number[];
};

const theme: Theme = {
  sizes: {
    topBarHeight: 58,
    sideBarWidth: 230,
  },
  radii,
  fontFamilies,
  fontSizes,
  space,
  colors,
  zIndexes,
};

export default theme;
