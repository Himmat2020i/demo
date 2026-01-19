import {useEffect, useState, useRef} from 'react';
import {Keyboard, KeyboardEventListener, ScreenRect} from 'react-native';

const emptyCoordinates = Object.freeze({
  screenX: 0,
  screenY: 0,
  width: 0,
  height: 0,
});
const initialValue = {
  start: emptyCoordinates,
  end: emptyCoordinates,
};

export function useKeyboard() {
  const [shown, setShown] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    start: undefined | ScreenRect,
    end: ScreenRect,
  }>(initialValue);
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

  const handleKeyboardWillShow: KeyboardEventListener = e => {
    setCoordinates({start: e.startCoordinates, end: e.endCoordinates});
  };
  const handleKeyboardWillShowRefFn = useRef(handleKeyboardWillShow);
  handleKeyboardWillShowRefFn.current = handleKeyboardWillShow;

  const handleKeyboardDidShow: KeyboardEventListener = e => {
    setShown(true);
    setCoordinates({start: e.startCoordinates, end: e.endCoordinates});
    setKeyboardHeight(e.endCoordinates.height);
  };
  const handleKeyboardDidShowRefFn = useRef(handleKeyboardDidShow);
  handleKeyboardDidShowRefFn.current = handleKeyboardDidShow;

  const handleKeyboardWillHide: KeyboardEventListener = e => {
    setCoordinates({start: e.startCoordinates, end: e.endCoordinates});
    setKeyboardHeight(0);
  };
  const handleKeyboardWillHideRefFn = useRef(handleKeyboardWillHide);
  handleKeyboardWillHideRefFn.current = handleKeyboardWillHide;

  const handleKeyboardDidHide: KeyboardEventListener = e => {
    setShown(false);
    setKeyboardHeight(0);
    if (e) {
      setCoordinates({start: e.startCoordinates, end: e.endCoordinates});
    } else {
      setCoordinates(initialValue);
    }
  };
  const handleKeyboardDidHideRefFn = useRef(handleKeyboardDidHide);
  handleKeyboardDidHideRefFn.current = handleKeyboardDidHide;

  useEffect(() => {
    const subscriptions = [
      Keyboard.addListener(
        'keyboardWillShow',
        handleKeyboardWillShowRefFn.current,
      ),
      Keyboard.addListener(
        'keyboardDidShow',
        handleKeyboardDidShowRefFn.current,
      ),
      Keyboard.addListener(
        'keyboardWillHide',
        handleKeyboardWillHideRefFn.current,
      ),
      Keyboard.addListener(
        'keyboardDidHide',
        handleKeyboardDidHideRefFn.current,
      ),
    ];

    return () => {
      subscriptions.forEach(subscription => subscription.remove());
    };
  }, []);
  return {
    keyboardShown: shown,
    coordinates,
    keyboardHeight,
  };
}
