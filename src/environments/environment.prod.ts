import {TEXT_BASED_RPG_CONFIG_1} from "../app/config/game.config";
import {Configuration} from "openai";

export const environment = {
  production: true,
  apiConfiguration: new Configuration({apiKey: 'your-api-key'}),
  gameConfiguration: TEXT_BASED_RPG_CONFIG_1,
  debugMode: false
};
