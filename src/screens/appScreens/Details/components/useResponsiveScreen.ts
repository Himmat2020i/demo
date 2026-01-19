import { StyleSheet } from "react-native";
import { useMemo } from "react";
import { useResponsiveScreen, useTheme } from "../../../../hooks";
import { SPACING } from "../../../../styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const useSimpleModalStyle = () => {
  const { colors } = useTheme();
  const { hp, wp } = useResponsiveScreen();
  const inset = useSafeAreaInsets();

  const styles = useMemo(() => {
    return StyleSheet.create({
      qHelperText: {
        fontSize: 16,
        fontWeight: "500",
        color: colors.black,
      },
      press: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
      viewQHelper: {
        backgroundColor: colors.white,
        padding: 20,
        marginHorizontal: 20,
        borderRadius: 10,
        elevation: 5,
      },
      footer: {
        paddingVertical: hp(SPACING?.s10),
        paddingBottom: hp(inset.bottom),
      },
    });
  }, []);

  return {
    styles,
  };
};
