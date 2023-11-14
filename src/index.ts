import { Ai } from '@cloudflare/ai';

export interface Env {
    AI: any;
}

export default {
    async fetch(
        request: Request,
        env: Env
    ): Promise<Response> {
        const ai = new Ai(env.AI);
        const inputs = {
            prompt: extractPromptFromQueryParams(request)
        };

        const response = await ai.run("@cf/stabilityai/stable-diffusion-xl-base-1.0", inputs);

        return new Response(response, {
            headers: {
                "content-type": "image/png",
            },
        });
    }
}

function extractPromptFromQueryParams(request: Request): string {
    const urlParams = new URLSearchParams(request.url);
    const prompt = urlParams.get('prompt');
    if (prompt == null) {
        throw new Error("Prompt cannot be empty");
        
    }

    return prompt;
}
