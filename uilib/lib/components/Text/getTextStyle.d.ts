export declare type TextTypes = "h1" | "h2" | "h3" | "highlight" | "emphasis" | "body" | "cta" | "link" | "tiny" | "subTitle" | "navigation" | "tag";
export default function getTextStyle({ type, bracket, }: {
    type: TextTypes;
    bracket?: boolean;
}): {
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    fontWeight?: number;
    textDecoration?: string;
    paddingTop?: number;
};
