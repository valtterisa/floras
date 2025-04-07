import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest,
    { params }: { params: { repoId: string } }
) {
    const url = process.env.GITLUB_API_BASE_URL!
    const token = process.env.GITLAB_SECRET_TOKEN!;
    if (!token) {
        return NextResponse.json(
            { error: 'GitLab token not configured' },
            { status: 500 }
        );
    }

    try {
        const updateData = await req.json();

        const response = await fetch(
            `${url}/${encodeURIComponent(params.repoId)}`,
            {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { error: 'Failed to update repository data', details: errorData },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            {
                error: 'An error occurred while updating repository data',
                details: error.message,
            },
            { status: 500 }
        );
    }
}