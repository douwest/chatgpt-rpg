export enum EntityType {
  NPC = 'npc',
  ENEMY = 'enemy',
  ITEM = 'item',
  WORLD_OBJECT = 'world_object',
  LOCATION = 'location'
}

export enum EntityRarity {
  COMMON = 'common',
  UNUSUAL = 'unusual',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

export class Entity {
  readonly type: EntityType;
  readonly name: string;
  readonly description: string;
  readonly rarity?: EntityRarity;

  constructor(type: EntityType, name: string, description: string, rarity?: EntityRarity) {
    this.type = type;
    this.name = name;
    this.description = description;
    this.rarity = rarity ?? undefined;
  }
}
