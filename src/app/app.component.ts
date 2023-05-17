import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {StorytellerService} from "./storyteller/storyteller.service";
import {FormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {delay, map, Observable, of, tap, timer} from "rxjs";
import {Message} from "./domain/message.model";
import {ChatCompletionRequestMessageRoleEnum} from "openai";
import {environment} from "../environments/environment";
import { await$ } from './config/waiting-indicator.config';

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
    this.pending$ =  this.storytellerService.pending$;
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
    if (message?.valid && this.storytellerService.ready) { // TODO add lastTalker or something to check how to handle response (sys vs. assistant)
      this.storytellerService.respond(message.value);
      message.setValue('');
    } else if (message?.valid) {
      this.storytellerService.initOpenAIApi(message.value);
      message.setValue('')
    }
  }

  public getName(role: ChatCompletionRequestMessageRoleEnum): string | undefined {
    return environment.gameConfiguration.roles.get(role) ?? '<unknown>';
  }

  private focus(): void {
    this.instruction.nativeElement.focus();
  }

  private scrollToBottom(): void {
    this.chat.nativeElement.scrollTop = this.chat.nativeElement.scrollHeight;
  }
}
