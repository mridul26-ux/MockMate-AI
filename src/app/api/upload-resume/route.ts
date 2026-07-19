import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
// Removed ES imports for pdf-parse and mammoth to use require() inside the handler

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let extractedText = "";

    if (file.type === "application/pdf") {
      const pdfParseModule = eval('require')("pdf-parse");
      if (pdfParseModule.PDFParse) {
        const parser = new pdfParseModule.PDFParse({ data: buffer });
        await parser.load();
        const text = await parser.getText();
        // Fallback for different return structures in getText()
        extractedText = typeof text === "string" ? text : (text.text || "");
      } else {
        const pdfParse = typeof pdfParseModule === "function" ? pdfParseModule : (pdfParseModule.default || pdfParseModule);
        if (typeof pdfParse !== "function") throw new Error("pdfParse resolved to: " + typeof pdfParse);
        const pdfData = await pdfParse(buffer);
        extractedText = pdfData.text;
      }
    } else if (
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.name.endsWith(".docx")
    ) {
      const mammothModule = eval('require')("mammoth");
      const mammoth = typeof mammothModule === "function" ? mammothModule : (mammothModule.default || mammothModule);
      
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else {
      return NextResponse.json({ error: "Unsupported file type. Please upload a PDF or DOCX file." }, { status: 400 });
    }

    // Return the extracted text
    return NextResponse.json({ success: true, text: extractedText }, { status: 200 });
  } catch (error) {
    console.error("Error parsing resume:", error);
    return NextResponse.json(
      { success: false, error: "Failed to parse resume file" },
      { status: 500 }
    );
  }
}
