import {WordColor} from "./word.model";

export type Rarity = 'common' | 'uncommon' | 'unusual' | 'rare' | 'epic' | 'legendary' | undefined;

export class GameObject {
  type: string;
  rarity: Rarity;
  name: string | undefined;
  description: string | undefined;

  constructor(type: string, rarity: Rarity, name: string | undefined, description: string | undefined) {
    this.type = type;
    this.rarity = rarity;
    this.name = name;
    this.description = description;
  }

  getDescription(): string {
    return this.description ? `- ${this.description}` : '';
  }

  getWordColor(): WordColor {
    if (!this.rarity) { return WordColor.WHITE }
    switch (this.rarity) {
      case 'common':
        return WordColor.GRAY;
      case 'unusual':
      case 'uncommon':
        return WordColor.GREEN;
      case 'rare':
        return WordColor.BLUE;
      case 'epic':
        return WordColor.PURPLE;
      case 'legendary':
        return WordColor.YELLOW;
      default:
        return WordColor.WHITE;
    }
  }
}
