import {useMemo} from 'react';
import {SPACING} from '../../styles';
import {StyleSheet} from 'react-native';
import {useResponsiveScreen, useTheme} from '../../hooks';

export const useRenderHtmlStyle = () => {
  const {colors} = useTheme();
  const {hp, wp} = useResponsiveScreen();
  const styles = useMemo(() => {
    return StyleSheet.create({
      scroll: {
        paddingBottom: hp(SPACING?.s100),
        paddingVertical: hp(SPACING?.s16),
        paddingHorizontal: wp(SPACING?.s16),
      },
      label: {
        width: '100%',
        color: colors.red,
        alignSelf: 'center',
        paddingVertical: hp(SPACING?.s10),
      },
    });
  }, [colors, hp, wp]);

  return {
    styles,
    colors,
  };
};
