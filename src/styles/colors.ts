import {ThemeInterface} from '../interfaces/colors';

const LIGHT_COLORS = {
  primary: '#005EB8',
  toastError: 'rgba(246, 119, 91, 0.9)',
  toastSuccess: 'rgba(27, 227, 119, 0.9)',
  darkBlue: '#3498db',
  whiteSmoke: '#f5f5f5',
  lightGray: '#aaa',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#5c5b5b',
  green: '#2EB85C',
  lightOrange: '#F6775B',
  lightBlue: '#ADD8E6',
  storemGrey: '#818182',
  red: '#DC3545',
  glaciarGray: '#C5C6C7',
  gray85: '#D9D9D9',
  appBlue: '#005EB8',
  statusBlue: '#23c6c8',
  transparent: 'rgba(0,0,0,0)',
  pureBlue: '#007bff',
  lightGrayishGreen: '#dff0d8',
  lightRed: '#ff5252',
};

const DARK_COLORS = {
  primary: '#005EB8',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#5c5b5b',
  lightOrange: '#F6775B',
  toastError: 'rgba(246, 119, 91, 0.9)',
  toastSuccess: 'rgba(27, 227, 119, 0.9)',
  darkBlue: '#3498db',
  lightGray: '#aaa',
  green: '#2EB85C',
  whiteSmoke: '#f5f5f5',
  lightBlue: '#ADD8E6',
  storemGrey: '#818182',
  red: '#DC3545',
  glaciarGray: '#C5C6C7',
  gray85: '#D9D9D9',
  appBlue: '#005EB8',
  statusBlue: '#23c6c8',
  transparent: 'rgba(0,0,0,0)',
  pureBlue: '#007bff',
  lightGrayishGreen: '#dff0d8',
  lightRed: '#ff5252',
};

export const THEMES: ThemeInterface = {
  light: {
    mode: 'light',
    colors: LIGHT_COLORS,
  },
  dark: {
    mode: 'dark',
    colors: DARK_COLORS,
  },
};

export const DEFAULT_COLORS = {
  blue: '#3683BC',
  white: '#FFFFFF',
  blackOpacity: 'rgba(0, 0, 0, 0.5)',
  yellow: '#f8ac59',
  green: '#3CB371',
};
