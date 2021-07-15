export type TextTypes =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'highlight'
  | 'emphasis'
  | 'body'
  | 'cta'
  | 'link'
  | 'tiny'
  | 'subTitle'
  | 'navigation'
  | 'tag';

export default function getTextStyle({
  type,
  bracket,
}: {
  type: TextTypes;
  bracket?: boolean;
}): {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  fontWeight?: number;
  textDecoration?: string;
  paddingTop?: number;
} {
  switch (type) {
    case 'h1':
      return {
        fontFamily: 'HMAlphaMono-Medium',
        fontSize: 36,
        lineHeight: 43.2,
        paddingTop: bracket ? 15 : 0,
      };
    case 'h2':
      return {
        fontFamily: 'HMAlphaMono-Medium',
        fontSize: 28,
        lineHeight: 33.6,
        paddingTop: bracket ? 10 : 0,
      };
    case 'h3':
      return {
        fontFamily: 'HMAlphaMono-Medium',
        fontSize: 20,
        lineHeight: 24,
        paddingTop: bracket ? 5 : 0,
      };
    case 'highlight':
      return {
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        lineHeight: 19.36,
      };
    case 'emphasis':
      return {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        lineHeight: 20,
      };
    case 'body':
      return {
        fontFamily: 'Inter-Regular',
        fontSize: 13,
        lineHeight: 20,
      };
    case 'cta':
      return {
        fontFamily: 'Inter-Regular',
        fontSize: 13,
        lineHeight: 15.73,
        fontWeight: 600,
      };
    case 'link':
      return {
        fontFamily: 'Inter-Regular',
        fontSize: 13,
        lineHeight: 16,
        textDecoration: 'underline',
      };
    case 'tiny':
      return {
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        lineHeight: 16,
      };
    case 'navigation':
      return {
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        lineHeight: 14.52,
        fontWeight: 600,
      };
    case 'subTitle':
      return {
        fontFamily: 'Inter-Regular',
        fontSize: 11,
        lineHeight: 13.31,
        fontWeight: 600,
      };
    case 'tag':
      return {
        fontFamily: 'Inter-Regular',
        fontSize: 10,
        lineHeight: 12.1,
        fontWeight: 600,
      };
    default:
      return {
        fontFamily: 'Inter-Regular',
        fontSize: 13,
        lineHeight: 20,
      };
  }
}
