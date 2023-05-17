import {HttpStatusCode} from "@angular/common/http";

export const HttpErrorMessages = new Map<HttpStatusCode, string>([
  [HttpStatusCode.Unauthorized, 'The API-Key you used is probably invalid. Try entering it again:'],
  [HttpStatusCode.TooManyRequests, 'Too many requests in a short time. You could try and continue the story by re-entering your command after some time has passed.']
]);

export const genericErrorMessages = {
  pending: 'Your message was ignored as the previous request was still pending.'
}

export function parseError(error: any): string {
  if (HttpErrorMessages.has(error.response?.status)) {
    return `HTTP Error: ${error.message}.\n\n${HttpErrorMessages.get(error.response.status)}`;
  }
  return `An unknown error has occurred: ${JSON.stringify(error)}.`;
}

