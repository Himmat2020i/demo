import { Platform, StyleSheet } from "react-native";
import { useMemo } from "react";
import { useResponsiveScreen, useTheme } from "../../../hooks";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FONTS, SPACING } from "../../../styles";

export const useProfileStyle = () => {
  const { hp, wp } = useResponsiveScreen();
  const inset = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.white,
      },
      subContainer: {
        flex: 1,
        paddingHorizontal: wp(SPACING?.s16),
        paddingVertical: hp(SPACING?.s16),
      },
      firstName: {
        color: colors.primary,
      },
      required: {
        color: colors.lightOrange,
      },
      firstNameContainer: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        marginTop: hp(SPACING?.s10),
      },
      firstContainer: {
        height: 48,
        flex: 1,
        marginLeft: wp(SPACING?.s16),
      },
      placeholder: {
        color: colors.lightGray,
        fontFamily: FONTS.regular,
      },
      selectTextStyle: {
        color: colors.gray,
        fontFamily: FONTS.regular,
      },
      itemTextStyle: {
        color: colors.gray,
        fontFamily: FONTS.regular,
      },
      button: {
        paddingVertical: hp(SPACING?.s16),
        paddingHorizontal: wp(SPACING?.s16),
        paddingBottom: inset.bottom + 6,
      },
      dropdownContainer: {
        backgroundColor: colors.white,
        borderWidth: 1,
        width: "100%",
        height: hp(SPACING?.s50),
        paddingHorizontal: hp(SPACING?.s10),
        borderRadius: 6,
        borderColor: colors.gray85,
      },
      dropdwon: {
        width: "25%",
      },
      firstNameInput: {
        width: "100%",
        height: hp(SPACING?.s50),
        borderWidth: 1,
        borderColor: colors.gray85,
      },
      input: {
        color: colors.glaciarGray,
        height: hp(SPACING?.s50),
        borderColor: colors.gray85,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: wp(1),
        marginBottom: hp(SPACING?.s16),
        fontSize: 12,
        fontWeight: "400",
      },
      textInput: {
        color: colors.gray,
      },
      errorStyle: {
        color: colors.lightOrange,
        marginTop: hp(SPACING?.s3),
      },
    });
  }, [colors, hp, inset.bottom, wp]);

  return { styles, colors };
};
