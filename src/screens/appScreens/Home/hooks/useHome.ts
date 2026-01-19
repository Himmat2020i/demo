import { useHomeStyle } from "../styles";
import { RootState } from "../../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { MODALS, ROUTES } from "../../../../constants/routeConstant";
import { useCallback, useEffect, useRef, useState } from "react";
import { logoutAction } from "../../../../redux/auth/authAction";
import { navigate, replace } from "../../../../navigation/rootNavigation";
import {
  deleteAllData,
  getBusinessListDb,
  getSelectedBusinessScheme,
  storeDataInRedux,
} from "../../../../redux/auth/authSlice";
import {
  CHANGE_PASSWORD,
  COMMON_STRING,
  SWITCH_BUSINESS,
} from "../../../../constants/stringConstant";
import { closeModal, openModal, showToaster } from "../../../../helpers/utils";
import { useDeleteUserMutation } from "../../../../services/authService";

const useHome = () => {
  const iconRef = useRef(null);
  const dispatch = useDispatch();
  const { styles, colors } = useHomeStyle();
  const navigation = useNavigation<any>();
  const [isShowModal, setIsShowModal] = useState(false);
  const [deleteUser] = useDeleteUserMutation();

  const { schemeList, user, businessList } = useSelector(
    (state: { auths: RootState }) => state.auths
  );

  const onEditPress = () => {
    return navigation.navigate(ROUTES.profile);
  };

  const onDocumentMonitor = () => {
    return navigation.navigate(ROUTES.documentList);
  };

  const popUp = () => {
    setIsShowModal(true);
  };

  const onItemSelect = (id: number) => {
    if (id === 0) {
      dispatch(getSelectedBusinessScheme(user?.idOrganisation));
      dispatch(getBusinessListDb());
      setTimeout(() => {
        navigate(ROUTES.selectBusiness);
      }, 100);
    } else if (id === 1) {
      navigate(ROUTES.changePassword);
    } else if (id === 3) {
      openModal(MODALS.confirmation, {
        subTitle: `Are you sure you want to delete your account? You will not be able to login again if you choose to delete your account?`,
        title: "Alert",
        onPressCancel: () => closeModal(MODALS.confirmation),
        onPressConfirm: () => onConfirmModal(),
      });
    } else {
      dispatch(deleteAllData());
      dispatch(logoutAction());
      setTimeout(() => {
        replace(ROUTES.auth);
      }, 100);
    }
  };
  const onConfirmModal = () => {
    closeModal(MODALS.confirmation);
    setTimeout(() => {
      openModal(MODALS.reasonTextInput, {
        subTitle: "",
        title: "Alert",
        onPressCancel: () => closeModal(MODALS.reasonTextInput),
        onPressConfirm: async (reason: string) => {
          const params = {
            email: user?.emailAddress,
            reason: reason,
          };
          deleteUser(params).then((res) => {
            if (res?.data?.statusCode === 200) {
              showToaster(res.data.message, 'S');
              dispatch(deleteAllData());
              dispatch(logoutAction());
              setTimeout(() => {
                replace(ROUTES.auth);
              }, 100);
            }
          });
        },
      });
    }, 500);
  };
  const getUserName = useCallback(
    (type?: "short" | "long") => {
      var firstName: string = user?.firstName || "";
      var lastName: string = user?.lastName || "";
      const firstNameLatter: string =
        firstName && firstName.charAt(0).toUpperCase();
      const lastNameLatter: string =
        lastName && lastName.charAt(0).toUpperCase();
      return type === "short"
        ? firstNameLatter + lastNameLatter
        : firstNameLatter +
            firstName.slice(1) +
            " " +
            lastNameLatter +
            lastName.slice(1);
    },
    [user]
  );

  const getSchemeList = () => {
    const baseOptions = [
      {
        id: 1,
        name: CHANGE_PASSWORD.label,
        icon: "changePass",
      },
      {
        id: 2,
        name: COMMON_STRING.logout,
        icon: "logout",
      },
      {
        id: 3,
        name: COMMON_STRING.delAccount,
        icon: "deleteAccount",
      },
    ];

    if (businessList.length > 1) {
      return [
        {
          id: 0,
          name: SWITCH_BUSINESS.label,
          icon: "switchBusiness",
        },
        ...baseOptions,
      ];
    } else {
      return baseOptions;
    }
  };

  useEffect(() => {
    dispatch(storeDataInRedux());
  }, [dispatch]);

  return {
    user,
    popUp,
    styles,
    colors,
    iconRef,
    dispatch,
    schemeList,
    onEditPress,
    getUserName,
    isShowModal,
    onItemSelect,
    setIsShowModal,
    onDocumentMonitor,
    getSchemeList,
  };
};

export default useHome;
