import React, {useEffect} from 'react';
import {View, ImageBackground} from 'react-native';
import {replace} from '../../navigation/rootNavigation';
import {ROUTES} from '../../constants/routeConstant';
import {getData, storeData} from '../../helpers/localstorage';
import {ASYNC_STORE_VAR} from '../../constants/constants';
import {
  getBusinessListDb,
  getSelectedBusinessScheme,
  setToken,
  setUser,
} from '../../redux/auth/authSlice';
import Svg from '../../assets/svg';
import AppText from '../../components/text/AppText';
import {useSplashStyle} from './styles';
import {useDispatch} from 'react-redux';
import {setAuthToken, setDeviceId} from '../../helpers/api';
import {singleQuote} from '../../../.prettierrc';
import { getUniqueId } from 'react-native-device-info';

const Splash = () => {
  const {styles} = useSplashStyle();
  const dispatch = useDispatch();

  useEffect(() => {
    const init = async () => {
      await deviceInfo();
      dispatch(getBusinessListDb());
      const user = await getData(ASYNC_STORE_VAR.user);
      const token = await getData(ASYNC_STORE_VAR.token);
      if (user) {
        dispatch(getSelectedBusinessScheme(user?.idOrganisation));
        if (token) {
          singleQuote;
          dispatch(setToken(token));
          setAuthToken(token);
          await storeData(ASYNC_STORE_VAR.token, token);
        }
        dispatch(setUser(user));
        setTimeout(() => {
          replace(ROUTES.app);
        }, 1500);
      } else {
        setTimeout(() => {
          replace(ROUTES.auth);
        }, 1500);
      }
    };

    init();
  }, [dispatch]);

  const deviceInfo = async () => {
    const id = await getUniqueId();
    setDeviceId(id);
  };

  return (
    <ImageBackground style={styles.container} source={{uri: 'auth_background'}}>
      <Svg.appLogo height={220} width={220} />
      <View style={styles.welcomeContainer}>
        <AppText fontFamily={'bold'} style={styles.welcomeLabel}>
          Welcome to
        </AppText>
        <AppText fontFamily={'bold'} style={styles.welcomeLabel}>
          UKTSA
        </AppText>
      </View>
    </ImageBackground>
  );
};

export default Splash;
