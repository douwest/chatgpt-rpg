import {GameObject} from "./game-object.model";
import {error} from "@angular/compiler-cli/src/transformers/util";

export enum WordType {
  GAME_OBJECT,
  UTTERANCE
}
export enum WordColor {
  WHITE,
  GRAY,
  GREEN,
  BLUE,
  PURPLE,
  ORANGE,
  YELLOW
}

export class WordModel {
  public readonly type: WordType;
  public readonly processedContent: string;
  color?: WordColor;
  public readonly content: string;

  constructor(type: WordType, content: string) {
    this.type = type;
    this.content = content;
    this.processedContent = this.processContent(type, content);
  }

  private processContent(type: WordType, content: string): string {
    switch (type) {
      case WordType.UTTERANCE:
        this.color = WordColor.WHITE;
        return content + ' ';
      case WordType.GAME_OBJECT:
        return this.processGameObject(content);
    }
  }

  private processGameObject(content: string): string {
    try {
      const object = JSON.parse(content);
      const gameObject = new GameObject(object.type, object.rarity, object.name, object.description);
      this.color = gameObject.getWordColor();
      return `\n\n[${gameObject.name ? gameObject.name : 'Game Object'}]\n\t${gameObject.getDescription()}`;
    } catch (err) {
      console.warn(err);
      return content + ' ';
    }

  }
}
