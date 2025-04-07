import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const url = process.env.GITLAB_API_BASE_URL!
    const token = process.env.GITLAB_SECRET_TOKEN!
    if (!token) {
        return NextResponse.json(
            { error: 'GitLab token not configured' },
            { status: 500 }
        );
    }

    try {
        const createData = await req.json();

        const response = await fetch(`${url}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(createData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { error: 'Failed to create repository', details: errorData },
                { status: response.status }
            );
        }

        const data = await response.json();
        // Return 201 Created for successful repository creation.
        return NextResponse.json(data, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            {
                error: 'An error occurred while creating repository',
                details: error.message,
            },
            { status: 500 }
        );
    }
}
