import {Injectable} from '@angular/core';
import {ChatCompletionRequestMessageRoleEnum, OpenAIApi} from 'openai';
import {environment} from "../../environments/environment";
import {BehaviorSubject, debounce, delay, interval, Observable, of, Subject, tap} from "rxjs";
import {Message} from "../domain/message.model";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class StorytellerService {

  private readonly openAIApi: OpenAIApi = new OpenAIApi(environment.apiConfiguration)
  private openAIPrompt: Message[] = [];
  private userPrompt: Message[] = [new Message(
      `A new game has started.\n\n\ ${environment.gameConfiguration.title}: ${environment.gameConfiguration.description}`,
      ChatCompletionRequestMessageRoleEnum.System
  )];

  private readonly conversation$$: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>(this.userPrompt);
  private readonly pending$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
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
    this.openAIApi.createChatCompletion({model, messages, temperature,})
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
    this.userPrompt.push(new Message(
        `HTTP Error: ${error.message}.
        \n\nYou could try and continue the story by re-entering your command after some time has passed.`,
        ChatCompletionRequestMessageRoleEnum.System
    ));
    this.conversation$$.next(this.userPrompt);
    return null;
  }

  get conversation$(): Observable<Message[]> {
    return this.conversation$$.asObservable();
  }
  get pending$(): Observable<boolean> {
    return this.pending$$.asObservable();
  }
}
