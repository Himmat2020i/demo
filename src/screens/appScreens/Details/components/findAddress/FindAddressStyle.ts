import {useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {useResponsiveScreen, useTheme} from '../../../../../hooks';
import {SPACING} from '../../../../../styles';

export const useFindAddressStyle = () => {
  const {hp} = useResponsiveScreen();
  const {colors} = useTheme();
  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        flex: 1,
        marginBottom: hp(SPACING?.s10),
      },
      dropdownContainer: {
        height: 40,
      },
      textStyles: {
        fontSize: 20,
        color: colors.gray,
      },
      button: {
        width: '45%',
        height: 40,
        borderRadius: 6,
        marginBottom: hp(SPACING?.s20),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
      },
      buttonLabel: {
        fontSize: 18,
        color: colors.white,
      },
    });
  }, [colors, hp]);

  return {
    styles,
    colors,
  };
};
