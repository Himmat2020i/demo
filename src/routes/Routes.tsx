import React, {useMemo} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTES} from '../constants/routeConstant';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useTheme} from '../hooks';
import Splash from '../screens/Splash';
import AuthNavigation from '../navigation/authNavigation';
import AppNavigation from '../navigation/appNavigation';
import {navigationRef} from '../navigation/rootNavigation';

const Stack = createNativeStackNavigator();
const globalProps: any = global;

globalProps.currentScreen = '';

const Routes = () => {
  const {mode} = useTheme();
  const barStyle = useMemo(
    () => (mode === 'light' ? 'dark-content' : 'light-content'),
    [mode],
  );
  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={navigationRef}
        >
        <Stack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName={ROUTES.splash}>
          <Stack.Screen name={ROUTES.splash} component={Splash} />
          <Stack.Screen name={ROUTES.auth} component={AuthNavigation} />
          <Stack.Screen name={ROUTES.app} component={AppNavigation} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default Routes;
