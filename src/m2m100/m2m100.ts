import { RequestBody } from './model';
import { Ai } from '@cloudflare/ai';

export async function translate(
    request: Request, 
    ai: Ai
): Promise<Response> {
    if (request.method != 'POST') {
        return new Response(null, {
            status: 405
        });
    }

    const requestBody: RequestBody = await request.json();
    const response = await ai.run(
        '@cf/meta/m2m100-1.2b',
        {
            text: requestBody.text,
            source_lang: requestBody.sourceLang || 'english',
            target_lang: requestBody.targetLang
        }
    );

    return new Response(JSON.stringify(response));
}