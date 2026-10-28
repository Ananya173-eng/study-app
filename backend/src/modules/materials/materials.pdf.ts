import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

export async function extractPdfText(buffer: Buffer): Promise<string> {
  const pdf = await getDocument({
    data: new Uint8Array(buffer),
    useSystemFonts: true,
  }).promise;

  try {
    const pages: string[] = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();

      const pageText = content.items
        .filter((item) => "str" in item)
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ");

      pages.push(pageText);
      page.cleanup();
    }

    return pages.join("\n").trim();
  } finally {
    await pdf.cleanup();
  }
}