import React, {FunctionComponent} from 'react';
import {Pressable, TextStyle, View} from 'react-native';
import Svg from '../../assets/svg';
import {useWelComeLabelStyle} from './WelComLabelStyle';
import AppText from '../text/AppText';
import {useNavigation} from '@react-navigation/native';

interface Props {
  label?: string;
  message?: string;
  iconColor?: string;
  labelStyle?: TextStyle;
  onPressBack?: () => void;
  subLabelStyle?: TextStyle;
}

const WelcomeLabel: FunctionComponent<Props> = ({
  label,
  message,
  iconColor,
  labelStyle,
  onPressBack,
  subLabelStyle,
}) => {
  const navigation = useNavigation<any>();
  const {styles, colors} = useWelComeLabelStyle();

  const onBackPress = () => {
    if (onPressBack) {
      onPressBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.iconContainer}>
      <Pressable hitSlop={30} style={styles.icon} onPress={onBackPress}>
        <Svg.backIcon
          height={18}
          width={18}
          fill={iconColor ? iconColor : colors.white}
        />
      </Pressable>
      <View style={styles.welcomeContainer}>
        <AppText fontFamily="bold" style={[styles.label, labelStyle]}>
          {label || ''}
        </AppText>
        <AppText style={[styles.subLabel, subLabelStyle]}>
          {message || ''}
        </AppText>
      </View>
    </View>
  );
};

export default WelcomeLabel;
