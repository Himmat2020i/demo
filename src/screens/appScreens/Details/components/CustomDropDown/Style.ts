import {StyleSheet} from 'react-native';
import {useMemo} from 'react';
import {useResponsiveScreen, useTheme} from '../../../../../hooks';
import { SPACING } from '../../../../../styles';

export const useCustomDocumentStyle = () => {
  const {colors} = useTheme();
  const {hp} = useResponsiveScreen();
  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        flex: 1,
      },
      titleStyle: {
        color: colors.black,
        fontSize: 18,
      },
      authDropdown: {
        height: hp(SPACING?.s48),
        marginTop: hp(SPACING?.none),
        marginBottom: hp(SPACING?.s16),
      },
    });
  }, [colors, hp]);

  return {
    styles,
    colors,
  };
};
