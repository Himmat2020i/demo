import {StyleSheet} from 'react-native';
import {useMemo} from 'react';
import {SCREEN_WIDTH, SPACING} from '../../../styles';
import {useResponsiveScreen, useTheme} from '../../../hooks';

export const useConfirmationStyle = () => {
  const {wp, hp} = useResponsiveScreen();
  const {colors} = useTheme();
  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        backgroundColor: colors.white,
        alignItems: 'center',
        borderRadius: 26,
        width: SCREEN_WIDTH - wp(SPACING?.s44),
        paddingVertical: hp(SPACING?.s28),
        paddingHorizontal: wp(SPACING?.s22),
      },
      title: {
        fontSize: 24,
        textAlign: 'center',
      },
      subTitle: {
        fontWeight: '400',
        color: colors.gray,
        fontSize: 18,
        marginTop: hp(SPACING?.s8),
      },
      footer: {
        marginTop: hp(SPACING?.s28),
      },
    });
  }, [colors, wp, hp]);

  return {styles};
};
