type TiptapTextNode = {
  type: "text";
  text: string;
};

type TiptapParagraphNode = {
  type: "paragraph";
  content?: TiptapTextNode[];
};

type TiptapDocument = {
  type: "doc";
  content: TiptapParagraphNode[];
};

export function createPlainTextContentJson(plainText: string) {
  const content: TiptapParagraphNode[] = plainText.split("\n").map((line) => ({
    type: "paragraph",
    ...(line ? { content: [{ type: "text", text: line }] } : {}),
  }));
  const document: TiptapDocument = { type: "doc", content };

  return JSON.stringify(document);
}
