import {Injectable} from '@angular/core';
import {ChatCompletionRequestMessageRoleEnum, OpenAIApi} from 'openai';
import {environment} from "../../environments/environment";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {Message} from "../domain/message.model";
import {GAME_CONFIG} from "../config/game.config";
import {MessageParsingUtils} from "../utils/message-parsing.utils";

@Injectable({
  providedIn: 'root'
})
export class StorytellerService {

  private readonly openAIApi: OpenAIApi = new OpenAIApi(environment.apiConfiguration)
  private readonly conversation: Message[] = [GAME_CONFIG.initialPrompt];

  private readonly conversation$$: Subject<Message[]> = new Subject<Message[]>();
  private readonly pending$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor() {
    this.generateCompletion(this.conversation);
  }

  /**
   * Generate a new completion given previous messages.
   * @param messages - the messages containing the conversation - an array of Message
   * @param model - the completion model to use
   * @param temperature - the temperature or 'randomness'
   */
  public generateCompletion(messages: Message[], model = 'gpt-3.5-turbo', temperature = 0.6): any {
    this.pending$$.next(true);
    this.openAIApi.createChatCompletion({model, messages, temperature,})
      .then(this.processResponse.bind(this))
      .catch(console.error)
      .finally(() => this.pending$$.next(false));
  }

  /**
   * Respond to the prompt, by adding the message to the conversation and asking for a completion on the conversation.
   * @param content - the content of the new message.
   */
  public respond(content: string): void {
    this.conversation.push(new Message(content, ChatCompletionRequestMessageRoleEnum.User));
    this.conversation$$.next(this.conversation);
    this.generateCompletion(this.conversation);
  }

  /**
   * Processes the response from the OpenAIApi and appends them in sorted order to the messages array.
   * @param response - the OpenAIApi response
   */
  private processResponse(response: any): any {
    response.data.choices
      .sort((a: any, b: any) => a.index < b.index)
      .forEach((choice: any) => {
        let msg = new Message(choice.message.content, choice.message.role);
        this.conversation.push(msg)
        MessageParsingUtils.parseMessage(msg);
      });
    this.conversation$$.next(this.conversation);
    return null;
  }

  get conversation$(): Observable<Message[]> {
    return this.conversation$$.asObservable();
  }
  get pending$(): Observable<boolean> {
    return this.pending$$.asObservable();
  }
}
