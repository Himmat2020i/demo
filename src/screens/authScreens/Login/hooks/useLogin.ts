import { Controller, useForm } from "react-hook-form";
import { loginFormSchema } from "../../../../helpers/yupHelper";
import { useNavigation } from "@react-navigation/native";
import { ROUTES } from "../../../../constants/routeConstant";
import { useDispatch } from "react-redux";
import {
  useLazyBusinessInfoQuery,
  useLazyBusinessSchemeQuery,
  useLoginMutation,
  useSchemeRowDataMutation,
} from "../../../../services/authService";
import {
  useApplicationStatusandAnswerMutation,
  useUpdateUserInfoMutation,
} from "../../../../services/appServices";
import {
  checkInternetConnection,
  showToaster,
  startLoader,
  stopLoader,
} from "../../../../helpers/utils";
import {
  fetchBusinessDb,
  fetchBusinessSchemeDataDb,
  fetchSchemeAnswerAndStatus,
  fetchSchemeRowDataDb,
  getBusinessListDb,
} from "../../../../redux/auth/authSlice";
import { replace } from "../../../../navigation/rootNavigation";
import {
  permissions,
  prepareHandheldPayload,
} from "../../../../helpers/locationHelper";
import { useEffect, useState } from "react";
import * as Keychain from "react-native-keychain";
import { Alert } from "react-native";
import { ALERT, ONINTERNET } from "../../../../constants/stringConstant";

const useLogin = () => {
  const navigation = useNavigation<any>();
  const { handleSubmit, control, setValue, getValues } = useForm<any, any>({
    resolver: loginFormSchema,
    mode: 'onSubmit',
  });
  const [schemeData] = useSchemeRowDataMutation();
  const [statusAndAns] = useApplicationStatusandAnswerMutation();
  const dispatch = useDispatch();
  const [login] = useLoginMutation();
  const [businessListApi] = useLazyBusinessInfoQuery();
  const [businessSchemeListQuery] = useLazyBusinessSchemeQuery();
  const [updateUserInfo] = useUpdateUserInfoMutation();
  const [checkedSavedLogin, setCheckedSavedLogin] = useState(false);

  const fetchData = async () => {
    try {
      const { email, password } = getValues();

      if (!email || !password) {
        return;
      }

      const loginDetails = {
        email: email,
        password: password,
      };
      const checkNet = await checkInternetConnection();

      if (!checkNet) {
        showToaster(ONINTERNET, "E");

        return;
      }

      startLoader();

      const loginResponse = await login(loginDetails);

      const { statusCode, message } = loginResponse?.error?.data || {};
      if (statusCode === 404 || statusCode === 500) {
        showToaster(message || "", "E");
        stopLoader();
        return;
      }

      const idScheme = {
        idScheme: 4,
      };

      const schemeDataResponse = await schemeData(idScheme);
      const schemesRowData = schemeDataResponse?.data?.data;
      dispatch(fetchSchemeRowDataDb(schemesRowData));

      const { idUser, idOrganisation } = loginResponse.data.data;
      const params = await prepareHandheldPayload(idUser);
      await updateUserInfo(params);
      const businessListResponse = await businessListApi();
      const businessListData = businessListResponse?.data?.data;
      dispatch(fetchBusinessDb(businessListData));

      await Promise.all(
        businessListData
          ?.filter(
            (getSelectedBus) => getSelectedBus.idBusiness === idOrganisation
          )
          ?.map(async (business) => {
            try {
              const { idBusiness } = business;
              const businessSchemesResponse = await businessSchemeListQuery();
              const businessSchemesData = businessSchemesResponse?.data?.data;
              const payload = {
                idOrganisation: idOrganisation,
                businessSchemesData: businessSchemesData,
              };
              dispatch(fetchBusinessSchemeDataDb(payload));
              await Promise.all(
                businessSchemesData?.map(async () => {
                  const statusAndParams = {
                    idScheme: 4,
                    idOrganisation: idBusiness,
                    idUser: idUser,
                    ParmeterUrl: "",
                  };
                  const ansResp = await statusAndAns(statusAndParams);
                  const { answers, applicationStatus } = ansResp?.data?.data;

                  const answersWithSeparated = answers
                    ?.map((item) => {
                      if (
                        item?.answer?.startsWith("http") &&
                        item?.answer?.includes("|")
                      ) {
                        const urls = item.answer
                          .split("|")
                          .filter((url) => url);
                        return urls?.map((url) => ({
                          answer: url,
                          idQuestion: item.idQuestion,
                          idSection: item.idSection,
                          idApplicationStatus: item.idApplicationStatus,
                        }));
                      } else {
                        return {
                          answer: item.answer,
                          idQuestion: item.idQuestion,
                          idSection: item.idSection,
                          idApplicationStatus: item.idApplicationStatus,
                        };
                      }
                    })
                    .flat();

                  if (answersWithSeparated?.length > 0) {
                    const addKeyAnswer = await Promise.all(
                      answers?.map(async (item) => ({
                        ...item,
                        idBusiness: idBusiness,
                        isTableUpdate: false,
                      }))
                    );

                    const updateKey = {
                      answers: addKeyAnswer,
                      applicationStatus: applicationStatus,
                    };
                    dispatch(fetchSchemeAnswerAndStatus(updateKey));
                  }
                })
              );
            } catch (error) {
              console.error("Error fetching data:", error);
            }
          })
      );

      dispatch(getBusinessListDb());
      replace(ROUTES.app);
    } catch (error) {
      console.error("Error login:", error);
    } finally {
      stopLoader();
    }
  };

  const onLogin = () => {
    fetchData();
  };

  useEffect(() => {
    getPermissions();
    if (!checkedSavedLogin) {
      checkSavedLogin();
    }
  }, [checkedSavedLogin]);

  const checkSavedLogin = async () => {
    try {
      const credentials = await getSavedLoginDetails();
      if (credentials.email && credentials.password) {
        setValue("email", credentials.email);
        setValue("password", credentials.password);
      }
      setCheckedSavedLogin(true);
    } catch (error) {
      console.error("Error retrieving saved login details:", error);
    }
  };

  const getSavedLoginDetails = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        return { email: credentials.username, password: credentials.password };
      } else {
        return { email: null, password: null };
      }
    } catch (error) {
      console.error("Error retrieving login details:", error);
      return { email: null, password: null };
    }
  };

  const onForgotPassPress = () => navigation.navigate(ROUTES.forgotPassword);
  const onSignUpPress = () => navigation.navigate(ROUTES.signUp);

  const getPermissions = async () => {
    await permissions();
  };

  const saveLoginDetails = async (cancel) => {
    const { email, password } = getValues();
    if (cancel === "c") {
      await Keychain.setGenericPassword("", "");
    } else {
      await Keychain.setGenericPassword(email, password);
    }
  };

  const handleLoginSubmit = async () => {
    const credentials = await Keychain.getGenericPassword();
    const { email, password } = getValues();
    if (credentials.username !== email || credentials.password !== password) {
      Alert.alert(
        ALERT.saveLogin,
        ALERT.doWantSave,
        [
          {
            text: ALERT.cancel,
            onPress: () => {
              onLogin();
              saveLoginDetails("c");
            },
            style: "cancel",
          },
          {
            text: ALERT.save,
            onPress: () => {
              saveLoginDetails("");
              onLogin();
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      onLogin();
    }
  };

  return {
    onLogin,
    control,
    Controller,
    navigation,
    handleSubmit,
    onSignUpPress,
    onForgotPassPress,
    getPermissions,
    handleLoginSubmit,
  };
};
export default useLogin;
