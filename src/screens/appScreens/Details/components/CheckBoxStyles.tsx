import {StyleSheet} from 'react-native';
import {useResponsiveScreen, useTheme} from '../../../../hooks';

export const useCheckBoxStyle = () => {
  const {colors} = useTheme();
  const {hp, wp} = useResponsiveScreen();

  return StyleSheet.create({
    container: {
      flexWrap: 'wrap',
      marginTop: hp(10),
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    checkBox: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: wp(20),
      marginBottom: hp(20),
    },
    checkIcon: {
      width: hp(22),
      borderWidth: 2,
      height: hp(22),
      borderRadius: 2,
      marginRight: wp(10),
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: colors.appBlue,
      backgroundColor: colors.white,
    },
    checkLabel: {
      fontSize: 14,
      color: colors.storemGrey,
    },
    titleText: {
      color: colors.black,
    },
    dropDownContainer: {
      flex: 1,
    },
    dropDownTitleText: {
      color: colors?.gray,
    },
    controllerName: {
      marginTop: hp(0),
    },
  });
};
