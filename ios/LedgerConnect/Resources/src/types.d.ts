/* eslint-disable import/no-default-export */

declare module '*.svg' {
  const content: JSX.IntrinsicElements.svg;
  export default content;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module 'ethereumjs-units';

declare module 'base58-js' {
  export function binary_to_base58(arr: Uint8Array): string;
  export function base58_to_binary(arr: string): Uint8Array;
}

declare module 'react-alert-template-basic';
