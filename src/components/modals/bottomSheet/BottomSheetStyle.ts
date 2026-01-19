import {useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {useKeyboard} from '../../../hooks/useKeyboard';
import {useResponsiveScreen, useTheme} from '../../../hooks';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SCREEN_HEIGHT, SCREEN_WIDTH, SPACING} from '../../../styles';

export const useBottomSheetStyle = () => {
  const {keyboardHeight} = useKeyboard();
  const {wp, hp} = useResponsiveScreen();
  const {colors} = useTheme();
  const inset = useSafeAreaInsets();
  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        height: SCREEN_HEIGHT / 2,
        width: SCREEN_WIDTH,
        borderTopRightRadius: 26,
        borderTopLeftRadius: 26,
        marginBottom: keyboardHeight,
        backgroundColor: colors.white,
        paddingVertical: hp(SPACING?.s16),
        paddingHorizontal: wp(SPACING?.s28),
      },
      inputContainer: {
        marginVertical: hp(SPACING?.s20),
      },
      input: {
        height: hp(SPACING?.s50),
        borderColor: colors.primary,
      },
      inputText: {
        color: colors.black,
      },
      flatList: {
        paddingBottom: wp(SPACING?.s40),
      },
      button: {
        justifyContent: 'flex-start',
      },
      label: {
        fontWeight: '600',
      },
      footer: {
        paddingVertical: hp(SPACING?.s10),
        paddingBottom: hp(inset.bottom),
      },
    });
  }, [colors, hp, inset, keyboardHeight, wp]);

  return {styles, colors};
};
