import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { FONTS, SHADOW, SPACING } from "../../../styles";
import { useResponsiveScreen, useTheme } from "../../../hooks";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const useSignUpStyle = () => {
  const { colors } = useTheme();
  const { wp, hp } = useResponsiveScreen();
  const inset = useSafeAreaInsets();
  const styles = useMemo(() => {
    return StyleSheet.create({
      mainContainer: {
        flex: 1,
      },
      container: {
        height: "100%",
      },
      scrollContainer: {
        flexGrow: 1,
      },
      subContainer: {
        paddingBottom: wp(SPACING?.s20),
        paddingHorizontal: wp(SPACING?.s16),
      },
      buttonContainer: {
        paddingHorizontal: wp(SPACING?.s16),
        paddingVertical: hp(SPACING?.s25),
        paddingBottom: hp(inset.bottom) + 16,
      },
      button: {
        backgroundColor: colors.white,
        ...SHADOW.shadow5,
      },
      nextStyle: {
        color: colors.black,
      },
      lableStyle: {
        color: colors.black,
      },
      signUpButton: {
        backgroundColor: colors.primary,
        width: "65%",
        borderRadius: 50,
        alignSelf: "center",
        ...SHADOW.shadow5,
      },
      input: {
        marginTop: hp(SPACING?.s16),
      },
      comInfoStyle: {
        justifyContent: "center",
      },
      inputText: {
        fontFamily: FONTS.regular,
      },
      signUpButtonContainer: {
        paddingVertical: hp(SPACING?.s20),
        justifyContent: "center",
        paddingBottom: hp(inset.bottom) + 16,
      },
      listStyle: {
        width: "100%",
        marginVertical: hp(-SPACING?.s16),
      },
      listTextStyle: {
        fontSize: 14,
        color: colors.white,
        textDecorationLine: "underline",
      },
      checkStyle: {
        borderWidth: 0,
        backgroundColor: colors.white,
      },
      titleStyle: {
        color: colors.black,
      },
      findAddress: {
        textDecorationLine: "underline",
      },
      infoText: {
        color: colors.gray,
      },
    });
  }, [colors, wp, hp]);

  return { styles, colors };
};
