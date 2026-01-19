import React from 'react';
import { View } from 'react-native';
import { UsableModalComponentProp, ModalfyParams } from 'react-native-modalfy';
import AppText from '../../text/AppText';
import FooterButton from '../../footerButton/FooterButton';
import { closeModal } from '../../../helpers/utils';
import { MODALS } from '../../../constants/routeConstant';
import { useReasonTextInputStyle } from './ReasonTextInputStyle';
import { Controller, useForm } from 'react-hook-form';
import { deleteAccountSchema } from '../../../helpers/yupHelper';
import AuthTextInput from '../../textInput/AuthTextInput';

interface Props {
  modal: UsableModalComponentProp<ModalfyParams, keyof ModalfyParams>;
}

const ReasonTextInput: React.FC<Props> = ({ modal }) => {
  const { handleSubmit, control, setValue, getValues } = useForm<any, any>({
      resolver: deleteAccountSchema,
      mode: 'onSubmit',
    });
  const title = modal.getParam('title', 'Are you sure?');
  const subTitle = modal.getParam('subTitle', '');
  const cancelLabel = modal.getParam('cancelLabel', 'Cancel');
  const confirmLabel = modal.getParam('confirmLabel', 'Confirm');
  const onPressConfirm = modal.getParam('onPressConfirm', (reason: string) => {});
  const onPressCancel = modal.getParam('onPressCancel', () => {});
  const {styles} = useReasonTextInputStyle();


  const handleConfirm = () => {
    onPressConfirm(getValues().reason || '');
    closeModal(MODALS.reasonTextInput)
  };

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
      <Controller
            control={control}
            name="reason"
            render={({
              field: {onChange, value, onBlur},
              fieldState: {error},
            }) => (
              <AuthTextInput
                value={value}
                label=""
                placeholder={'Enter reason for deletion'}
                onChangeText={onChange}
                onBlur={onBlur}
                style={styles.textInput}
                error={error?.message}
                maxLength={500}
                multiline
              />
            )}
          />
      {(onPressConfirm || onPressCancel) && (
        <FooterButton
          containerStyle={styles.footer}
          onPressCancel={() => closeModal(MODALS.reasonTextInput)}
          onPressConfirm={handleSubmit(handleConfirm)}
          cancelLabel={cancelLabel}
          confirmLabel={confirmLabel}
        />
      )}
    </View>
  );
};

export default ReasonTextInput;
