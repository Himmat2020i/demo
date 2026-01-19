import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';

const CustomTouchableOpacity = ({onPress, children, style}) => (
  <TouchableOpacity onPress={onPress} style={style}>
    {children}
  </TouchableOpacity>
);

export default CustomTouchableOpacity;
