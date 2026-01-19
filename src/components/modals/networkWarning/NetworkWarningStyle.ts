import {StyleSheet} from 'react-native';
import {useMemo} from 'react';
import {SCREEN_WIDTH, SPACING} from '../../../styles';
import {useResponsiveScreen, useTheme} from '../../../hooks';

export const NetworkWarningStyle = () => {
  const {hp, wp} = useResponsiveScreen();
  const {colors} = useTheme();
  const styles = useMemo(() => {
    return StyleSheet.create({
      modalView: {
        margin: 0,
        borderRadius: 10,
        padding: 20,
        width: SCREEN_WIDTH - 64,
        backgroundColor: colors.white,
      },
      headerBlock: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        width: '100%',
      },
      headerText: {
        fontSize: 20,
        textTransform: 'capitalize',
        fontWeight: 'bold',
        letterSpacing: 0.5,
      },
      bodyBlock: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: hp(SPACING?.s20),
      },
      bodyText: {
        fontSize: 18,
        textAlign: 'center',
        color: colors.gray,
        letterSpacing: 0.5,
      },
      footerBlock: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      button: {
        borderRadius: 42,
        height: 42,
        width: wp(200),
        alignItems: 'center',
        justifyContent: 'center',
      },
      buttonLabel: {
        color: colors.white,
        fontWeight: '500',
        letterSpacing: 0.5,
      },
    });
  }, [wp, hp, colors]);

  return styles;
};
