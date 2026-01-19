import {StyleSheet} from 'react-native';
import {useMemo} from 'react';
import {useResponsiveScreen, useTheme} from '../../../../hooks';

export const useTextComponentStyle = () => {
  const {colors} = useTheme();
  const {hp, wp} = useResponsiveScreen();
  const styles = useMemo(() => {
    return StyleSheet.create({
      qCode: {
        fontSize: 18,
        color: colors.black,
        fontWeight: 'bold',
      },
      topRowView: {
        flexDirection: 'row',
        width: wp(370),
        marginBottom: hp(10),
        flexWrap: 'wrap',
      },
      star: {
        color: colors.red,
        fontWeight: 'bold',
        fontSize: 20,
      },
      qLabel: {
        fontSize: 18,
        color: colors.black,
        fontWeight: 'bold',
      },
      qText: {
        fontSize: 18,
        color: colors.black,
        fontWeight: 'bold',
      },
      text: {
        fontSize: 18,
        color: colors.black,
      },
      controlContainer: {
        flex: 1,
      },
      qLabelText: {
        marginBottom: hp(10),
      },
    });
  }, [colors, hp, wp]);

  return {
    styles,
    colors,
  };
};
