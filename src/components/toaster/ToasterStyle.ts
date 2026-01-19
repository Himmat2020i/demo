import {ThemeColors} from '@react-navigation/native';
import {StyleSheet} from 'react-native';
import {SPACING} from '../../styles';

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    toast: {
      position: 'absolute',
      right: 0,
      width: '80%',
      bottom: 0,
    },
    content: {
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%',
      padding: SPACING.s16,
      backgroundColor: colors.primary,
    },
    toastMessageContainer: {
      justifyContent: 'flex-start',
      paddingLeft: SPACING.s18,
      flex: 1,
    },
    titleText: {
      color: colors.white,
      fontSize: 18,
    },
    messageText: {
      color: colors.white,
      fontSize: 16,
      flex: 1,
    },
  });
