import {StyleSheet} from 'react-native';
import {useResponsiveScreen, useTheme} from '../../../../hooks';
import {DEFAULT_COLORS} from '../../../../styles';
import {useMemo} from 'react';

export const useTextEditorStyle = () => {
  const {colors} = useTheme();
  const {hp, wp} = useResponsiveScreen();
  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        flex: 1,
        padding: 10,
        backgroundColor: colors.white,
      },
      editorContainer: {
        flex: 1,
      },
      rich: {
        minHeight: 300,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.black,
        borderRadius: 5,
        padding: 10,
        marginBottom: hp(10),
      },
      richBar: {
        height: 50,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.gray,
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: DEFAULT_COLORS.blackOpacity,
      },
      modalContent: {
        backgroundColor: colors.white,
        padding: 20,
        borderRadius: 10,
        elevation: 5,
      },
      textInputModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: DEFAULT_COLORS.blackOpacity,
      },
      textInputModalContent: {
        backgroundColor: colors.white,
        padding: 20,
        width: '80%',
        borderRadius: 10,
        elevation: 5,
      },
      modalButton: {
        marginTop: hp(10),
        padding: 10,
        backgroundColor: colors?.pureBlue,
        borderRadius: 5,
        alignItems: 'center',
      },
      modalCancelButton: {
        marginTop: hp(10),
        padding: 10,
        backgroundColor: '#ccc',
        borderRadius: 5,
        alignItems: 'center',
      },
      modalButtonText: {
        color: colors?.white,
      },
      galleryButton: {
        height: 40,
        borderRadius: 5,
        backgroundColor: colors?.pureBlue,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: hp(10),
      },
      buttonLabel: {
        fontSize: 22,
        color: colors.white,
        fontWeight: 'bold',
        paddingHorizontal: 20,
      },
      textInput: {
        height: 40,
        borderColor: colors?.gray,
        borderWidth: 1,
        paddingLeft: wp(10),
        marginBottom: hp(10),
      },
      insertButton: {
        height: 40,
        backgroundColor: colors?.pureBlue,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp(10),
      },
      insertButtonText: {
        color: colors.white,
        fontSize: 20,
        fontWeight: 'bold',
      },
      cancelButton: {
        height: 40,
        backgroundColor: '#ccc',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
      },
      cancelButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
      },
      downloadBtn: {
        backgroundColor: colors.transparent,
      },
      downloadTxt: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors?.appBlue,
        // paddingHorizontal: 20,
      },
    });
  }, [colors, hp, wp]);

  return {
    styles,
    colors,
  };
};
