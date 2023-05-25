import {Injectable} from '@angular/core';
import {ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi} from 'openai';
import {environment} from "../../environments/environment";
import {BehaviorSubject, Observable} from "rxjs";
import {Message} from "../domain/message.model";
import {HttpStatusCode} from "@angular/common/http";
import {parseError} from "../config/error.messages.config";

@Injectable({
  providedIn: 'root'
})
export class StorytellerService {

  private openAIApi: OpenAIApi | undefined;
  private openAIPrompt: Message[] = [];
  private userPrompt: Message[] = [new Message(
    `${environment.gameConfiguration.title}\n\n${environment.gameConfiguration.description}`,
    ChatCompletionRequestMessageRoleEnum.System
  ), new Message(
    `Please enter your API-Key:`,
    ChatCompletionRequestMessageRoleEnum.System
  )];

  queryForApiKey = true;

  readonly conversation$$: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>(this.userPrompt);
  readonly pending$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
  }

  public initOpenAIApi(apiKey: string) {
    this.queryForApiKey = false;
    this.openAIApi = new OpenAIApi(new Configuration({apiKey}));
    this.userPrompt.push(new Message('Thank you, I will attempt to start a new adventure.', ChatCompletionRequestMessageRoleEnum.System));
    this.conversation$$.next(this.userPrompt);
    this.newStory();
  }

  /**
   * Starts a new story.
   */
  public newStory(): void {
    this.openAIPrompt = [environment.gameConfiguration.initialPrompt];
    this.generateCompletion(this.openAIPrompt);
  }

  /**
   * Generate a new completion given previous messages.
   * @param messages - the messages containing the conversation - an array of Message
   * @param model - the completion model to use
   * @param temperature - the temperature or 'randomness'
   */
  public generateCompletion(messages: Message[], model = 'gpt-3.5-turbo', temperature = 0.6): any {
    this.pending$$.next(true);
    this.openAIApi?.createChatCompletion({model, messages, temperature,})
      .then(this.processResponse.bind(this))
      .catch(this.handleError.bind(this))
      .finally(() => this.pending$$.next(false));
  }

  /**
   * Respond to the prompt, by adding the message to the conversation and asking for a completion on the conversation.
   * @param content - the content of the new message.
   * The user responses need to be in both the user and openAI prompts.
   * We only want to expose the userPrompt through conversation$$.
   */
  public respond(content: string): void {
    const message = new Message(content, ChatCompletionRequestMessageRoleEnum.User);
    this.openAIPrompt.push(message);
    this.userPrompt.push(message);
    this.conversation$$.next(this.userPrompt);
    this.generateCompletion(this.openAIPrompt);
  }

  /**
   * Add a system message. These messages are ignored by the OpenAI prompt.
   * @param message the string content of the message you wish to show the user.
   */
  public addSystemMessage(message: string) {
    this.userPrompt.push(new Message(message, ChatCompletionRequestMessageRoleEnum.System));
    this.conversation$$.next(this.userPrompt);
  }

  /**
   * Processes the response from the OpenAIApi and appends them in sorted order to the messages array.
   * @param response - the OpenAIApi response
   */
  private processResponse(response: any): any {
    response.data.choices
      .sort((a: any, b: any) => a.index < b.index)
      .forEach((choice: any) => {
        const message = new Message(choice.message.content, choice.message.role);
        this.openAIPrompt.push(message)
        this.userPrompt.push(message)
      });
    this.conversation$$.next(this.userPrompt);
    return null;
  }

  private handleError(error: any): any {
    this.queryForApiKey = error.response.status === HttpStatusCode.Unauthorized;
    this.addSystemMessage(parseError(error))
    return null;
  }

  get conversation$(): Observable<Message[]> {
    return this.conversation$$.asObservable();
  }

  get pending$(): Observable<boolean> {
    return this.pending$$.asObservable();
  }

}
