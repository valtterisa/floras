import { NextResponse } from "next/server";
import { getPolarProducts } from "@/lib/polar";

export async function GET() {
    try {
        const products = await getPolarProducts();
        return NextResponse.json({ products });
    } catch (error) {
        console.error("Error fetching polar products:", error);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
} 