import {StyleSheet} from 'react-native';
import {useMemo} from 'react';
import {useResponsiveScreen, useTheme} from '../../../../hooks';
import {DEFAULT_COLORS} from '../../../../styles';

export const useDropDownStyle = () => {
  const {hp, wp} = useResponsiveScreen();
  const {colors} = useTheme();

  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        marginVertical: hp(10),
      },
      modalOverlay: {
        flex: 1,
        backgroundColor: DEFAULT_COLORS.blackOpacity,
      },
      modalContent: {
        top: '50%',
        left: '50%',
        padding: 20,
        elevation: 5,
        borderRadius: 8,
        position: 'absolute',
        backgroundColor: colors?.white,
      },
      modalOption: {
        paddingVertical: hp(10),
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
      },
      dropDown: {
        height: 50,
        borderColor: colors?.gray,
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: wp(8),
      },
      label: {
        fontSize: 16,
        marginBottom: hp(5),
      },
      place: {
        fontSize: 16,
      },
      selectedText: {
        fontSize: 16,
      },
    });
  }, [hp, colors, wp]);

  return {
    hp,
    styles,
    colors,
  };
};
