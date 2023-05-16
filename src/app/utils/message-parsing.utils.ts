import {Message} from "../domain/message.model";
import {ChatCompletionRequestMessageRoleEnum} from "openai";
import {Entity, EntityRarity} from "../domain/entity.model";

class ParsedMessage {
  role: ChatCompletionRequestMessageRoleEnum;
  messageParts: MessagePart[]

  constructor(role: ChatCompletionRequestMessageRoleEnum, messageParts: MessagePart[]) {
    this.role = role;
    this.messageParts = messageParts;
  }
}

class MessagePart {
  content: string;
  description: string | null = null;
  color: Color | null = null;

  constructor(content: string, description: string | null, color: Color | null) {
    this.content = content;
    this.description = description;
    this.color = color;
  }
}

enum Color {
  WHITE,
  GREEN,
  BLUE,
  PURPLE,
  ORANGE
}

export class MessageParsingUtils {

  /**
   * TODO handle entity type.
   * @param message
   * @constructor
   */
  public static parseMessage(message: Message): void {
    const messageParts: MessagePart[] = [];
    const regex = new RegExp('{[^}]*}|\S+');
    // split by whitespace and \n
    const parts = regex.exec(message.content);
    console.warn(parts);
    parts?.forEach(part => {
      console.warn(JSON.parse(part));
    });
    // parts.forEach(part => {
    //   let messagePart;
    //   // find entities
    //   if (part.startsWith('{')) {
    //     const entity: Entity = JSON.parse(part) as Entity;
    //     messagePart = new MessagePart(entity.name, entity.description, this.getColorByRarity(entity.rarity))
    //   }
    //   else {
    //     messagePart = new MessagePart(part, null, null);
    //   }
    //   messageParts.push(messagePart);
    // })
    // return new ParsedMessage(message.role, messageParts);
  }

  public static getColorByRarity(rarity: EntityRarity | undefined): Color {
    if (!rarity) {
      return Color.WHITE;
    }
    switch(rarity) {
      case EntityRarity.UNUSUAL:
        return Color.GREEN;
      case EntityRarity.RARE:
        return Color.BLUE;
      case EntityRarity.EPIC:
        return Color.PURPLE;
      case EntityRarity.LEGENDARY:
        return Color.ORANGE
      case EntityRarity.COMMON:
        return Color.WHITE;
    }
  }
}
