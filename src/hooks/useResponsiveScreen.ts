import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

export const useResponsiveScreen = () => {

  const DEFAULT_WIDTH = 414;
  const DEFAULT_HEIGHT = 896;

  const wp = (width: number): number => {
    const percent = (width * 100) / DEFAULT_WIDTH;

    return widthPercentageToDP(percent);
  };
  const hp = (width: number): number => {
    const percent = (width * 100) / DEFAULT_HEIGHT;

    return heightPercentageToDP(percent);
  };

  return {
    wp,
    hp,
  };
};
