import {useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {DEFAULT_COLORS, SPACING} from '../../../../../styles';
import {useResponsiveScreen, useTheme} from '../../../../../hooks';

export const useDocumentPickerStyle = () => {
  const {wp, hp} = useResponsiveScreen();
  const {colors} = useTheme();
  const containerSize = wp(70);
  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        flex: 1,
        flexDirection: 'row',
        marginVertical: hp(10),
        backgroundColor: colors.transparent,
      },
      label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: hp(8),
      },
      scrollView: {
        flex: 1,
      },
      button: {
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
        width: containerSize,
        borderStyle: 'dotted',
        height: containerSize,
        justifyContent: 'center',
        borderColor: colors.gray85,
        backgroundColor: colors.white,
      },
      buttonText: {
        fontSize: 16,
        color: colors.black,
      },
      selectedFiles: {
        marginLeft: wp(10),
        flexDirection: 'row',
        alignItems: 'center',
      },
      urlContainer: {
        borderRadius: 5,
        marginRight: wp(16),
        width: containerSize,
        flexDirection: 'row',
        alignItems: 'center',
        height: containerSize,
      },
      iconContainer: {
        position: 'relative',
      },
      closeIconContainer: {
        top: 0,
        right: -5,
        zIndex: 1,
        padding: 4,
        borderRadius: 12,
        position: 'absolute',
        backgroundColor: colors.red,
      },
      customTxtContainer: {
        padding: 10,
        borderRadius: 8,
        marginTop: hp(5),
        alignItems: 'center',
        width: containerSize,
        height: containerSize,
        justifyContent: 'center',
        backgroundColor: colors?.lightGrayishGreen,
      },
      customTxtLabel: {
        fontSize: 9,
        marginTop: hp(5),
        color: colors.appBlue,
      },
      customTxtUrl: {
        fontSize: 8,
        width: wp(SPACING?.s55),
        marginTop: hp(SPACING?.s5),
        alignSelf: 'center',
        color: colors.black,
      },

      Modalbutton: {
        padding: SPACING?.s10,
        width: '100%',
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: hp(SPACING?.s10),
        backgroundColor: colors?.green,
      },
      modalButtonText: {
        fontSize: 18,
        color: colors.white,
      },
      cancelButton: {
        padding: SPACING?.s10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: hp(SPACING?.s10),
        backgroundColor: colors?.lightRed,
      },
      cancelButtonText: {
        fontSize: 18,
        color: colors.white,
      },
      modalOverlay: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: DEFAULT_COLORS.blackOpacity,
      },
      modalContent: {
        width: '90%',
        padding: 20,
        alignItems: 'center',
        paddingTop: hp(SPACING?.s40),
        backgroundColor: colors.white,
        borderRadius: hp(SPACING?.s20),
        paddingBottom: hp(SPACING?.s30),
      },
      optionText: {
        fontSize: 22,
        fontWeight: 'bold',
        alignSelf: 'center',
        color: colors.darkBlue,
      },

      // modal button
      modalButton: {
        width: '80%',
        borderRadius: 5,
        alignItems: 'center',
        padding: SPACING?.s10,
        backgroundColor: colors?.green,
        marginVertical: hp(SPACING?.s10),
      },
      addDocument: {
        fontSize: 18,
        color: colors.white,
      },
      cancelContainer: {
        padding: 10,
        width: '80%',
        borderRadius: 5,
        marginVertical: hp(SPACING?.s10),
        alignItems: 'center',
        backgroundColor: colors?.red,
      },
      cancelText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.white,
      },

      // document Controller
      emptyText: {
        color: colors.red,
        marginTop: hp(SPACING?.s5),
      },
    });
  }, [colors, containerSize, hp, wp]);

  return {styles, colors};
};
