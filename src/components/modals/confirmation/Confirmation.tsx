/* eslint-disable prettier/prettier */
import React from 'react';
import {View} from 'react-native';
import {useConfirmationStyle} from './ConfirmationStyle';
import {UsableModalComponentProp, ModalfyParams} from 'react-native-modalfy';
import AppText from '../../text/AppText';
import FooterButton from '../../footerButton/FooterButton';

interface Props {
  modal: UsableModalComponentProp<ModalfyParams, keyof ModalfyParams>;
}

const ConfirmationModal: React.FC<Props> = ({modal}) => {
  const {styles} = useConfirmationStyle();
  const title = modal.getParam('title', 'Are you sure?');
  const subTitle = modal.getParam('subTitle', '');
  const cancelLabel = modal.getParam('cancelLabel', 'Cancel');
  const confirmLabel = modal.getParam('confirmLabel', 'Confirm');
  const onPressConfirm = modal.getParam('onPressConfirm', () => {});
  const onPressCancel = modal.getParam('onPressCancel', () => {});


  const renderSubTitle = () => {
    if (typeof subTitle === 'object') {
      return subTitle;
    }
    if (typeof subTitle === 'string') {
      return <AppText style={styles.subTitle}>{subTitle}</AppText>;
    }
    return <></>;
  };

  return (
    <View style={styles.container}>
      <AppText fontFamily="bold" style={styles.title}>{title}</AppText>
      {renderSubTitle()}
    {(onPressConfirm || onPressCancel) && (
        <FooterButton
        containerStyle={styles.footer}
        onPressCancel={onPressCancel}
        onPressConfirm={onPressConfirm}
        cancelLabel={cancelLabel}
        confirmLabel={confirmLabel}
      />)}
    </View>
  );
};

export default ConfirmationModal;
