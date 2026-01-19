import {useCallback, useEffect} from 'react';
import {useForgotPasswordStyle} from '../styles';
import {Controller, useForm} from 'react-hook-form';
import {showToaster} from '../../../../helpers/utils';
import {useNavigation} from '@react-navigation/native';
import {forgotPassSchema} from '../../../../helpers/yupHelper';
import {useForgotPasswordMutation} from '../../../../services/authService';

const useForgotPassword = () => {
  const navigation = useNavigation<any>();
  const [forgotPassword, {data}] = useForgotPasswordMutation();
  const {styles, colors} = useForgotPasswordStyle();
  const {handleSubmit, control, getValues} = useForm<any, any>({
    resolver: forgotPassSchema,
    mode: 'onBlur',
    defaultValues: {
      email: '',
    },
  });

  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  useEffect(() => {
    if (data?.statusCode === 200) {
      showToaster(data?.message, 'S');
      goBack();
    }
  }, [data, goBack]);

  const onSubmitPress = () => {
    const email = getValues?.()?.email;
    if (!email) {
      return;
    } else {
      forgotPassword(getValues());
    }
  };

  return {
    goBack,
    styles,
    colors,
    control,
    Controller,
    handleSubmit,
    onSubmitPress,
  };
};

export default useForgotPassword;
