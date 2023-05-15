import {Message} from "../domain/message.model";
import {World} from "../domain/world.model";
import {ChatCompletionRequestMessageRoleEnum} from "openai";

export type GameConfig = {
  title: string;
  description: string;
  initialPrompt: Message;
  roles: Map<ChatCompletionRequestMessageRoleEnum, string>;
};

export const GAME_CONFIG: GameConfig = {
  title: 'Text-based RPG',
  description: 'Go on an epic adventure in a profound text-based RPG...',
  initialPrompt: new Message(
  `Could you generate a text based RPG for the user about ${new World().toString()}? It should have combat, exploration, loot, consumables,
        may have one or more other fantasy elements that could suit a text based role playing game. Please immediately start the player off with a narrative path
        to follow along to, but keep it concise. All interactable objects should be within square brackets.`,
        ChatCompletionRequestMessageRoleEnum.System
  ),
  roles: new Map<ChatCompletionRequestMessageRoleEnum, string>([
    [ChatCompletionRequestMessageRoleEnum.User, 'Player'],
    [ChatCompletionRequestMessageRoleEnum.System, 'System'],
    [ChatCompletionRequestMessageRoleEnum.Assistant, 'Dungeon master'],
  ])
};
