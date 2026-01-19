import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../screens/appScreens/Home';
import Details from '../screens/appScreens/Details';
import ChangePassword from '../screens/appScreens/ChangePassword';
import Profile from '../screens/appScreens/Profile';
import {ROUTES} from '../constants/routeConstant';
import {useTheme} from '../hooks';
import {FONTS} from '../styles';
import AddDocuments from '../screens/appScreens/AddDocuments';
import DocumentList from '../screens/appScreens/DocumentList';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import SelectBusiness from '../screens/authScreens/SelectBusiness';

const Stack = createNativeStackNavigator();

const AppNavigation: React.FC = () => {
  const {colors} = useTheme();
  const businessList = useSelector(
    (state: RootState) => state.auths.businessList,
  );
  const listLength = businessList?.length > 1;
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerBackButtonDisplayMode: 'minimal',
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
      initialRouteName={listLength ? ROUTES.selectBusiness : ROUTES.home}>
      {!!listLength && (
        <Stack.Screen
          name={ROUTES.selectBusiness}
          component={SelectBusiness}
          options={{
            headerShown: false,
          }}
        />
      )}
      <Stack.Screen
        name={ROUTES.home}
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        options={{
          headerBackVisible: false,
        }}
        name={ROUTES.details}
        component={Details}
      />
      <Stack.Screen name={ROUTES.profile} component={Profile} />
      <Stack.Screen name={ROUTES.addDocuments} component={AddDocuments} />
      <Stack.Screen name={ROUTES.documentList} component={DocumentList} />
      <Stack.Screen name={ROUTES.changePassword} component={ChangePassword} />
    </Stack.Navigator>
  );
};

export default AppNavigation;
