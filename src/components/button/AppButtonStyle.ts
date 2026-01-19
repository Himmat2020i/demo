import {StyleSheet} from 'react-native';
import {useMemo} from 'react';
import {useTheme} from '../../hooks';

interface props {
  backgroundColor: string | undefined;
}

export const useAppButtonStyle = ({backgroundColor}: props) => {
  const {colors} = useTheme();
  const styles = useMemo(() => {
    return StyleSheet.create({
      button: {
        backgroundColor: backgroundColor || colors.primary,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        borderRadius: 6,
      },
      label: {
        fontSize: 16,
        color: colors.white,
        fontWeight: '600',
        letterSpacing: 0.3,
      },
    });
  }, [colors, backgroundColor]);

  return styles;
};
