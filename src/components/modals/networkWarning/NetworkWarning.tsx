import React from 'react';
import {View} from 'react-native';
import AppText from '../../text/AppText';
import AppButton from '../../button/AppButton';
import {NetworkWarningStyle} from './NetworkWarningStyle';
import {useNetInfo} from '@react-native-community/netinfo';
import {closeNetworkWarning} from '../../../helpers/utils';

const NetworkWarningModal: React.FC = () => {
  const styles = NetworkWarningStyle();
  const {isConnected} = useNetInfo();

  const tryAgain = () => {
    if (isConnected) {
      closeNetworkWarning();
    }
  };

  return (
    <View style={styles.modalView}>
      <View style={styles.headerBlock}>
        <AppText style={styles.headerText}>No internet connection</AppText>
      </View>
      <View style={styles.bodyBlock}>
        <AppText style={styles.bodyText}>
          You are not connected to Internet.
        </AppText>
        <AppText style={styles.bodyText}>
          Check your internet connection and try again
        </AppText>
      </View>
      <View style={styles.footerBlock}>
        <AppButton
          title={'TRY AGAIN'}
          onPress={tryAgain}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        />
      </View>
    </View>
  );
};

export default NetworkWarningModal;
