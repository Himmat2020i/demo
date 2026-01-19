import { StyleSheet, StatusBar, Platform } from "react-native";
import { useMemo } from "react";
import { useResponsiveScreen, useTheme } from "../../../hooks";
import { SCREEN_HEIGHT, SCREEN_WIDTH, SPACING } from "../../../styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const useHomeStyle = () => {
  const { hp, wp } = useResponsiveScreen();
  const { colors } = useTheme();
  const inset = useSafeAreaInsets();
  const statusBarHeight: number = StatusBar.currentHeight || 0;
  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        height: "100%",
        width: "100%",
        backgroundColor: colors.whiteSmoke,
      },
      subContainer: {
        height: SCREEN_HEIGHT / 3,
        width: SCREEN_WIDTH,
        borderBottomRightRadius: 60,
        borderBottomLeftRadius: 60,
      },
      iconContainer: {
        paddingHorizontal: wp(SPACING?.s16),
        paddingTop: hp(Platform.OS === "ios" ? inset.top : statusBarHeight),
        alignItems: "flex-end",
      },
      icon: {
        paddingVertical: hp(SPACING?.s10),
      },
      welcomeContainer: {
        paddingHorizontal: wp(SPACING?.s16),
        paddingVertical: hp(SPACING?.s20),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      },
      welcomeSubContainer: {
        width: "70%",
      },
      welcomeText: {
        color: colors.white,
        fontSize: 20,
      },
      nameText: {
        color: colors.white,
        fontSize: 24,
      },
      logoContainer: {
        height: hp(85),
        width: hp(85),
        borderRadius: hp(SPACING?.s50),

        backgroundColor: colors.white,
        justifyContent: "center",
        alignItems: "center",
      },
      logoText: {
        fontSize: 30,
      },
      editIcon: {
        height: hp(25),
        width: hp(25),
        right: 1,
        borderRadius: hp(SPACING?.s50),
        borderWidth: 3,
        borderColor: colors.primary,
        backgroundColor: colors.white,
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
      },
      subTextContainer: {
        paddingHorizontal: wp(SPACING?.s16),
      },
      documentText: {
        color: colors.white,
        fontSize: 16,
        textDecorationLine: "underline",
      },
      documentSubText: {
        color: colors.white,
        paddingVertical: hp(SPACING?.s5),
      },
      touch: {
        marginBottom: hp(SPACING?.s10),
      },
      schemeContainer: {
        paddingVertical: hp(SPACING?.s10),
        paddingHorizontal: wp(SPACING?.s16),
      },
      schemeItemContainer: {
        height: hp(80),
        backgroundColor: colors.primary,
        paddingHorizontal: wp(SPACING?.s5),
        borderRadius: 8,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      },
      textContainer: {
        width: "60%",
        justifyContent: "center",
      },
      labelContainer: {
        paddingVertical: hp(SPACING?.s16),
      },
      label: {
        fontSize: 20,
        color: colors.primary,
      },
      businessName: {
        fontSize: 16,
        color: colors.white,
      },
      businessSubName: {
        color: colors.white,
        paddingVertical: hp(5),
        paddingRight: wp(SPACING?.s16),
        width: "100%",
      },
      statusContainer: {
        width: wp(120),
        backgroundColor: colors.green,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: hp(SPACING?.s8),
      },
      statusText: {
        color: colors.white,
      },
      modalContainer: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-end",
        marginTop: hp(Platform.OS === "ios" ? inset.top : statusBarHeight),
        marginRight: wp(3),
      },
      triangle: {
        position: "absolute",
        transform: [{ rotate: "180deg" }],
        right: 0,
        top: -10,
        width: 0,
        height: 0,
        backgroundColor: colors.transparent,
        borderStyle: "solid",
        borderRightWidth: 40,
        borderTopWidth: 20,
        borderRightColor: colors.transparent,
        borderTopColor: colors.white,
      },
      modalContent: {
        position: "absolute",
        backgroundColor: colors.white,
        borderRadius: 5,
        elevation: 5,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        flexDirection: "column",
        paddingHorizontal: wp(SPACING?.s10),
        paddingTop: hp(SPACING?.s10),
        paddingBottom: hp(SPACING?.s5),
      },
      itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingRight: wp(SPACING?.s16),
        height: hp(35),
      },
      separator: {
        height: 1,
        backgroundColor: colors.gray85,
      },
      renderText: {
        color: colors.primary,
        marginLeft: wp(SPACING?.s5),
        fontSize: 14,
      },
      emptyText: {
        textAlign: "center",
        color: colors.black,
        fontWeight: "500",
      },
      emptyContainer: {
        backgroundColor: colors.transparent,
        justifyContent: "center",
        alignItems: "center",
      },
    });
  }, [colors, hp, wp, inset, statusBarHeight]);

  return { styles, colors };
};
