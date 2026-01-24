const escapePdfText = (text: string) =>
  (text || " ")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/\r?\n/g, " ");

export const createPdfBlobFromLines = (lines: string[]) => {
  const sanitizedLines = lines.length ? lines : ["Neurovantage Report"];
  const linesPerPage = 44;
  const pages: string[][] = [];
  for (let i = 0; i < sanitizedLines.length; i += linesPerPage) {
    pages.push(sanitizedLines.slice(i, i + linesPerPage));
  }
  if (pages.length === 0) {
    pages.push(["Neurovantage Report"]);
  }

  const pdfObjects: string[] = [];
  const addObject = (content: string) => {
    pdfObjects.push(content);
    return pdfObjects.length;
  };

  const catalogIndex = addObject("");
  const pagesIndex = addObject("");
  const fontIndex = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const pageRefs: number[] = [];

  const buildPageContent = (pageLines: string[]) => {
    const startY = 770;
    const lineHeight = 16;
    return pageLines
      .map((line, idx) => {
        const y = startY - idx * lineHeight;
        return `BT /F1 12 Tf 40 ${y} Td (${escapePdfText(line)}) Tj ET`;
      })
      .join("\n");
  };

  pages.forEach((pageLines) => {
    const stream = buildPageContent(pageLines);
    const contentIndex = addObject(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
    const pageIndex = addObject(
      `<< /Type /Page /Parent ${pagesIndex} 0 R /MediaBox [0 0 612 792] /Contents ${contentIndex} 0 R /Resources << /Font << /F1 ${fontIndex} 0 R >> >> >>`,
    );
    pageRefs.push(pageIndex);
  });

  pdfObjects[catalogIndex - 1] = `<< /Type /Catalog /Pages ${pagesIndex} 0 R >>`;
  pdfObjects[pagesIndex - 1] = `<< /Type /Pages /Kids [${pageRefs
    .map((ref) => `${ref} 0 R`)
    .join(" ")}] /Count ${pageRefs.length} >>`;

  const header = "%PDF-1.4\n";
  let body = "";
  const offsets = [0];
  pdfObjects.forEach((obj, idx) => {
    offsets.push(header.length + body.length);
    body += `${idx + 1} 0 obj\n${obj}\nendobj\n`;
  });

  const xrefStart = header.length + body.length;
  let xref = `xref\n0 ${pdfObjects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= pdfObjects.length; i += 1) {
    xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  const trailer = `trailer << /Size ${pdfObjects.length + 1} /Root ${catalogIndex} 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  const pdfString = header + body + xref + trailer;
  return new Blob([pdfString], { type: "application/pdf" });
};

export const downloadPdfFromLines = (lines: string[], filename: string) => {
  const blob = createPdfBlobFromLines(lines);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
