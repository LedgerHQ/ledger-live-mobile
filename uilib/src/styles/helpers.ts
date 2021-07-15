import Color from 'color';

import {fontFamilies} from './theme';

export const rgba = (c: string, a: number) =>
  Color(c).alpha(a).rgb().toString();

export const darken = (c: string, a: number) => Color(c).darken(a).toString();

export const lighten = (c: string, a: number) => Color(c).lighten(a).toString();

export const mix = (c: string, b: string, a: number) =>
  Color(c).mix(Color(b), a).toString();

export const ff = (v: string) => {
  const [font, type = 'Regular'] = v.split('|');
  // @ts-ignore
  const {style, weight} = fontFamilies[font][type];
  // @ts-ignore
  const fallback = fontFamilies[font].fallback || 'Arial';

  return {
    fontFamily: `${font}, ${fallback}`,
    fontWeight: weight,
    fontStyle: style,
  };
};

const get = (object: any, path: any): any => {
  let p = path;
  if (typeof path === 'string') p = path.split('.').filter(key => key.length);
  return p.reduce((dive: any, key: string) => dive && dive[key], object);
};

export const getColor = (p: Record<string, any>, color: string): string => {
  const c = get(p.colors, color);
  console.log(c);
  return c;
};
