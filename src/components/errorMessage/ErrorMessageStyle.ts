import {useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {useResponsiveScreen, useTheme} from '../../hooks';
import {SPACING} from '../../styles';

export const useErrorMessageStyle = () => {
  const {colors} = useTheme();
  const {hp} = useResponsiveScreen();
  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        marginVertical: hp(SPACING?.s5),
      },
      text: {
        fontSize: 14,
        color: colors.red,
        fontWeight: '700',
      },
    });
  }, [colors, hp]);

  return styles;
};
