import {useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {FONTS, SCREEN_WIDTH} from '../../../styles';
import {useResponsiveScreen, useTheme} from '../../../hooks';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const useDetailsStyle = () => {
  const {hp, wp} = useResponsiveScreen();
  const {colors} = useTheme();
  const inset = useSafeAreaInsets();
  const styles = useMemo(() => {
    return StyleSheet.create({
      tabHeight: {height: hp(55)},
      buttonView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: hp(16),
        paddingHorizontal: wp(16),
        paddingBottom: hp(inset.bottom) + 16,
        backgroundColor: colors?.transparent,
      },
      container: {
        flex: 1,
        backgroundColor: colors.white,
      },
      subContainer: {
        flex: 1,
      },
      separator: {
        backgroundColor: colors.appBlue,
        width: '100%',
        height: 1,
        marginVertical: hp(10),
      },
      contentContainer: {
        paddingBottom: hp(120),
      },
      labelStyle: {
        fontSize: 18,
        color: colors.white,
        fontFamily: FONTS.bold,
      },
      loginButton: {
        width: '45%',
        height: hp(50),
        borderRadius: 5,
        backgroundColor: colors.appBlue,
        justifyContent: 'center',
        alignItems: 'center',
      },
      tabContainer: {
         backgroundColor: colors.white,
      },
      info: {
        height: hp(25),
        width: wp(25),
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.red,
      },
      title: {
        flexShrink: 1,
        maxWidth: SCREEN_WIDTH / 1.5,
        fontSize: 18,
        color: colors.white,
        alignSelf: 'center',
      },
      emptyText: {fontSize: 20, color: colors.black},
      emptyCont: {
        backgroundColor: colors.transparent,
        marginTop: hp(220),
      },
    });
  }, [colors, hp, inset.bottom, wp]);

  return {
    styles,
    colors,
  };
};
