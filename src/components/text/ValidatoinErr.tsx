import React from 'react';
import {TextProps} from 'react-native';
import {useAppTextStyle} from './AppTextStyle';
import AppText from './AppText';

interface props extends TextProps {
  size?: number;
  color?: string;
}

const ValidationErr = ({children, style, size, color, ...props}: props) => {
  const styles = useAppTextStyle({
    style: {},
    size,
    color,
  });
  return (
    <AppText style={[styles.container, style]} {...props}>
      {children}
    </AppText>
  );
};

export default ValidationErr;
