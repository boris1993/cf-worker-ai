import { Env } from './env';
import { draw } from './stable-diffusion/stable_diffusion';

export default {
    async fetch(request: Request, env: Env) {
        const urlParts = new URL(request.url);
        let path = urlParts.pathname;
        let pathParts = path?.split('/');
        switch (pathParts[1]) {
            case 'favicon.ico':
                return new Response();
            case 'stable-diffusion':
                return draw(request, env);
            default:
                return new Response(null, {
                    status: 404
                });
        }
    }
}
