// app/api/deploy-project/route.ts
import { Vercel } from '@vercel/sdk';
import { CreateProjectFramework } from '@vercel/sdk/models/createprojectop.js';
import { NextRequest, NextResponse } from 'next/server';

const vercel = new Vercel({
    bearerToken: process.env.VERCEL_TOKEN!,
});

interface CreateProjectRequest {
    projectName: string;
    gitRepo: string;
    gitOrg: string;
    framework?: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: CreateProjectRequest = await request.json();
        const { projectName } = body;

        console.log("projectName", projectName);

        const gitOrg = "builddrr-user-sites";
        const repo = `${gitOrg}/${projectName}`;

        // Create project
        const project = await vercel.projects.createProject({
            teamId: process.env.VERCEL_TEAM_ID!,
            slug: process.env.VERCEL_TEAM_SLUG!,
            requestBody: {
                name: projectName,
                framework: "nextjs",
                gitRepository: {
                    repo: repo,
                    type: 'github',
                },
            },
        });

        console.log("project created");

        // Create deployment
        const deployment = await vercel.deployments.createDeployment({
            teamId: process.env.VERCEL_TEAM_ID!,
            slug: process.env.VERCEL_TEAM_SLUG!,
            forceNew: "1",
            requestBody: {
                name: projectName,
                target: 'production',
                gitSource: {
                    type: 'github',
                    repo: repo,
                    ref: 'main',
                    org: gitOrg,
                },
            },
        });

        console.log("deployment created");
        return NextResponse.json({
            project: project.id,
            deployment: deployment.id,
            url: deployment.url,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}