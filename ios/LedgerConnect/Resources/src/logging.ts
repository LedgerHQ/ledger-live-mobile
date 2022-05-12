export type Logger = (message: string, ...others: any[]) => void;

export const getLogger =
  (fileName: string): Logger =>
  (message: string, ...others: any[]) => {
    console.log(`[${fileName}.js] ${message}`, ...others);
  };

export const getErrorLogger =
  (fileName: string): Logger =>
  (message: string, ...others: any[]) =>
    console.error(`[${fileName}.js] ${message}`, ...others);

