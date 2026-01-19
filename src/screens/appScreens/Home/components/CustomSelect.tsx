import React, {useCallback, useEffect, useState} from 'react';
import {Modal, View, TouchableOpacity, FlatList, Pressable} from 'react-native';
import AppText from '../../../../components/text/AppText';
import Svg from '../../../../assets/svg';
import {useHomeStyle} from '../styles';
import {ProfileOptions} from '../../../../interfaces/profileData';

interface CustomSelectProps {
  isVisible: boolean;
  onClose: () => void;
  iconRef: React.RefObject<TouchableOpacity>;
  onItemSelect: (sectionId: number) => void;
  selectArray: [];
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  isVisible,
  onClose,
  iconRef,
  onItemSelect,
  selectArray,
}) => {
  const {styles} = useHomeStyle();
  const [iconPosition, setIconPosition] = useState({top: 0, right: 0});

  const measureIcon = useCallback(() => {
    if (iconRef.current) {
      iconRef.current.measure(py => {
        setIconPosition({
          top: 35,
          right: 25,
        });
      });
    }
  }, [iconRef]);

  useEffect(() => {
    if (isVisible) {
      requestAnimationFrame(() => {
        measureIcon();
      });
    }
  }, [isVisible, iconRef, measureIcon]);

  const handleQuestionSelect = (item: ProfileOptions) => {
    onClose();
    onItemSelect(item?.id);
  };

  const renderItem = ({item}: {item: ProfileOptions}) => {
    const SvgIcon = Svg?.[item?.icon];
    return (
      <TouchableOpacity
        onPress={() => {
          handleQuestionSelect(item);
        }}
        style={styles.itemContainer}>
        <SvgIcon height={18} width={18} />
        <AppText style={styles.renderText}>{item?.name}</AppText>
      </TouchableOpacity>
    );
  };

  const renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <Pressable onPress={onClose} style={styles.modalContainer}>
        <View
          style={[
            styles.modalContent,
            {
              top: iconPosition.top,
              right: iconPosition.right,
            },
          ]}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={selectArray}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            ItemSeparatorComponent={renderSeparator}
          />
          <View style={styles.triangle} />
        </View>
      </Pressable>
    </Modal>
  );
};

export default CustomSelect;
