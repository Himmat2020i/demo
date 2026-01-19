import { createModalStack, ModalStackConfig } from "react-native-modalfy";
import NetworkWarningModal from "../components/modals/networkWarning/NetworkWarning";
import { MODALS } from "../constants/routeConstant";
import ConfirmationModal from "../components/modals/confirmation/Confirmation";
import BottomSheet from "../components/modals/bottomSheet/BottomSheet";
import { Dimensions, Easing } from "react-native";
import ReasonTextInput from "../components/modals/reasonTextInput/ReasonTextInput";
const { height } = Dimensions.get("screen");

const modalConfig: ModalStackConfig = {
  [MODALS.network]: {
    modal: NetworkWarningModal,
    backBehavior: "none",
  },
  [MODALS.confirmation]: {
    modal: ConfirmationModal,
    backBehavior: "none",
  },
  [MODALS.reasonTextInput]: {
    modal: ReasonTextInput,
    backBehavior: "none",
  },
  [MODALS.bottomSheet]: {
    modal: BottomSheet,
    position: "bottom",
    animateOutConfig: {
      easing: Easing.inOut(Easing.exp),
      duration: 500,
    },
    transitionOptions: (animatedValue: any) => ({
      transform: [
        {
          translateY: animatedValue.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [height, 0, height],
          }),
        },
      ],
    }),
  },
};
const defaultOptions = {
  backdropOpacity: 0.6,

  disableFlingGesture: true,
  animateInConfig: {
    easing: Easing.inOut(Easing.exp),
    duration: 1000,
  },
  animateOutConfig: {
    easing: Easing.inOut(Easing.exp),
    duration: 0,
  },
};

export default createModalStack(modalConfig, defaultOptions);
