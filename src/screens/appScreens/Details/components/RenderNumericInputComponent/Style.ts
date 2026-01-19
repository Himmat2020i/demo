import {StyleSheet} from 'react-native';
import {useMemo} from 'react';
import {useResponsiveScreen, useTheme} from '../../../../../hooks';
import { SPACING } from '../../../../../styles';

export const useRangeNumericalStyle = () => {
  const {hp, wp} = useResponsiveScreen();
  const {colors} = useTheme();
  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
      inputContainer: {
        flex: 1,
        borderRadius: 5,
        height: hp(SPACING?.s50),
        borderColor: colors.storemGrey,
        borderWidth: 1,
      },
      inputText: {
        color: colors.gray,
        fontSize: 18,
        paddingHorizontal: hp(SPACING?.s16),
      },
      toText: {
        fontSize: 18,
        color: colors.storemGrey,
        marginHorizontal: wp(SPACING?.s16),
      },
    });
  }, [colors, hp, wp]);

  return {
    styles,
    colors,
  };
};
