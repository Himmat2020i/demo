import React from 'react';
import {View} from 'react-native';
import AppText from '../text/AppText';
import {useErrorMessageStyle} from './ErrorMessageStyle';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = React.memo(({message}: ErrorMessageProps) => {
  const styles = useErrorMessageStyle();
  return (
    <View style={styles.container}>
      <AppText style={styles.text}>{message}</AppText>
    </View>
  );
});

export default ErrorMessage;
