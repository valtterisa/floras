import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    _req: NextRequest,
    { params }: { params: { repoId: string } }
) {
    const url = process.env.GITLAB_API_BASE_URL!
    const token = process.env.GITLAB_SECRET_TOKEN!
    if (!token) {
        return NextResponse.json(
            { error: 'GitLab token not configured' },
            { status: 500 }
        );
    }

    try {
        const response = await fetch(
            `${url}/${encodeURIComponent(params.repoId)}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { error: 'Failed to fetch repository data', details: errorData },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            {
                error: 'An error occurred while fetching repository data',
                details: error.message,
            },
            { status: 500 }
        );
    }
}
