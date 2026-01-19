import {useEffect} from 'react';
import {useNetInfo} from '@react-native-community/netinfo';

export default (callBack: Function) => {
  const {isConnected} = useNetInfo();

  useEffect(() => {
    if (isConnected) {
      callBack();
    }
    return () => {};
  }, [callBack, isConnected]);
};
