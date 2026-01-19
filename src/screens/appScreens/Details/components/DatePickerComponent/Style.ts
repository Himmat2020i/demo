import {StyleSheet} from 'react-native';
import {useMemo} from 'react';
import {useResponsiveScreen, useTheme} from '../../../../../hooks';
import { SPACING } from '../../../../../styles';

export const useDatePickerStyle = () => {
  const {hp} = useResponsiveScreen();
  const {colors} = useTheme();
  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        height: 80,
        justifyContent: 'center',
      },
      input: {
        borderColor: colors.glaciarGray,
        justifyContent: 'center',
        height: hp(SPACING?.s50),
        marginVertical: hp(SPACING?.s10),
      },
      inputText: {
        color: colors.gray,
        fontSize: 18,
      },
      errorText: {
        fontSize: 12,
        color: colors.red,
      },
      labelStyle: {
        color: colors.gray,
      },
    });
  }, [hp, colors]);

  return {
    styles,
    colors,
  };
};
