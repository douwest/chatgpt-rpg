export enum Atmosphere {
  COLD = 'cold',
  EERIE = 'eerie',
  BEAUTIFUL = 'beautiful',
  HAUNTED = 'haunted',
  HOT_AND_DRY = 'hot_and_dry',
  IDYLLIC = 'idyllic',
  SPIRITUAL = 'spiritual',
  SPACY = 'spacy',
  FUTURISTIC = 'futuristic',
  GLOOMY = 'gloomy',
  BLOODY = 'bloody',
  DESERTLIKE = 'desertlike',
  FUNNY = 'funny'
}

export enum Theme {
  PIRATE = 'pirate',
  MEDIEVAL = 'medieval',
  GI_JOE = 'GI-JOE'
}

export enum ThemeDecorator {
  FANTASY = 'fantasy',
  SERIOUS = 'serious',
  RAVAGING = 'ravaging',
  SWASHBUCKLING = 'swashbuckling',
  AWESOME = 'awesome',
  GUNS_BLAZING = 'guns blazing'
}

export const Atmospheres = [
  Atmosphere.COLD,
  Atmosphere.EERIE,
  Atmosphere.BEAUTIFUL,
  Atmosphere.HAUNTED,
  Atmosphere.HOT_AND_DRY,
  Atmosphere.IDYLLIC,
  Atmosphere.SPIRITUAL,
  Atmosphere.SPACY,
  Atmosphere.FUTURISTIC,
  Atmosphere.GLOOMY,
  Atmosphere.BLOODY,
  Atmosphere.DESERTLIKE,
  Atmosphere.FUNNY
];
export const Themes = [
  Theme.PIRATE,
  Theme.MEDIEVAL,
  Theme.GI_JOE
];
export const Decorators = [
  ThemeDecorator.FANTASY,
  ThemeDecorator.SERIOUS,
  ThemeDecorator.RAVAGING,
  ThemeDecorator.SWASHBUCKLING,
  ThemeDecorator.AWESOME,
  ThemeDecorator.GUNS_BLAZING
];

export class World {
  atmosphere: Atmosphere;
  theme: Theme;
  themeDecorator: ThemeDecorator;

  constructor() {
    this.atmosphere = Atmospheres[+Math.random().toFixed(0) % Atmospheres.length];
    this.theme = Themes[+Math.random().toFixed(0) % Themes.length];
    this.themeDecorator = Decorators[+Math.random().toFixed(0) % Decorators.length];
  }

  public toString(): string {
    return `a ${this.atmosphere} world about ${this.theme} with a ${this.themeDecorator} vibe`
  }
}
