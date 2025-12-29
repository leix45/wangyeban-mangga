
export enum TransitionType {
  SEAMLESS = 'Seamless Strip',
  FADE = 'Fade In/Out',
  SLIDE = 'Slide',
  WIPE = 'Wipe',
  DISSOLVE = 'Dissolve'
}

export enum FitMode {
  CONTAIN = 'contain',
  COVER = 'cover',
  WIDTH = 'width-fit',
  ORIGINAL = 'original'
}

export interface ImageFile {
  id: string;
  name: string;
  url: string;
  type: string;
  lastModified: number;
}

export interface ViewerSettings {
  transitionType: TransitionType;
  transitionSpeed: number; // in milliseconds
  fitMode: FitMode;
  autoScroll: boolean;
  autoScrollSpeed: number;
}
