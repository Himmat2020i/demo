import {useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from '../../hooks';
import { SCREEN_HEIGHT } from '../../styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useToolTipStyle = () => {
  const {colors} = useTheme();
  const inset = useSafeAreaInsets();
  const styles = useMemo(() => {
    return StyleSheet.create({
      toolContainer: {
        height: 'auto',
        width: '100%',
      },
      infoText: {
        width: '90%',
        minWidth: '70%',
        color: colors.white,
        borderRadius: 5,
        padding: 8,
        maxHeight: SCREEN_HEIGHT - 40 - inset.bottom,
      },
    });
  }, [colors, inset.bottom]);

  return {styles, colors};
};
