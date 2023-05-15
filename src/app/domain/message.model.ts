import {ChatCompletionRequestMessageRoleEnum} from "openai";

export type ConversationRole = ChatCompletionRequestMessageRoleEnum;

export class Message {
  readonly content: string;
  readonly role: ConversationRole;

  constructor(content: string, role: ConversationRole) {
    this.content = content;
    this.role = role;
  }
}
