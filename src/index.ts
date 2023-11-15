import * as url from 'url';
import { Ai } from '@cloudflare/ai';
import { AiTextToImageInput } from '@cloudflare/ai/dist/tasks/text-to-image';

export interface Env {
    AI: any;
}

export default {
    async fetch(request: Request, env: Env) {
        const urlParts = url.parse(request.url);
        let path = urlParts.pathname;
        let pathParts = path?.split("/");
        if (pathParts[1] === "favicon.ico") {
            return new Response();
        }

        const ai = new Ai(env.AI);
        const [prompt, numSteps] = extractPromptFromQueryParams(request);
        const inputs: AiTextToImageInput = {
            prompt: prompt,
            num_steps: numSteps
        };

        const response = await ai.run("@cf/stabilityai/stable-diffusion-xl-base-1.0", inputs);

        return new Response(response, {
            headers: {
                "content-type": "image/png",
            },
        });
    }
}

function extractPromptFromQueryParams(request: Request): [string, number] {
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
