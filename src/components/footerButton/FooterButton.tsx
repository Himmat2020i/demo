import React, {FunctionComponent} from 'react';
import {TextStyle, View, ViewStyle} from 'react-native';
import AppButton from '../button/AppButton';
import {useFooterButtonStyle} from './FooterButtonStyle';

interface Props {
  cancelLabel?: string;
  confirmLabel?: string;
  containerStyle?: ViewStyle;
  onPressConfirm: () => void;
  onPressCancel?: () => void;
  confrimStyle?: ViewStyle;
  cancelStyle?: ViewStyle;
  labelStyles?: TextStyle;
}

const FooterButton: FunctionComponent<Props> = ({
  cancelLabel = '',
  confirmLabel = '',
  containerStyle = {},
  confrimStyle = {},
  cancelStyle = {},
  labelStyles = {},
  onPressConfirm = () => {},
  onPressCancel = () => {},
}) => {
  const styles = useFooterButtonStyle();
  return (
    <View style={[styles.container, containerStyle]}>
      {!!cancelLabel && (
        <AppButton
          labelStyle={[styles.label, labelStyles]}
          style={[styles.button, cancelStyle]}
          title={cancelLabel}
          onPress={onPressCancel}
        />
      )}
      <AppButton
        labelStyle={[styles.label, labelStyles]}
        style={[styles.button, styles.confirmButton, confrimStyle]}
        title={confirmLabel}
        onPress={onPressConfirm}
      />
    </View>
  );
};

export default FooterButton;
