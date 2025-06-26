import { NextRequest, NextResponse } from "next/server";
import { generateAIResponseStream } from "@/app/actions";

export async function POST(req: NextRequest) {
    const { message, appName, machineId } = await req.json();

    if (!message || !appName || !machineId) {
        return NextResponse.json({ error: "Missing required parameters: message, appName, machineId" }, { status: 400 });
    }

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            try {
                for await (const chunk of generateAIResponseStream(message, appName, machineId)) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
                }
                controller.close();
            } catch (error) {
                const errorData = JSON.stringify({ type: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
                controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
} 