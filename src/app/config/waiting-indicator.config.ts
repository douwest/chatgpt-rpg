import {delay, interval, map, Observable, timer} from "rxjs";

const dottedLines: string[] = ['[\xa0\xa0\xa0]', '[.\xa0\xa0]', '[..\xa0]', '[...]', '[..\xa0]', '[.\xa0\xa0]'];
let count: number = 0;

export const await$: Observable<string> = interval(300).pipe(delay(500), map(() => {
  count += 1;
  return dottedLines[count % dottedLines.length];
}));
