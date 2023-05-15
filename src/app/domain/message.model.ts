import {ChatCompletionRequestMessageRoleEnum} from "openai";

export class Message {
  readonly content: string;
  readonly role: ChatCompletionRequestMessageRoleEnum;

  constructor(content: string, role: ChatCompletionRequestMessageRoleEnum) {
    this.content = content;
    this.role = role;
  }
}
