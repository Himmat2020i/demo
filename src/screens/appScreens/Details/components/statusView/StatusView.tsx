import React from 'react';
import {TouchableOpacity, Alert} from 'react-native';
import {useSelector} from 'react-redux';
import {useStatusViewStyle} from './StatusViewStyle';
import {RootState} from '../../../../../redux/store';
import { ALERT } from '../../../../../constants/stringConstant';

const StatusView: React.FC = () => {
  const styles = useStatusViewStyle();
  const schemeList = useSelector(
    (state: RootState) => state?.auths?.schemeList,
  );
  const status: string = schemeList[0]?.applicationStatus[0]?.status || '';
  const disableApplication =  status?.toLowerCase?.() === 'approved' || status?.toLowerCase?.() === 'archived';

  const message = status?.toLowerCase?.() === 'approved' ? ALERT.statusApproved : ALERT.statusArchived;

  return (
    disableApplication && (
      <TouchableOpacity
        style={styles.overlay}
        onPress={() => {
          Alert.alert(ALERT.appStatus, message);
        }}
        activeOpacity={1}
      />
    )
  );
};

export default StatusView;
