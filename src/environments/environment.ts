import { Configuration} from "openai";

export const environment = {
  production: false,
  apiConfiguration: new Configuration( { apiKey: 'your-api-key'} )
};
