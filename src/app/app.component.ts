import {Component} from '@angular/core';
import {StorytellerService} from "./storyteller/storyteller.service";
import {FormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {Observable, tap} from "rxjs";
import {Message} from "./domain/message.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public readonly user: string = 'user@user22';
  public readonly location: string = 'location';

  public readonly response$: Observable<Message[]> = this.storytellerService.response$;
  public readonly pending$: Observable<boolean> = this.storytellerService.pending$;

  public readonly form: UntypedFormGroup = new UntypedFormGroup({
    message: new FormControl<string | null>('', [Validators.required])
  })

  constructor(private storytellerService: StorytellerService) {
    this.pending$.pipe(
      tap(pending => {
        if (pending) {
          this.form.get('message')?.disable()
        } else {
          this.form.get('message')?.enable()
        }
      })
    ).subscribe();
  }

  onSubmit() {
    const message = this.form.get('message');
    if (message?.valid) {
      this.storytellerService.respond(message.value);
      message.setValue('');
    }
  }
}
