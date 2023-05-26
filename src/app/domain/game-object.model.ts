import {WordColor} from "./word.model";

export type Rarity = 'common' | 'uncommon' | 'unusual' | 'rare' | 'epic' | 'legendary' | undefined;
export type GameObjectType = 'enemy' | 'npc' | 'item' | 'world_object' | 'location' | undefined;
export class GameObject {
  type: GameObjectType;
  rarity: Rarity;
  name: string | undefined;
  description: string | undefined;

  constructor(type: GameObjectType, rarity: Rarity, name: string | undefined, description: string | undefined) {
    this.type = type;
    this.rarity = rarity;
    this.name = name;
    this.description = description;
  }

  getDescription(): string {
    return this.description ? `- ${this.description}` : '';
  }

  getWordColor(): WordColor {
    switch (this.type) {
      case 'npc':
        return WordColor.LIME;
      case 'enemy':
        return WordColor.RED;
      case 'location':
        return WordColor.GRAY;
      case 'item':
      case 'world_object':
        return this.getColorByRarity();
      default:
        return WordColor.WHITE;
    }
  }

  getColorByRarity() {
    if (!this.rarity) { return WordColor.WHITE }
    switch (this.rarity) {
      case 'common':
        return WordColor.WHITE;
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
