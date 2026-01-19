import { PressableStateCallbackType, StyleSheet } from "react-native";
import { useResponsiveScreen, useTheme } from "../../hooks";
import { FONTS, SCREEN_WIDTH, SPACING } from "../../styles";
import { ReactNode, useMemo } from "react";
import { DEFAULT_COLORS } from "../../styles";

interface props {
  leftIcon?: ReactNode | ((state: PressableStateCallbackType) => ReactNode);
  editable?: boolean;
  isFocus?: boolean;
}

export const useAppTextInputStyle = ({ leftIcon, editable = true }: props) => {
  const { colors } = useTheme();
  const { hp, wp } = useResponsiveScreen();
  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        width: "100%",
        borderWidth: 2,
        borderRadius: 8,
        justifyContent: "center",
        borderColor: colors.primary,
        backgroundColor: colors.white,
      },
      authTextInputContainer: {
        width: "100%",
        borderWidth: 2,
        borderRadius: 8,
        justifyContent: "flex-start",
        opacity: !editable ? 0.5 : 1,
        backgroundColor: colors.white,
        borderColor: colors.transparent,
      },
      authDropDownContainer: {
        width: "100%",
        borderWidth: 2,
        borderRadius: 8,
        borderColor: colors.white,
        marginTop: hp(SPACING?.s15),
        justifyContent: "flex-start",
        backgroundColor: colors.white,
      },
      inputStyle: {
        flexDirection: "row",
      },
      rightIcon: {
        right: 20,
        height: "100%",
        position: "absolute",
        justifyContent: "center",
      },
      error: {
        color: colors.red,
        textAlign: "left",
        alignSelf: "flex-start",
        lineHeight: 14,
      },
      label: {
        color: colors.primary,
        alignSelf: "flex-start",
        marginTop: hp(SPACING?.s10),
        marginBottom: hp(SPACING?.s12),
      },
      authLabel: {
        fontSize: 16,
        color: colors.gray,
        alignSelf: "flex-start",
        marginTop: hp(SPACING?.s8),
        paddingHorizontal: wp(SPACING?.s10),
      },
      required: {
        color: colors.toastError,
      },
      errorWrapper: {
        borderWidth: 2,
        borderColor: colors.toastError,
      },
      textInputStyles: {
        fontFamily: FONTS.regular,
        paddingLeft: leftIcon ? wp(SPACING?.s40) : wp(SPACING?.s12),
      },
      authTextInputStyles: {
        height: 38,
        fontSize: 16,
        width: "80%",
        color: colors.black,
        fontFamily: FONTS.regular,
        paddingLeft: leftIcon ? wp(SPACING?.s40) : wp(SPACING?.s12),
      },
      prefixCodeTextStyles: {
        color: colors.lightGray,
        marginLeft: wp(12),
        fontSize: 16,
        textAlignVertical: "center",
        alignSelf: "center",
      },
      prefixTextStyles: {
        marginEnd: 4,
        alignSelf: "center",
        color: colors.black,
        textAlignVertical: "center",
      },
      prefixContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
      },
      inputLabelContainer: {
        width: "100%",
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      },
      compulsory: {
        color: DEFAULT_COLORS.blue,
      },
      leftIcon: {
        position: "absolute",
        left: wp(SPACING?.s14),
      },
      floatingLabel: {
        top: -10,
        left: 12,
        position: "absolute",
        backgroundColor: colors.white,
        paddingHorizontal: wp(SPACING?.s5),
      },
      percentage: {
        right: wp(12),
        position: "absolute",
      },
      placeholder: {
        fontSize: 14,
        color: colors.lightGray,
      },
      border: {
        borderTopWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderBottomWidth: 0,
        borderColor: colors.primary,
      },
      item: {
        height: hp(25),
        borderWidth: 1,
        borderRadius: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderColor: colors.black,
        paddingRight: wp(SPACING?.s2),
        marginBottom: hp(SPACING?.s10),
        marginVertical: hp(SPACING?.s5),
        paddingVertical: hp(SPACING?.s4),
        marginHorizontal: wp(SPACING?.s2),
      },
      titleContainer: {
        color: colors.black,
        paddingHorizontal: wp(SPACING?.s10),
      },
      title: {
        fontSize: 10,
        color: colors.black,
      },
      cancelIconContainer: {
        width: hp(18),
        height: hp(18),
        padding: 2,
        borderWidth: 1,
        borderRadius: hp(SPACING?.s50),
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.black,
      },
      valueContainer: {
        height: hp(38),
        justifyContent: "center",
        width: SCREEN_WIDTH / 1.25,
        paddingHorizontal: wp(SPACING?.s10),
      },
      labelContainer: {
        height: hp(38),
        width: SCREEN_WIDTH / 1.7,
        justifyContent: "center",
      },
      valueText: {
        fontSize: 16,
        color: colors.lightGray,
      },
      valueIconContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      },
      noDataText: {
        fontSize: 16,
        color: colors.lightGray,
      },
      noDataContainer: {
        alignItems: "center",
        justifyContent: "center",
      },
      flatListContainer: {
        flexGrow: 1,
        paddingRight: wp(SPACING?.s16),
      },
      auroView: {
        width: wp(45),
        height: hp(47),
        borderRightWidth: 0.5,
        justifyContent: "center",
        borderColor: colors.gray,
        backgroundColor: colors.white,
      },
    });
  }, [colors, editable, hp, wp, leftIcon]);

  return styles;
};
