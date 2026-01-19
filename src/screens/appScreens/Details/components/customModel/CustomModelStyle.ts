import {StyleSheet} from 'react-native';
import {useMemo} from 'react';
import {useResponsiveScreen, useTheme} from '../../../../../hooks';
import {SPACING} from '../../../../../styles';

export const useCustomModelStyle = () => {
  const {hp, wp} = useResponsiveScreen();
  const {colors} = useTheme();
  const styles = useMemo(() => {
    return StyleSheet.create({
      modalContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        marginTop: 23,
        marginRight: 3,
      },
      triangle: {
        position: 'absolute',
        transform: [{rotate: '180deg'}],
        right: 0,
        top: -10,
        width: 0,
        height: 0,
        backgroundColor: colors.transparent,
        borderStyle: 'solid',
        borderRightWidth: 40,
        borderTopWidth: 20,
        borderRightColor: colors.transparent,
        borderTopColor: colors.white,
      },
      modalContent: {
        position: 'absolute',
        backgroundColor: colors.white,
        width: '83%',
        height: '60%',
        borderRadius: 5,
        elevation: 5,
        shadowColor: colors.black,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        flexDirection: 'column',
      },
      subtitle: {
        fontSize: 12,
        color: colors?.red,
        padding: 20,
      },
      itemContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(SPACING?.s10),
        paddingHorizontal: wp(SPACING?.s20),
      },
      dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: wp(SPACING?.s10),
        backgroundColor: colors.black,
      },
      itemText: {
        fontSize: 18,
        color: colors.gray,
      },
      flatListContainer: {
        flexGrow: 1,
        paddingBottom: hp(70),
        paddingRight: wp(SPACING?.s15),
      },
      closeButton: {
        position: 'absolute',
        bottom: 10,
        left: 20,
        right: 20,
        padding: 10,
        backgroundColor: colors?.pureBlue,
        borderRadius: 5,
        alignItems: 'center',
      },
      closeButtonText: {
        color: colors.white,
        fontWeight: 'bold',
      },
      sectionName: {
        color: colors.red,
        fontWeight: 'bold',
        marginLeft: 5,
      },
    });
  }, [colors, hp, wp]);

  return {
    styles,
    colors,
  };
};
