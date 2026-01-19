import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useResponsiveScreen, useTheme } from "../../hooks";
import { SPACING } from "../../styles";

export const useSplashStyle = () => {
  const { colors } = useTheme();
  const { hp } = useResponsiveScreen();
  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      },
      welcomeContainer: {
        alignSelf: "center",
        marginVertical: hp(SPACING?.s10),
      },
      welcomeLabel: {
        fontSize: 30,
        color: colors.white,
        textAlign: "center",
      },
    });
  }, [colors, hp]);

  return { styles, colors };
};
