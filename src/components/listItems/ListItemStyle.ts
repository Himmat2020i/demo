import {useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {useResponsiveScreen, useTheme} from '../../hooks';
import {SPACING} from '../../styles';

interface props {
  size?: number;
  isSelect?: boolean;
  type?: 'radio' | 'check' | undefined;
}

export const useListItemStyle = ({size, isSelect, type}: props) => {
  const {colors} = useTheme();
  const {hp, wp} = useResponsiveScreen();
  const styles = useMemo(() => {
    return StyleSheet.create({
      list: {
        width: '100%',
        height: hp(48),
        borderRadius: 5,
        flexDirection: 'row',
        marginTop: hp(SPACING?.s8),
        justifyContent: 'space-between',
        borderBottomColor: colors.lightGray,
        borderBottomWidth: type === 'radio' ? 1 : 0,
      },
      itemContainer: {
        flexShrink: 1,
        flexDirection: 'row',
        alignItems: 'center',
      },
      itemIconContainer: {
        height: size || 24,
        width: size || 24,
        borderWidth: 2,
        borderColor: colors.gray,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        padding: (size || 24) / 8,
      },
      iconSubContainer: {
        width: '100%',
        height: '100%',
        borderRadius: 100,
        backgroundColor: colors.gray,
      },
      iconContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: wp(SPACING?.s10),
      },
      row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
      },
      itemText: {
        width: '95%',
        fontSize: 18,
        fontWeight: '500',
        color: colors.gray,
        paddingRight: wp(SPACING?.s20),
        paddingHorizontal: wp(SPACING?.s10),
      },
      titleContainer: {
        width: '100%',
      },
      checkContainer: {
        borderWidth: 2,
        borderRadius: 2,
        width: size || 16,
        height: size || 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: colors.primary,
        backgroundColor: isSelect ? colors.primary : colors.white,
      },
      required: {
        color: colors.toastError,
      }
    });
  }, [colors, hp, isSelect, size, type, wp]);

  return {styles, colors};
};
