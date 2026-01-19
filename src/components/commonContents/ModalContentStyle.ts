import {useMemo} from 'react';
import {SPACING} from '../../styles';
import {StyleSheet} from 'react-native';
import {useResponsiveScreen, useTheme} from '../../hooks';

export const useModalContentStyle = () => {
  const {colors} = useTheme();
  const {hp} = useResponsiveScreen();
  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        padding: SPACING.s20,
        width: '100%',
      },
      button: {
        borderRadius: 5,
        alignItems: 'center',
        padding: SPACING?.s10,
        backgroundColor: colors?.green,
        marginVertical: hp(SPACING?.s10),
      },
      buttonText: {
        fontSize: 18,
        color: colors.white,
      },
      cancelButton: {
        borderRadius: 5,
        alignItems: 'center',
        padding: SPACING?.s10,
        marginVertical: hp(SPACING?.s10),
        backgroundColor: colors?.lightRed,
      },
      cancelButtonText: {
        fontSize: 18,
        color: colors.white,
      },
      selectOption: {
        fontSize: 22,
        fontWeight: 'bold',
        alignSelf: 'center',
        color: colors.darkBlue,
      },
    });
  }, [colors, hp]);

  return {
    styles,
    colors,
  };
};
