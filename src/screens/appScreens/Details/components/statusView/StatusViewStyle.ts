import {StyleSheet} from 'react-native';
import {useTheme} from '../../../../../hooks';

export const useStatusViewStyle = () => {
  const {colors} = useTheme();

  return StyleSheet.create({
    overlay: {
      zIndex: 999,
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.transparent,
    },
  });
};
