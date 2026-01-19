import {StyleSheet} from 'react-native';
import {useMemo} from 'react';
import {useResponsiveScreen, useTheme} from '../../hooks';
import {SPACING} from '../../styles';

export const useWelComeLabelStyle = () => {
  const {colors} = useTheme();
  const {wp, hp} = useResponsiveScreen();
  const styles = useMemo(() => {
    return StyleSheet.create({
      iconContainer: {
        marginTop: hp(SPACING?.s16),
        paddingHorizontal: wp(SPACING?.s16),
      },
      icon: {
        alignSelf: 'flex-start',
        marginBottom: hp(SPACING?.s10),
      },
      subContainer: {
        flex: 1,
        paddingHorizontal: wp(SPACING?.s16),
      },
      welcomeContainer: {
        alignItems: 'flex-start',
        marginVertical: hp(SPACING?.s10),
      },
      label: {
        color: colors.white,
        fontSize: 24,
      },
      subLabel: {
        color: colors.white,
      },
      buttonContainer: {
        marginVertical: hp(SPACING?.s25),
        paddingHorizontal: wp(SPACING?.s15),
      },
    });
  }, [colors, wp, hp]);

  return {styles, colors};
};
