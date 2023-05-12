import {Component} from '@angular/core';
import {StorytellerServiceTsService} from "./storyteller/storyteller.service.ts.service";
import {FormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {Observable, tap} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'angular-rpg';

  readonly user: string = 'user@user22';
  readonly location: string = 'location'
  public readonly response$ = this.storytellerService.response$;
  public readonly pending$: Observable<boolean> = this.storytellerService.pending$;
  public readonly form = new UntypedFormGroup({
    message: new FormControl<string | null>('', [Validators.required])
  })

  constructor(private storytellerService: StorytellerServiceTsService) {
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
      this.storytellerService.generate([message.value!]);
      message.setValue('');
    }
  }
}
