import React, {
  createContext,
  createRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { ModalProvider } from "react-native-modalfy";
import Toaster from "../components/toaster/Toaster";
import ModalStack from "../routes/ModalStack";
import { storeData, getData } from "../helpers/localstorage";
import { ASYNC_STORE_VAR } from "../constants/constants";
import { useNetInfo } from "@react-native-community/netinfo";
import LoadingIndicator from "../components/loader/LoadingIndicator";
import { MenuProvider } from "react-native-popup-menu";
import useCreateApi from "../screens/appScreens/Details/hook/useCreateApi";
import { getAllData } from "../../Database";
import { Answer } from "../screens/appScreens/Details/DataModal";
import { useSelector } from "react-redux";
import { checkVersion } from "../services/OTAService";

export const AppContext = createContext({} as any);

export const AppProvider = ({ children }: any) => {
  const toasterRef = createRef<any>();
  const actionToasterRef = createRef<any>();
  const loaderRef = createRef<any>();
  const { isConnected } = useNetInfo();
  const [theme, setThemeMode] = useState("light");
  const createAnswerApi = useCreateApi();
  const user = useSelector((state) => state.auths?.user);
  const { idOrganisation } = user;

  useEffect(() => {
    checkVersion();
    getTheme();
  }, []);

  const getTheme = async () => {
    const themeMode = await getData(ASYNC_STORE_VAR.themeMode);
    if (themeMode !== undefined && themeMode !== null) {
      setThemeMode(themeMode);
    } else {
      await storeData(ASYNC_STORE_VAR.themeMode, "light");
    }
  };

  const onInternetAvail = useCallback(async () => {
    const getAlAns = await getAllData("answers");
    let apiResponse = getAlAns?.filter((ans: Answer) => ans.isTableUpdate);
    if (apiResponse?.length > 0) {
      await createAnswerApi();
    }
  }, [createAnswerApi, idOrganisation]);

  useEffect(() => {
    if (isConnected === true) {
      onInternetAvail();
    }
  }, [isConnected]);

  const showToaster = (args: Object) => {
    toasterRef.current.showToaster(args);
  };

  const showAppLoader = () => {
    loaderRef.current.showAppLoader();
  };

  const hideAppLoader = () => {
    loaderRef.current.hideAppLoader();
  };

  const showActionToaster = (args: Object) => {
    actionToasterRef.current.showToaster(args);
  };

  const setTheme = async (mode: string) => {
    setThemeMode(mode);
    await storeData(ASYNC_STORE_VAR.themeMode, mode);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        showToaster,
        showActionToaster,
        hideAppLoader,
        showAppLoader,
      }}
    >
      <MenuProvider>
        <ModalProvider stack={ModalStack}>{children}</ModalProvider>
      </MenuProvider>
      <Toaster ref={toasterRef} theme={theme} />
      <LoadingIndicator ref={loaderRef} theme={theme} />
    </AppContext.Provider>
  );
};
