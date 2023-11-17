export class TranslateAPIRequestBody {
    text: string;
    sourceLang: string | undefined;
    targetLang: string
}

export class StableDiffusionRequestBody {
    prompt: string;
    numSteps: number | undefined = 20;
}

export class ResponseBody {
    error: string;
    data: any
}
