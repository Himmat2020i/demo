import React from 'react';
import {TouchableOpacity, TextStyle, ViewStyle, ActivityIndicator} from 'react-native';
import {useAppButtonStyle} from './AppButtonStyle';
import AppText from '../text/AppText';
import { DEFAULT_COLORS } from '../../styles';

interface props {
  title: string;
  backgroundColor?: string | undefined;
  onPress: () => void;
  style?: ViewStyle | any;
  labelStyle?: TextStyle;
  disabled?: boolean;
  isLoading?: boolean;
}

const AppButton = ({
  title,
  onPress,
  backgroundColor,
  labelStyle,
  style,
  disabled = false,
  isLoading,
}: props) => {
  const styles = useAppButtonStyle({backgroundColor});

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, style]}>
      {!isLoading ? <AppText style={[styles.label, labelStyle]}>{title}</AppText> :
      <ActivityIndicator color={DEFAULT_COLORS.white} />}
    </TouchableOpacity>
  );
};

export default AppButton;
