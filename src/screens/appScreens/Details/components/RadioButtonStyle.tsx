import {StyleSheet} from 'react-native';
import {useMemo} from 'react';
import {useResponsiveScreen, useTheme} from '../../../../hooks';

export const useRadioButtonStyle = () => {
  const {hp, wp} = useResponsiveScreen();
  const {colors} = useTheme();

  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        marginBottom: hp(10),
      },
      radioOff: {
        height: 8,
        width: 8,
        borderRadius: 100,
      },
      radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: hp(5),
      },
      radioIcon: {
        height: 18,
        width: 18,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        marginRight: wp(10),
      },
      radioLabel: {
        fontSize: 18,
        color: colors.black,
        alignSelf: 'flex-start',
      },
    });
  }, [hp, wp, colors]);

  return {
    styles,
    colors,
  };
};
