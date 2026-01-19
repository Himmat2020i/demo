import React from 'react';
import {Modal, Pressable, View, StyleSheet} from 'react-native';

interface SimpleModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const SimpleModal: React.FC<SimpleModalProps> = ({
  visible,
  onClose,
  children,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <Pressable onPress={onClose} style={styles.press}>
        <View style={styles.viewQHelper}>{children}</View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  qHelperText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
  },
  press: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  viewQHelper: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    elevation: 5,
  },
});

export default SimpleModal;
