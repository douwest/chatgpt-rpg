import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {StorytellerService} from "./storyteller/storyteller.service";
import {FormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {delay, Observable, tap} from "rxjs";
import {Message} from "./domain/message.model";
import {ChatCompletionRequestMessageRoleEnum} from "openai";
import {environment} from "../environments/environment";
import {await$} from './config/waiting-indicator.config';
import {genericErrorMessages} from "./config/error.messages.config";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('instruction') instruction!: ElementRef;
  @ViewChild('chat') chat!: ElementRef;

  protected readonly await$ = await$;

  public readonly user: string = 'unknown@0';
  public readonly location: string = 'location';

  public readonly conversation$: Observable<Message[]>;
  public readonly pending$: Observable<boolean>;

  public readonly form: UntypedFormGroup = new UntypedFormGroup({
    message: new FormControl<string | null>('', [Validators.required])
  })
  public readonly Role = ChatCompletionRequestMessageRoleEnum;

  constructor(private storytellerService: StorytellerService) {
    this.conversation$ = this.storytellerService.conversation$;
    this.pending$ = this.storytellerService.pending$;
    this.conversation$.pipe(
      delay(50), // so that it can be rendered first before manipulating DOM-elements.
      tap(this.focus.bind(this)),
      tap(this.scrollToBottom.bind(this))
    ).subscribe();
  }

  ngAfterViewInit(): void {
    this.focus();
  }

  public onSubmit() {

    const message = this.form.get('message');
    const pending = this.storytellerService.pending$$.getValue();
    if (message?.valid && this.storytellerService.queryForApiKey && !pending) {   // Queried for api key.
      this.storytellerService.initOpenAIApi(message.value);
    } else if (message?.valid && !pending) {   // Query the OpenAI API.
      this.storytellerService.respond(message.value);
    } else if (pending) {
      this.storytellerService.addSystemMessage(genericErrorMessages.pending)
    }
    message?.setValue('');
  }

  public getName(role: ChatCompletionRequestMessageRoleEnum): string | undefined {
    return environment.gameConfiguration.roles.get(role) ?? '<unknown>';
  }

  private focus(): void {
    this.instruction.nativeElement.focus();
  }

  scrollToBottom(): void {
    this.chat.nativeElement.scrollTop = this.chat.nativeElement.scrollHeight;
  }
}
