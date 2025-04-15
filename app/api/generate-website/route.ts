import { NextRequest, NextResponse } from "next/server";
import generateValidSectionCode from "@/lib/services/code-quality";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    const validCode = await generateValidSectionCode(prompt);

    return NextResponse.json({ code: validCode });
  } catch (error) {
    console.error("Error during generation/verification:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
