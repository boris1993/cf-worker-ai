import { translate } from './m2m100/m2m100';
import { draw } from './stable-diffusion/stable_diffusion';
import { Ai } from '@cloudflare/ai';

export interface Env {
    AI: any;
}

export default {
    async fetch(request: Request, env: Env) {
        const ai = new Ai(env.AI);
        const urlParts = new URL(request.url);
        let path = urlParts.pathname;
        let pathParts = path?.split('/');
        switch (pathParts[1]) {
            case 'favicon.ico':
                return new Response();
            case 'translate':
                return translate(request, ai);
            case 'stable-diffusion':
                return draw(request, ai);
            default:
                return new Response(null, {
                    status: 404
                });
        }
    }
}
