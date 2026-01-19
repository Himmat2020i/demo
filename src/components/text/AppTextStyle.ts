import {StyleSheet, TextStyle} from 'react-native';
import {useMemo} from 'react';
import {useTheme} from '../../hooks';
interface props {
  style: TextStyle;
  size?: number;
  color?: string;
}

export const useAppTextStyle = ({style, size}: props) => {
  const {colors} = useTheme();
  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        fontSize: size || 14,
        color: colors.primary,
        ...style,
      },
    });
  }, [style, size, colors]);

  return styles;
};
