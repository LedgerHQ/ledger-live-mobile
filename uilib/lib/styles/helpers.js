import Color from 'color';
export const rgba = (c, a) => Color(c)
    .alpha(a)
    .rgb()
    .toString();
export const darken = (c, a) => Color(c)
    .darken(a)
    .toString();
export const lighten = (c, a) => Color(c)
    .lighten(a)
    .toString();
export const mix = (c, b, a) => Color(c)
    .mix(Color(b), a)
    .toString();
const get = (object, path) => {
    let p = path;
    if (typeof path === 'string')
        p = path.split('.').filter(key => key.length);
    return p.reduce(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    (dive, key) => dive && dive[key], object);
};
export const getColor = (p, color) => {
    const c = get(p.colors, color);
    return c;
};
