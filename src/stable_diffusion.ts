import { StableDiffusionRequestBody } from './model';
import { Ai } from '@cloudflare/ai';

export async function draw(
    request: Request, 
    ai: Ai
): Promise<Response> {
    if (request.method != 'POST') {
        return new Response(null, {
            status: 405
        });
    }

    const requestBody: StableDiffusionRequestBody = await request.json();
    const response = await ai.run(
        '@cf/stabilityai/stable-diffusion-xl-base-1.0', 
        {
            prompt: requestBody.prompt,
            num_steps: requestBody.numSteps || 20
        }
    );

    return new Response(response, {
        headers: {
            'content-type': 'image/png',
        },
    });
}


function extractParameters(request: Request): [string, number] {
    if (request.method === 'POST') {
        return ['', 0]
    } else {
        const url = new URL(request.url);
        const urlParams = url.searchParams;

        const prompt = urlParams.get('prompt');
        if (prompt == null) {
            throw new Error("Prompt cannot be empty");
        }

        let numSteps: number = Number(urlParams.get('num_steps'));
        if (!numSteps) {
            numSteps = 20;
        }

        return [prompt, numSteps];
    }
}
