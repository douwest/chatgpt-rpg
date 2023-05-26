import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';
import {BehaviorSubject, interval, map, Observable, take} from "rxjs";
import {WordColor, WordModel, WordType} from "../domain/word.model";

export const jsonRegex = new RegExp(/{(.*?)}/g);

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements AfterViewInit {
  @Output() newWordEvent = new EventEmitter<boolean>()
  @Input('content') content: string = '';
  words$: Observable<WordModel[]> | null = null;
  currentWords: WordModel[] = [];
  ready$$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private readonly interval = {
    min: 25,
    max: 40
  }

  ngAfterViewInit() {
    const objects: WordModel[] = Array.from(this.content.matchAll(jsonRegex))
       .map(obj => new WordModel(WordType.GAME_OBJECT, obj[0]));
     objects.forEach(object => {
       this.content = this.content.replace(object.content, '');
     })
     let words: WordModel[] = this.content.split(' ')
       .map(str => new WordModel(WordType.UTTERANCE, str));
     words = words.concat(objects);
    const typingInterval = this.interval.min + (+Math.random().toFixed(0) % this.interval.max); // 100 - 140 = 100
    this.words$ = interval(typingInterval)
      .pipe(take(words.length), map(i => {
        const newWord = words[i];
        this.currentWords.push(newWord);
        if(i == words.length - 1) {
          this.ready$$.next(true);
        }
        this.newWordEvent.next(true);
        return this.currentWords;
      }))
  }

  protected readonly WordColor = WordColor;
}
