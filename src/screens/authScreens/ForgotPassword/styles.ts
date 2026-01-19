import {StyleSheet} from 'react-native';
import {useMemo} from 'react';
import {useResponsiveScreen, useTheme} from '../../../hooks';
import {FONTS, SHADOW, SPACING} from '../../../styles';

export const useForgotPasswordStyle = () => {
  const {hp, wp} = useResponsiveScreen();
  const {colors} = useTheme();
  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        height: '100%',
      },
      mainContainer: {
        flex: 1,
      },
      subContainer: {
        flex: 1,
        paddingHorizontal: wp(SPACING.s16),
        marginTop: hp(SPACING?.s30),
      },
      iconContainer: {
        marginBottom: hp(SPACING?.s20),
      },
      logo: {
        alignSelf: 'center',
      },
      forgotPass: {
        marginVertical: hp(SPACING?.s25),
      },
      inputText: {
        fontFamily: FONTS.regular,
      },
      forgotPasslabel: {
        color: colors.white,
        fontSize: 20,
        textAlign: 'center',
        marginBottom: hp(SPACING?.s5),
      },
      forgotPassSublabel: {
        color: colors.white,
        textAlign: 'center',
      },
      button: {
        backgroundColor: colors.primary,
        marginTop: hp(SPACING?.s22),
        width: '65%',
        borderRadius: 50,
        alignSelf: 'center',
        ...SHADOW.shadow5,
      },
    });
  }, [colors, hp, wp]);

  return {styles, colors};
};
