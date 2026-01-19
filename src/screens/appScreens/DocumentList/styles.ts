import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { SPACING } from "../../../styles";
import { useResponsiveScreen, useTheme } from "../../../hooks";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const useDocumentsListStyle = () => {
  const { hp, wp } = useResponsiveScreen();
  const { colors } = useTheme();
  const inset = useSafeAreaInsets();
  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        flex: 1,
      },
      subContainer: {
        flex: 1,
        paddingHorizontal: wp(SPACING?.s16),
        paddingVertical: hp(SPACING?.s16),
      },
      listContainer: {
        flex: 1,
        backgroundColor: colors.white,
        flexDirection: "row",
        borderRadius: 10,
        padding: 10,
        marginVertical: hp(SPACING?.s5),
        height: hp(95),
      },
      hiddenContainer: {
        marginVertical: hp(SPACING?.s5),
        backgroundColor: colors.white,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
      },
      iconContainer: {
        height: hp(95),
        width: wp(80),
        backgroundColor: colors.gray,
        justifyContent: "center",
        alignItems: "center",
      },
      deleteIcon: {
        width: wp(80),
        height: hp(95),
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: colors.red,
        justifyContent: "center",
        alignItems: "center",
      },
      iconText: {
        color: colors.white,
        fontSize: 16,
        paddingTop: hp(SPACING?.s10),
      },
      statusContainer: {
        backgroundColor: colors.red,
        borderRadius: 50,
        paddingVertical: hp(SPACING?.s3),
        minWidth: "35%",
        maxWidth: "40%",
        alignItems: "center",
      },
      status: {
        color: colors.white,
        fontSize: 12,
      },
      textContainer: {
        flex: 1,
        marginLeft: wp(SPACING?.s10),
        backgroundColor: colors.white,
        justifyContent: "space-between",
      },
      textSubContainer: {
        marginLeft: wp(SPACING?.s6),
      },
      label: {
        fontSize: 16,
        color: colors.gray,
      },
      subLabel: {
        color: colors.gray,
        lineHeight: 18,
      },
      fileLink: {
        textDecorationLine: "underline",
      },
      linkContainer: {
        alignSelf: "flex-start",
        marginBottom: hp(SPACING?.s6),
      },
      dateContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginLeft: wp(SPACING?.s6),
      },
      date: {
        color: colors.gray,
        width: "60%",
      },
      image: {
        borderRadius: hp(SPACING?.s10),
      },
      fabIcon: {
        position: "absolute",
        bottom: inset.bottom + 16,
        right: "10%",
        backgroundColor: colors.primary,
        height: hp(60),
        width: hp(60),
        borderRadius: hp(SPACING?.s20),
        justifyContent: "center",
        alignItems: "center",
      },
      fileType: {
        position: "absolute",
        bottom: 18,
        alignSelf: "center",
        color: colors.black,
        fontSize: 22,
        maxWidth: "90%",
      },
      fileContainer: {
        height: hp(76),
        width: wp(65),
      },
      list: {
        paddingBottom: hp(100),
      },
      sectionView: {
        height: hp(48),
        backgroundColor: colors.primary,
        shadowColor: "black",
        borderRadius: 6,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      },
      text: {
        fontSize: 16,
        color: colors.white,
        marginLeft: wp(20),
      },
      topSection: {
        margin: wp(SPACING?.s5),
        marginBottom: hp(SPACING?.s5),
      },
    });
  }, [colors, hp, wp, inset]);

  return { styles, colors };
};
