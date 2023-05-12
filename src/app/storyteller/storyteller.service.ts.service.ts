import {Injectable} from '@angular/core';
import {ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi} from 'openai';
import {environment} from "../../environments/environment";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {World} from "../world/world.model";


@Injectable({
  providedIn: 'root'
})
export class StorytellerServiceTsService {

  private readonly configuration: Configuration = new Configuration({
    apiKey: environment.OPENAI_API_KEY,
  });
  private readonly openAIApi: OpenAIApi = new OpenAIApi(this.configuration)
  private readonly response$$: Subject<string[]> = new Subject<string[]>();
  private readonly pending$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor() {
    this.generate([`Could you generate a text based RPG about ${new World().toString()}? It should have combat, exploration, loot, consumables,
        may have one or more other fantasy elements that could suit a text based role playing game. Please immediately start the player off with a narrative path
        to follow along to (while ofcourse being able to make your own impact on the world).`]);
  }

  public generate(messages: string[]): any {
    this.pending$$.next(true);
    this.openAIApi.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages.flatMap(msg => {
        return {
          role: ChatCompletionRequestMessageRoleEnum.User,
          content: msg
        };
      }),
      temperature: 0.87,
    }).then(this.mapResponse)
      .then(response => this.response$$.next(response))
      .catch(console.error)
      .finally(() => this.pending$$.next(false));
  }

  get response$(): Observable<string[]> {
    return this.response$$.asObservable();
  }

  get pending$(): Observable<boolean> {
    return this.pending$$.asObservable();
  }
  private mapResponse(response: any): string[] {
    const result: string[] = [];
    response.data.choices
      .sort((a: any, b: any) => a.index < b.index)
      .forEach((choice: any) => result.push(choice.message.content));
    return result;
  }
}
