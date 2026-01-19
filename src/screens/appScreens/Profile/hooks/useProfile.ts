import {
  useLazyGetProfileQuery,
  useUpdateProfileMutation,
} from "../../../../services/appServices";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useProfileStyle } from "../styles";
import { RootState } from "../../../../redux/store";
import { useForm, Controller } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { ProfileData } from "../../../../interfaces/profileData";
import { profileFormSchema } from "../../../../helpers/yupHelper";
import { ProfileUpdate } from "../../../../constants/stringConstant";
import { ASYNC_STORE_VAR } from "../../../../constants/constants";
import { storeData } from "../../../../helpers/localstorage";
import { setUser } from "../../../../redux/auth/authSlice";
import {
  showToaster,
  startLoader,
  stopLoader,
} from "../../../../helpers/utils";

const useProfile = () => {
  const navigation = useNavigation<any>();
  const { styles, colors } = useProfileStyle();
  const [getProfileUpdata, { data: profileData }] = useLazyGetProfileQuery();
  const [updateProfile, { data: updateData }] = useUpdateProfileMutation();
  const dispatch = useDispatch();
  const user = useSelector((state: { auths: RootState }) => state.auths?.user);

  const { control, formState, setValue, getValues, handleSubmit } = useForm<
    any,
    any
  >({
    resolver: profileFormSchema,
    mode: "onBlur",
    defaultValues: {
      title: "",
      lastName: "",
      firstName: "",
      telephone: "",
      emailAddress: "",
    },
  });

  const onPress = async () => {
    if (getValues().telephone === "") return;
    startLoader();
    const getData: ProfileData = {
      idUser: user?.idUser,
      ...getValues(),
    };
    const userData = {
      ...user,
      ...getValues(),
    };
    await storeData(ASYNC_STORE_VAR.user, userData);
    dispatch(setUser(userData));
    stopLoader();

    updateProfile(getData);
  };

  useEffect(() => {
    getProfileUpdata();
  }, [getProfileUpdata]);

  useEffect(() => {
    if (profileData?.data) {
      setValue("title", profileData?.data?.userTitle || "");
      setValue("firstName", profileData?.data?.firstName || "");
      setValue("lastName", profileData?.data?.lastName || "");
      setValue("emailAddress", profileData?.data?.emailAddress || "");
      setValue("telephone", profileData?.data?.telephone || "");
    }
  }, [profileData, setValue]);

  useEffect(() => {
    if (updateData?.statusCode === 200) {
      showToaster(ProfileUpdate.message, "S");
      navigation.goBack();
    }
  }, [navigation, updateData]);

  return {
    styles,
    colors,
    onPress,
    control,
    setValue,
    formState,
    getValues,
    Controller,
    navigation,
    handleSubmit,
  };
};

export default useProfile;
