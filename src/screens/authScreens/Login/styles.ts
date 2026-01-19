import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { SHADOW, SPACING } from "../../../styles";
import { useResponsiveScreen, useTheme } from "../../../hooks";

export const useLoginStyle = () => {
  const { colors } = useTheme();
  const { wp, hp } = useResponsiveScreen();
  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        height: "100%",
      },
      mainContainer: {
        flex: 1,
      },
      subContainer: {
        flex: 1,
        paddingHorizontal: wp(SPACING?.s16),
        paddingTop: hp(54),
      },
      logo: {
        alignSelf: "center",
        marginBottom: hp(SPACING?.s24),
      },
      loginStyle: {
        color: colors.black,
      },
      welcomeContainer: {
        alignSelf: "center",
        marginVertical: hp(SPACING?.s20),
      },
      welcomeLabel: {
        color: colors.white,
        fontSize: 24,
        fontWeight: "600",
        textAlign: "center",
      },
      button: {
        backgroundColor: colors.white,
        marginTop: hp(SPACING?.s22),
        width: "65%",
        borderRadius: 50,
        alignSelf: "center",
        ...SHADOW.shadow5,
      },
      input: {
        marginTop: hp(SPACING?.s16),
      },
      forgetPass: {
        marginVertical: hp(SPACING?.s16),
        alignSelf: "center",
      },
      forgetPassText: {
        color: colors.whiteSmoke,
        textAlign: "center",
        padding: 5,
      },
      signUp: {
        marginBottom: wp(SPACING?.s50),
      },
      signUpText: {
        color: colors.gray85,
        textAlign: "center",
      },
      textUnderLine: {
        textDecorationLine: "underline",
        color: colors.whiteSmoke,
        textAlign: "center",
      },
    });
  }, [colors, wp, hp]);

  return { styles, colors };
};
