export type ThemeColors = {
  primary: string,
  red: string,
  gray: string,
  white: string,
  green: string,
  black: string,
  gray85: string,
  appBlue: string,
  lighBlue: string,
  darkBlue: string,
  pureBlue: string,
  lightRed: string,
  lightGray: string,
  whiteSmoke: string,
  storemGrey: string,
  statusBlue: string,
  toastError: string,
  lightOrange: string,
  glaciarGray: string,
  transparent: string,
  toastSuccess: string,
  lightGrayishGreen: string,
};

export type Theme = {
  mode: string,
  colors: ThemeColors,
};

export interface ThemeInterface {
  [index: string]: Theme;
}
