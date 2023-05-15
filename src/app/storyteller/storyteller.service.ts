import {Injectable} from '@angular/core';
import {OpenAIApi} from 'openai';
import {environment} from "../../environments/environment";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {Message} from "../domain/message.model";
import {TEXT_BASED_RPG} from "../config/game.config";

@Injectable({
  providedIn: 'root'
})
export class StorytellerService {

  private readonly openAIApi: OpenAIApi = new OpenAIApi(environment.apiConfiguration)
  private readonly messages: Message[] = [TEXT_BASED_RPG.initialPrompt];

  private readonly response$$: Subject<Message[]> = new Subject<Message[]>();
  private readonly pending$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor() {
    this.generateCompletion(this.messages);
  }

  /**
   * Generate a new completion given previous messages.
   * @param messages - the messages containing the conversation - an array of Message
   * @param model - the completion model to use
   * @param temperature - the temperature or 'randomness'
   */
  public generateCompletion(messages: Message[], model = 'gpt-3.5-turbo', temperature = 0.87): any {
    this.pending$$.next(true);
    this.openAIApi.createChatCompletion({model, messages, temperature,})
      .then(this.mapResponse)
      .then(response => this.response$$.next(response))
      .catch(console.error)
      .finally(() => this.pending$$.next(false));
  }

  /**
   * Respond to the prompt.
   * @param message - the new message.
   */
  public respond(message: Message): void {
    this.messages.push(message);
    this.generateCompletion(this.messages);
  }

  /**
   * Maps the response from the OpenAIApi to an array of Message objects.
   * @param response - the OpenAIApi response
   */
  private mapResponse(response: any): Message[] {
    const result: Message[] = [];
    response.data.choices
      .sort((a: any, b: any) => a.index < b.index)
      .forEach((choice: any) => result.push(new Message(choice.message.content, choice.message.role)));
    return result;
  }

  get response$(): Observable<Message[]> {
    return this.response$$.asObservable();
  }
  get pending$(): Observable<boolean> {
    return this.pending$$.asObservable();
  }
}
