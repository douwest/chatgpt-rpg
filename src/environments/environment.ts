import { Configuration} from "openai";
import {TEXT_BASED_RPG_CONFIG_1} from "../app/config/game.config";

export const environment = {
  production: false,
  gameConfiguration: TEXT_BASED_RPG_CONFIG_1,
  debugMode: true
};
