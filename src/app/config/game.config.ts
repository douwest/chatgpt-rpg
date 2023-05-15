import {Message} from "../domain/message.model";
import {World} from "../domain/world.model";
import {ChatCompletionRequestMessageRoleEnum} from "openai";

export type GameConfig = {
  title: string;
  description: string;
  initialPrompt: Message;
};

export const TEXT_BASED_RPG: GameConfig = {
  title: 'Text-based RPG',
  description: 'Go on an epic adventure in a profound text-based RPG...',
  initialPrompt: new Message(
  `Could you generate a text based RPG about ${new World().toString()}? It should have combat, exploration, loot, consumables,
        may have one or more other fantasy elements that could suit a text based role playing game. Please immediately start the player off with a narrative path
        to follow along to (while of course being able to make your own impact on the world).`,
        ChatCompletionRequestMessageRoleEnum.System
  )
};
