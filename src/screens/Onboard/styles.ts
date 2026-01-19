import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useResponsiveScreen, useTheme } from "../../hooks";
import { SPACING } from "../../styles";

export const useOnboardingStyle = () => {
  const { colors } = useTheme();
  const { wp, hp } = useResponsiveScreen();
  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: wp(SPACING?.s25),
      },
      iconContainer: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: hp(SPACING?.s50),
      },
      welcomeContainer: {
        alignSelf: "center",
        marginTop: hp(SPACING?.s50),
      },
      welcomeLabel: {
        color: colors.white,
        fontSize: 24,
        textAlign: "center",
        marginBottom: hp(SPACING?.s10),
      },
      welcomeSubLabel: {
        color: colors.white,
        textAlign: "center",
      },
      buttonContainer: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      },
      signInButton: {
        backgroundColor: colors.white,
        borderRadius: 50,
        marginBottom: hp(SPACING?.s16),
      },
      signUpButton: {
        backgroundColor: colors.transparent,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: colors.white,
      },
      signInLabel: {
        color: colors.black,
      },
    });
  }, [colors, wp, hp]);

  return { styles, colors };
};
