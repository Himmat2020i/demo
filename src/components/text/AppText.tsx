import React from 'react';
import {Text, TextProps} from 'react-native';
import {useAppTextStyle} from './AppTextStyle';
import { FONTS } from '../../styles';

interface props extends TextProps {
  size?: number;
  color?: string;
  // eslint-disable-next-line prettier/prettier
  fontFamily?: keyof typeof FONTS;
  fontWeight?: any;
}

const AppText = ({children, style, fontFamily = 'regular' , size, color, ...props}: props) => {
  const family = FONTS[fontFamily];
  const styles = useAppTextStyle({
    style: {
      fontFamily: family,
    },
    size,
    color,
  });
  return (
    <Text style={[styles.container, style]} {...props}>
      {children}
    </Text>
  );
};

export default AppText;
