import {Platform, StyleSheet} from 'react-native';
import {useMemo} from 'react';
import {useResponsiveScreen, useTheme} from '../../../hooks';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import { SPACING } from '../../../styles';

export const useChangePasswordStyle = () => {
  const {hp, wp} = useResponsiveScreen();
  const inset = useSafeAreaInsets();
  const {colors} = useTheme();
  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        flex: 1,
      },
      subContainer: {
        flex: 1,
        paddingHorizontal: wp(SPACING?.s16),
      },
      label: {
        fontSize: 24,
        paddingTop: hp(SPACING?.s16),
      },
      subLabel: {
        fontSize: 14,
        color: colors.gray,
        marginTop: hp(SPACING?.s4),
        marginBottom: hp(SPACING?.s20),
      },
      input: {
        color: colors.glaciarGray,
        height: hp(SPACING?.s50),
        borderColor: colors.gray85,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: wp(1),
        fontSize: 12,
        fontWeight: '400',
      },
      textInput: {
        color: colors.gray,
        width: '85%',
      },
      button: {
        paddingVertical: hp(SPACING?.s16),
        paddingHorizontal: wp(SPACING?.s16),
        paddingBottom: inset.bottom + 6,
      },
    });
  }, [colors, hp, inset.bottom, wp]);

  return {styles, colors};
};
