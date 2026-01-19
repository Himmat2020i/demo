import {StyleSheet} from 'react-native';
import {useResponsiveScreen, useTheme} from '../../../../hooks';
import {useMemo} from 'react';

export const useTextInputComponentStyle = () => {
  const {colors} = useTheme();
  const {wp, hp} = useResponsiveScreen();

  const styles = useMemo(() => {
    return StyleSheet.create({
      textStyle: {
        flex: 1,
        fontSize: 18,
        color: colors.gray,
      },
      euro: {
        color: colors.black,
        fontSize: 18,
      },
      leftSideView: {
        height: hp(48),
        width: 50,
        backgroundColor: colors?.white,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        marginEnd: hp(2),
        justifyContent: 'center',
        alignItems: 'center',
      },
      inputStyle: {
        color: colors.glaciarGray,
        flex: 1,
        height: hp(50),
        borderColor: colors.gray85,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: wp(1),
        marginBottom: hp(10),
        fontSize: 18,
        textAlignVertical: 'top',
      },
      textArea: {
        height: hp(100),
        borderColor: colors.glaciarGray,
        borderWidth: 2,
        maxHeight: hp(120),
        borderRadius: 8,
        paddingHorizontal: wp(15),
        textAlignVertical: 'top',
        fontSize: 18,
        fontWeight: '400',
        marginBottom: hp(10),
      },
    });
  }, [colors, hp, wp]);

  return {
    styles,
    colors,
  };
};
