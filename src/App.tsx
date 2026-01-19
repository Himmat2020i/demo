// app start 22 Nov 2023
import React, { useEffect } from "react";
import { StatusBar, StyleSheet } from "react-native";
import { AppContext, AppProvider } from "./context/AppContext";
import store from "./redux/store";
import { Provider } from "react-redux";
import "react-native-gesture-handler";
import Routes from "./routes/Routes";
import "./helpers/api";
import { DEFAULT_COLORS } from "./styles";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import crashlytics from "@react-native-firebase/crashlytics";
import "./helpers/TextWithDefaultProps";
import { AppEventsLogger } from 'react-native-fbsdk-next';

crashlytics().setCrashlyticsCollectionEnabled(true);
const originalErrorHandler = (global as any).ErrorUtils.getGlobalHandler();
(global as any).ErrorUtils.setGlobalHandler(
  (error: Error, isFatal: boolean) => {
    crashlytics().recordError(error);
    originalErrorHandler(error, isFatal);
  }
);

const globalProps: any = global;

const App = () => {

  useEffect(() => {
    AppEventsLogger.logEvent('fb_mobile_activate_app');
  }, []);

  return (
    <GestureHandlerRootView style={styles.rootContainer}>
      <StatusBar hidden={true} />
      <SafeAreaProvider>
        <Provider store={store}>
          <AppProvider>
            <AppContext.Consumer>
              {(func) => {
                globalProps.props = func;
                return (
                  <>
                    <Routes />
                  </>
                );
              }}
            </AppContext.Consumer>
          </AppProvider>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DEFAULT_COLORS.white,
  },
  rootContainer: {
    flex: 1,
  },
});

export default App;
