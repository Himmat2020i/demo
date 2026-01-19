import { useMemo } from "react";
import { SHADOW, SPACING } from "../../../styles";
import { StyleSheet } from "react-native";
import { useResponsiveScreen, useTheme } from "../../../hooks";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const useOTPStyle = () => {
  const { colors } = useTheme();
  const { wp, hp } = useResponsiveScreen();
  const inset = useSafeAreaInsets();
  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        flex: 1,
      },
      subContainer: {
        flex: 1,
        marginTop: hp(SPACING?.s25),
        paddingHorizontal: wp(SPACING?.s16),
      },
      button: {
        width: "65%",
        borderRadius: 50,
        ...SHADOW.shadow5,
        marginTop: hp(22),
        alignSelf: "center",
        marginBottom: hp(inset.bottom) + 16,
        backgroundColor: colors.white,
      },
      labelContainer: {
        flexDirection: "row",
      },
      label: {
        paddingRight: wp(SPACING?.s10),
        color: colors.white,
      },
      varifyStyle: {
        color: colors.black,
      },
      labelType: {
        marginHorizontal: wp(SPACING?.s10),
        color: colors.white,
      },
      resendContainer: {
        marginTop: hp(SPACING?.s50),
        marginBottom: hp(SPACING?.s50),
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        color: colors.whiteSmoke,
      },
      resend: {
        paddingRight: wp(SPACING?.s5),
        color: colors.glaciarGray,
      },
      second: {
        color: colors.white,
        fontWeight: "400",
      },
      otp: {
        marginTop: hp(SPACING?.s35),
        flexDirection: "row",
        justifyContent: "space-between",
      },
      input: {
        fontSize: hp(SPACING?.s16),
        width: '100%',
        height: '100%',
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
        color: colors.white,
      },
      inputConfirm: {
        width: "100%",
        height: hp(SPACING?.s50),
        marginTop: hp(SPACING?.s24),
        paddingRight: wp(SPACING?.s16),
      },
      textStyles: {
        color: colors.black,
      },
      inputContainer: {
        width: wp(46),
        height: hp(46),
        borderWidth: 2,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        borderColor: colors.white,
      },
      onFocus: {
        borderColor: colors.black,
        backgroundColor: colors.primary,
      },
      error: {
        marginTop: hp(SPACING?.s16),
        color: colors.red,
      },
    });
  }, [colors, wp, hp]);

  return { styles, colors };
};
