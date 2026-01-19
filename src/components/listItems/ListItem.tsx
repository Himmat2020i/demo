import React from 'react';
import {View, Pressable, TextStyle, ViewStyle, ColorValue} from 'react-native';
import Svg from '../../assets/svg';
import AppText from '../text/AppText';
import {useListItemStyle} from './ListItemStyle';

interface Props {
  item: any;
  size?: number;
  nameKey: string;
  address?: boolean;
  style?: ViewStyle;
  otherText?: string;
  isSelected: boolean;
  checkStyle?: ViewStyle;
  isShowButton?: boolean;
  checkColor?: ColorValue;
  onTextPress?: () => void;
  itemTextStyle?: TextStyle;
  onCheckPress?: (item: any) => void;
  type: 'check' | 'radio' | undefined;
  onEditPress?: (item: object) => void;
  onDeletePress?: (id: number) => void;
  setSelectedId: (item: object) => void;
  isRequired?: boolean;
}

const ListItem = React.memo(
  ({
    size,
    item,
    type,
    style,
    nameKey,
    otherText,
    isSelected,
    checkStyle,
    checkColor,
    onEditPress,
    onTextPress,
    onDeletePress,
    itemTextStyle,
    setSelectedId,
    address = false,
    isRequired,
  }: Props) => {
    const {styles, colors} = useListItemStyle({
      size: size,
      isSelect: isSelected,
      type: type,
    });

    const width = size ? size / 1.5 : 10;
    const height = size ? size / 1.5 : 10;

    return (
      <Pressable
        style={[styles.list, style]}
        onPress={() => {
          type === 'radio' ? setSelectedId?.(item) : setSelectedId?.(item);
        }}>
        <View style={styles.itemContainer}>
          {!address && (
            <View
              style={
                type === 'radio'
                  ? styles.itemIconContainer
                  : [styles.checkContainer, checkStyle]
              }>
              {isSelected &&
                (type === 'radio' ? (
                  <View style={styles.iconSubContainer} />
                ) : (
                  <Svg.checkIcon
                    width={width}
                    height={height}
                    fill={checkColor ? checkColor : colors.white}
                  />
                ))}
            </View>
          )}
          <Pressable
            onPress={onTextPress ? onTextPress : () => setSelectedId?.(item)}
            style={styles.titleContainer}>
              <AppText style={styles.itemText}>
                <AppText style={[styles.itemText, itemTextStyle]}>
                  {address ? `${otherText || ''}` : `${item?.[nameKey] || ''}`}
                </AppText>
                {isRequired ? <AppText style={styles.required}>*</AppText> : <></>}
            </AppText>
          </Pressable>
        </View>
        <View style={styles.row}>
          {address && (
            <Pressable
              style={styles.iconContainer}
              onPress={() => onEditPress?.(item)}>
              <Svg.addressIcon fill={colors.gray} width={18} />
            </Pressable>
          )}
          {onEditPress && (
            <Pressable
              style={styles.iconContainer}
              onPress={() => onEditPress?.(item)}>
              <Svg.editIcon fill={colors.gray} width={18} />
            </Pressable>
          )}
          {onDeletePress && (
            <Pressable
              style={styles.iconContainer}
              onPress={() => onDeletePress?.(item?.id)}>
              <Svg.deleteIcon fill={colors.gray} width={18} />
            </Pressable>
          )}
        </View>
      </Pressable>
    );
  },
);

export default ListItem;
