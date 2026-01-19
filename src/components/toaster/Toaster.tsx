import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {Animated, Easing, TouchableOpacity, View, Platform} from 'react-native';
import SVGIcon from '../../assets/svg';

import {ToastTitleInterface, ToastIconInterface} from '../../interfaces/toast';
import {THEMES} from '../../styles';
import {createStyles} from './ToasterStyle';
import AppText from '../text/AppText';
import {useKeyboard} from '../../hooks/useKeyboard';
const toastTitle: ToastTitleInterface = {
  E: 'FAILED',
  S: 'SUCCESS',
};

const toastIcon: ToastIconInterface = {
  E: SVGIcon.errorToastIcon,
  S: SVGIcon.successToastIcon,
};

const initialToast = {
  title: '',
  message: '',
  type: null,
  visible: false,
};

export const Toaster = (props: any, ref: React.Ref<unknown> | undefined) => {
  const colors = THEMES[props.theme].colors;
  const translateYRef = useRef(new Animated.Value(120));
  const [toast, setToast] = useState(initialToast);
  const timeout = useRef<any>();
  const {keyboardHeight, keyboardShown} = useKeyboard();
  const TOAST_TITLE = toast.title
    ? toast.title
    : toast.type
    ? toastTitle[toast.type]
    : null;
  const TOAST_ICON: any = toast.type ? toastIcon[toast.type] : null;
  const TOAST_COLOR =
    toast.type === 'E' ? colors.toastError : colors.toastSuccess;
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  useImperativeHandle(ref, () => ({
    showToaster: showToaster,
  }));

  const showToaster = useCallback(
    (args: any) => {
      setToast({...initialToast, visible: true, ...args});
      showToast();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [keyboardHeight, keyboardShown],
  );

  const hideToaster = useCallback(() => {
    setToast({...initialToast, type: toast.type});
    hideToast();
  }, [toast]);

  useEffect(() => {
    if (toast.visible) {
      timeout.current = setTimeout(hideToaster, 5000);
      return () => {
        if (timeout.current) {
          clearTimeout(timeout.current);
        }
      };
    }
  }, [hideToaster, toast]);

  const showToast = () => {
    const toValue =
      keyboardShown && Platform.OS === 'ios' ? keyboardHeight + 50 : 100;
    Animated.timing(translateYRef.current, {
      duration: 300,
      easing: Easing.ease,
      toValue: -toValue,
      useNativeDriver: true,
    }).start();
  };

  const hideToast = () => {
    Animated.timing(translateYRef.current, {
      duration: 300,
      easing: Easing.ease,
      toValue: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.toast,
        {transform: [{translateY: translateYRef.current}]},
      ]}>
      <TouchableOpacity
        onPress={hideToaster}
        style={[
          styles.content,
          TOAST_COLOR ? {backgroundColor: TOAST_COLOR} : {},
        ]}
        activeOpacity={1}>
        {TOAST_ICON && <TOAST_ICON width={30} height={30} />}
        <View style={styles.toastMessageContainer}>
          <AppText style={styles.titleText}>{TOAST_TITLE || ''}</AppText>
          <AppText style={styles.messageText} numberOfLines={5}>
            {toast.message}
          </AppText>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default React.forwardRef(Toaster);
