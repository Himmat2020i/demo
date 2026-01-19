import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../../../constants/routeConstant';

const useSelectBusiness = () => {
  const navigation = useNavigation<any>();
  const onBack = () => {
    navigation.goBack();
  };
  const onOTPVerify = () => {
    navigation.navigate(ROUTES.otp);
  };

  return {
    onBack,
    onOTPVerify,
    navigation,
  };
};
export default useSelectBusiness;
