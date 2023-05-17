import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';
import {BehaviorSubject, filter, interval, last, map, Observable, Subject, take} from "rxjs";
import {StorytellerService} from "../storyteller/storyteller.service";

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements AfterViewInit {
  @Output() newWordEvent = new EventEmitter<boolean>()
  @Input('content') content: string = '';
  words$: Observable<string> | null = null;
  currentWords = '';
  ready$$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  ngAfterViewInit() {
    let words = this.content.split(' ');
    this.words$ = interval((120 + (+Math.random().toFixed(0) % 40))) // 100 - 140 = 100
      .pipe(take(words.length), map(i => {
        const newWord = words[i];
        this.currentWords = this.currentWords.concat(' ' + newWord);
        if(i == words.length - 1) {
          this.ready$$.next(true);
        }
        this.newWordEvent.next(true);
        return this.currentWords;
      }))
  }
}
