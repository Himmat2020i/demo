import {StyleSheet} from 'react-native';
import {useMemo} from 'react';
import {useResponsiveScreen, useTheme} from '../../../hooks';
import {SPACING} from '../../../styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useSelectBusinessStyle = () => {
  const {colors} = useTheme();
  const {wp, hp} = useResponsiveScreen();
  const inset = useSafeAreaInsets();
  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        flex: 1,
      },
      subContainer: {
        paddingHorizontal: wp(SPACING?.s16),
      },
      label: {
        color: colors.primary,
        fontSize: 24,
      },
      subLabel: {
        color: colors.gray,
      },
      buttonView: {
        paddingVertical: hp(SPACING?.s20),
        paddingHorizontal: wp(SPACING?.s16),
        justifyContent: 'center',
      },
      footer: {
        borderRadius: 5,
        backgroundColor: colors.primary,
        width: '50%',
        alignSelf: 'center',
        marginBottom: hp(inset.bottom),
      },
    });
  }, [colors, wp, hp]);

  return {styles, colors};
};
