import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {OpenAIApi} from "openai";
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import { MessageComponent } from './message/message.component';

@NgModule({
  declarations: [
    AppComponent,
    MessageComponent,
    MessageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    OpenAIApi
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
