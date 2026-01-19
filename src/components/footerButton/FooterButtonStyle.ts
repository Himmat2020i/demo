import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "../../hooks";

export const useFooterButtonStyle = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
      },
      button: {
        backgroundColor: colors.red,
        width: "47%",
        borderRadius: 26,
        elevation: 10,
      },
      label: {
        color: colors.white,
      },
      confirmButton: {
        backgroundColor: colors.green,
      },
    });
  }, [colors]);

  return styles;
};
