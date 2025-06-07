import { marked } from "marked";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

// Convert Markdown to docx Paragraphs
const markdownToDocx = (markdown: string) => {
    const tokens = marked.lexer(markdown);
    const paragraphs: Paragraph[] = [];

    tokens.forEach((token) => {
        if (token.type === "heading") {
            paragraphs.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: token.text,
                            bold: true,
                            size: 28, // Larger size for headings
                        }),
                    ],
                    spacing: { after: 300 }, // Increased spacing after headings
                })
            );
        } else if (token.type === "paragraph") {
            paragraphs.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: token.text,
                            size: 24, // Standard text size
                        }),
                    ],
                    spacing: { after: 200 }, // Increased spacing after paragraphs
                })
            );
        } else if (token.type === "list") {
            token.items.forEach((item: { text: string }) => {
                const boldMatch = item.text.match(/\*\*(.+?)\*\*/); // Match **bold** text
                const children = boldMatch
                    ? [
                        new TextRun({ text: boldMatch[1], bold: true, size: 24 }), // Bolded text
                        new TextRun({ text: item.text.replace(/\*\*.+?\*\*/, ""), size: 24 }), // Remaining text
                    ]
                    : [new TextRun({ text: item.text, size: 24 })]; // Plain text if no bold

                paragraphs.push(
                    new Paragraph({
                        children,
                        bullet: { level: 0 }, // Bullet point
                        spacing: { after: 100 }, // Spacing after each bullet
                    })
                );
            });
        }
    });

    return paragraphs;
};

export const handleDownloadDocx = async (output: { document: string }) => {
    if (!output?.document) return;

    try {
        const docParagraphs = markdownToDocx(output.document);

        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: docParagraphs,
                },
            ],
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, `GeneratedDocument-${new Date()}.docx`);
    } catch (error) {
        console.error("Error generating DOCX:", error);
    }
};