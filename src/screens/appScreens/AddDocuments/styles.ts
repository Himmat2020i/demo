import {Platform, StyleSheet} from 'react-native';
import {useMemo} from 'react';
import {useResponsiveScreen, useTheme} from '../../../hooks';
import {FONTS, SPACING} from '../../../styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const useAddDocumentStyle = () => {
  const {hp, wp} = useResponsiveScreen();
  const inset = useSafeAreaInsets();
  const {colors} = useTheme();
  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        flex: 1,
      },
      label: {
        paddingVertical: hp(SPACING?.s10),
        color: colors.gray,
      },
      required: {
        color: colors.lightOrange,
      },
      addIcon: {
        borderStyle: 'dotted',
        borderRadius: 5,
        borderColor: colors.glaciarGray,
        backgroundColor: colors.white,
        borderWidth: 2,
        height: 68,
        width: 58,
        justifyContent: 'center',
        alignItems: 'center',
      },
      addDocumentContainer: {
        borderRadius: 6,
        borderColor: colors.glaciarGray,
        flexDirection: 'row',
      },
      subContainer: {
        flex: 1,
        paddingHorizontal: wp(SPACING?.s16),
      },
      description: {
        borderWidth: 1,
        borderColor: colors.glaciarGray,
        color: colors.gray,
        justifyContent: 'center',
        height: 48,
      },
      inputText: {
        color: colors.gray,
      },
      descriptionText: {
        color: colors.gray,
      },
      placeholder: {
        fontFamily: FONTS.regular,
        color: colors.glaciarGray,
      },
      selectContainer: {
        color: colors.gray,
        fontFamily: FONTS.regular,
      },
      itemContainer: {
        fontFamily: FONTS.regular,
        color: colors.gray,
      },
      dropdownContainer: {
        height: 48,
        borderWidth: 1,
        borderColor: colors.glaciarGray,
        borderRadius: 5,
        paddingHorizontal: wp(SPACING?.s10),
        paddingVertical: hp(SPACING?.s10),
        backgroundColor: colors.white,
      },
      button: {
        paddingVertical: hp(SPACING?.s16),
        paddingHorizontal: wp(SPACING?.s16),
        paddingBottom: inset.bottom + 6,
      },
      errorStyle: {
        color: colors.lightOrange,
        marginTop: hp(SPACING?.s3),
      },
      desc: {
        height: 64,
        justifyContent: 'flex-start',
      },
      fileType: {
        position: 'absolute',
        bottom: 12,
        alignSelf: 'center',
        color: colors.black,
        fontSize: 18,
        maxWidth: '90%',
      },
      fileContainer: {
        height: 65,
        width: 55,
        marginLeft: wp(SPACING?.s16),
      },
    });
  }, [colors, hp, inset.bottom, wp]);

  return {styles, colors};
};
