import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {StorytellerService} from "./storyteller/storyteller.service";
import {FormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {delay, Observable, tap} from "rxjs";
import {Message} from "./domain/message.model";
import {ChatCompletionRequestMessageRoleEnum} from "openai";
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('instruction') instruction!: ElementRef;
  @ViewChild('chat') chat!: ElementRef;

  public readonly user: string = 'unknown@0';
  public readonly location: string = 'location';

  public readonly conversation$: Observable<Message[]> = this.storytellerService.conversation$;
  public readonly pending$: Observable<boolean> = this.storytellerService.pending$;

  public readonly form: UntypedFormGroup = new UntypedFormGroup({
    message: new FormControl<string | null>('', [Validators.required])
  })
  public readonly Role = ChatCompletionRequestMessageRoleEnum;
  protected readonly environment = environment;

  constructor(private storytellerService: StorytellerService) {
    this.conversation$.pipe(
      delay(50), // so that it can be rendered first before manipulating DOM elements.
      tap(this.focus.bind(this)),
      tap(this.scrollToBottom.bind(this))
    ).subscribe();
  }

  ngAfterViewInit(): void {
    this.focus();
  }

  public onSubmit() {
    const message = this.form.get('message');
    if (message?.valid) { // TODO add lastTalker or something to check how to handle response (sys vs. assistant)
      this.storytellerService.respond(message.value);
      message.setValue('');
    }
  }

  public getName(role: ChatCompletionRequestMessageRoleEnum): string | undefined {
    if (!environment.gameConfiguration.roles.has(role)) {
      throw new Error(`Could not find name for role ${role}!`)
    }
    return environment.gameConfiguration.roles.get(role);
  }

  private focus(): void {
    this.instruction?.nativeElement?.focus();
  }

  private scrollToBottom(): void {
    this.chat.nativeElement.scrollTop = this.chat.nativeElement.scrollHeight;
  }
}
