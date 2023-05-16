import { Configuration} from "openai";
import {TEXT_BASED_RPG_CONFIG_1} from "../app/config/game.config";

export const environment = {
  production: false,
  apiConfiguration: new Configuration( { apiKey: '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'} ),
  gameConfiguration: TEXT_BASED_RPG_CONFIG_1,
  debugMode: true
};
