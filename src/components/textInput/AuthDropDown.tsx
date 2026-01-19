import React, {useEffect, useState} from 'react';
import {
  View,
  Pressable,
  ViewStyle,
  FlatList,
  TextStyle,
  ColorValue,
} from 'react-native';
import AppText from '../text/AppText';
import SvgIcon from '../../assets/svg';
import { useTheme } from '../../hooks';
import { clone, remove } from 'lodash';
import EmptyView from '../empty/EmptyView';
import { openModal } from '../../helpers/utils';
import { MODALS } from '../../constants/routeConstant';
import { useAppTextInputStyle } from './AppTextInputStyle';
import { SearchData } from '../../interfaces/searchAddressData';

interface props {
  value?: any;
  label?: string;
  item?: object[] | undefined;
  address?: boolean;
  isShowButton?: boolean;
  style?: ViewStyle;
  required?: boolean;
  labelField?: string;
  placeholder?: string;
  error?: string | undefined;
  iconColor?: ColorValue;
  titleStyle?: TextStyle;
  rightIconStyle?: ViewStyle;
  onChange?: (item: object) => void;
  onSubmitPress?: (item: any) => void;
  type?: 'radio' | 'check' | undefined;
  // eslint-disable-next-line prettier/prettier
  icon: keyof typeof SvgIcon | React.JSX.Element;
}

const ICON_SIZE = 22;

const AuthDropDown = ({
  icon,
  type,
  item,
  error,
  style,
  label,
  value,
  address,
  onChange,
  required,
  labelField,
  placeholder,
  onSubmitPress,
  isShowButton,
  titleStyle,
  iconColor,
  rightIconStyle,
}: props) => {

  const [isFocused] = useState(false);
  const styles = useAppTextInputStyle({isFocus: isFocused});
  const {colors} = useTheme();
  const Svg = typeof (icon) === 'string' ? SvgIcon[icon] : null;
  const [data, setData] = useState<any>(value);

  const handleCheck = (items: any) => {
    const cloneData = clone(value);
    const removeData: any = remove(cloneData, (i: any)=> items?.id !== i);
    onChange?.(removeData);
  };

  const renderItems = ({item: renderItem}: {item?: SearchData | any}) => {
    return (
      type === 'check' ?
        <Pressable
          onPress={() => {
            handleCheck(renderItem);
          }}
          style={styles.item}>
          <View style={styles.titleContainer}>
            <AppText numberOfLines={1} style={[styles.title, titleStyle]}>{renderItem?.[`${labelField}`]}</AppText>
          </View>
          <Pressable style={styles.cancelIconContainer}
            onPress={()=> {
              handleCheck(renderItem);
            }}>
            <SvgIcon.clearIcon
              height={5}
              width={5}
              fill={colors.white} />
          </Pressable>
        </Pressable>
        : <View style={styles.labelContainer}>
            <AppText
              numberOfLines={1}
              style={[styles.valueText, titleStyle]}>
              {renderItem?.[`${labelField}`]}
            </AppText>
          </View>
      );
  };


    useEffect(()=> {
      if (typeof (value) === 'number'){
        const cloneData = item && item?.filter((i: any)=> i?.id === value);
        setData(cloneData);
      }
      if (Array.isArray(value)){
        const arrayData = item && item?.filter((i: any) =>
          (value.length !== 0 && value?.includes(i?.id)));
          setData(arrayData);
      } else
      if (typeof (value) === 'string'){
          const stringData: object = [{
            [`${labelField}`]: value,
          }];
          setData(stringData);
      }
    },[item, labelField, value]);

  const onPress = () => {
    openModal(MODALS.bottomSheet, {
      type: type,
      item: item,
      value: value,
      address: address,
      onChange: onChange,
      nameKey: labelField,
      onSubmitPress: onSubmitPress,
      isShowButton: isShowButton,
    });
  };

  return (
    <>
      <View
        style={[
          styles.authDropDownContainer,
          isFocused && { borderColor: colors.primary },
          style,
          error ? styles.errorWrapper : {},
        ]}
      >
        {label ? (
          <AppText style={styles.authLabel}>
            {label}
            {required ? (
              <AppText style={[styles.label, styles.required]}>*</AppText>
            ) : null}
          </AppText>
        ) : null}
          <View style={styles.inputStyle}>
          <Pressable
          style={styles.valueContainer}
          onPress={onPress}>
            <FlatList
              data={data}
              renderItem={renderItems}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              numColumns={1}
              ListEmptyComponent={
                <EmptyView
                  emptyText={placeholder}
                  textStyle={styles.noDataText}
                  containerStyle={styles.noDataContainer}/>
                }
              contentContainerStyle={styles.flatListContainer}
            />
          </Pressable>
        </View>
            <Pressable style={[styles.rightIcon, rightIconStyle]} onPress={onPress}>
            {typeof (icon) === 'string' && Svg ? ( <Svg
                fill={iconColor ? iconColor : colors.gray}
                width={ICON_SIZE}
                height={ICON_SIZE}
              /> ) : icon}
            </Pressable>
      </View>
      {error && <AppText style={styles.error}>{error}</AppText>}
    </>
  );
};

export default AuthDropDown;
