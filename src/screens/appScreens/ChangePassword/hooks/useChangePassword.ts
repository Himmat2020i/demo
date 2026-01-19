import {Controller, useForm} from 'react-hook-form';
import {changePasswordFormSchema} from '../../../../helpers/yupHelper';
import {useChangePasswordMutation} from '../../../../services/appServices';
import {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {showToaster} from '../../../../helpers/utils';
import {ChangePasswordParams} from '../../../../interfaces/authInterface/changePassword';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../redux/store';

const useChangePassword = () => {
  const navigation = useNavigation();
  const [changePassword, {data: changePasswordResponse}] =
    useChangePasswordMutation();
  const {user} = useSelector((state: {auths: RootState}) => state.auths);

  const {handleSubmit, control, getValues} = useForm<any, any>({
    resolver: changePasswordFormSchema,
    mode: 'onBlur',
  });

  const onPress = () => {
    const changePasswordParams: ChangePasswordParams = {
      IdUser: user?.idUser,
      ...getValues(),
    };
    changePassword(changePasswordParams);
  };

  useEffect(() => {
    if (changePasswordResponse?.statusCode === 200) {
      showToaster(changePasswordResponse.message, 'S');
      navigation.goBack();
    }
  }, [changePasswordResponse, navigation]);

  return {
    Controller,
    control,
    onPress,
    handleSubmit,
  };
};

export default useChangePassword;
