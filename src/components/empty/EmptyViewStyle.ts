import {useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from '../../hooks';

export const useEmptyViewStyle = () => {
  const {colors} = useTheme();
  const styles = useMemo(() => {
    return StyleSheet.create({
      noDataText: {
        fontSize: 16,
        color: colors.black,
      },
      noDataContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
      },
    });
  }, [colors]);

  return styles;
};
