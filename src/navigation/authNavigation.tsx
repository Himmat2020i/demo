import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTES} from '../constants/routeConstant';
import Login from '../screens/authScreens/Login';
import ForgotPassword from '../screens/authScreens/ForgotPassword';
import Onboarding from '../screens/Onboard';
import SignUp from '../screens/authScreens/SignUp';
import OTP from '../screens/authScreens/OTP';
import SelectBusiness from '../screens/authScreens/SelectBusiness';
import BusinessDetails from '../screens/authScreens/SignUp/BusinessDetails';
import BusinessInfo from '../screens/authScreens/SignUp/BusinessInfo';
import HTMLRender from '../components/htmlRender/RenderHtml';
import {ParamListBase} from '@react-navigation/native';
import {FONTS} from '../styles/typography';
import {useTheme} from '../hooks';

const Stack = createNativeStackNavigator<ParamListBase>();

function AuthNavigation() {
  const {colors} = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={ROUTES.onboard}>
      <Stack.Screen name={ROUTES.onboard} component={Onboarding} />
      <Stack.Screen name={ROUTES.login} component={Login} />
      <Stack.Screen name={ROUTES.signUp} component={SignUp} />
      <Stack.Screen name={ROUTES.forgotPassword} component={ForgotPassword} />
      <Stack.Screen name={ROUTES.otp} component={OTP} />
      <Stack.Screen name={ROUTES.selectBusiness} component={SelectBusiness} />
      <Stack.Screen name={ROUTES.businessDetails} component={BusinessDetails} />
      <Stack.Screen name={ROUTES.businessInfo} component={BusinessInfo} />
      <Stack.Screen
        name={ROUTES.htmlRender}
        component={HTMLRender}
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 18,
            fontFamily: FONTS.regular,
            color: colors.white,
          },
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
        }}
      />
    </Stack.Navigator>
  );
}

export default AuthNavigation;
