import { Env } from '../env';
import { Ai } from '@cloudflare/ai';
import { AiTextToImageInput } from '@cloudflare/ai/dist/tasks/text-to-image';
import { RequestBody } from './model';

export async function draw(request: Request, env: Env): Promise<Response> {
    if (request.method != 'POST') {
        return new Response(null, {
            status: 405
        });
    }

    const ai = new Ai(env.AI);
    const requestBody: RequestBody = await request.json();
    const inputs: AiTextToImageInput = {
        prompt: requestBody.prompt,
        num_steps: requestBody.numSteps || 20
    };

    const response = await ai.run("@cf/stabilityai/stable-diffusion-xl-base-1.0", inputs);

    return new Response(response, {
        headers: {
            "content-type": "image/png",
        },
    });
}


function extractParameters(request: Request): [string, number] {
    if (request.method === 'POST') {
        return ["", 0]
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
