import React, { useCallback, useState } from 'react';
import {
  View,
  FlatList,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import Svg from '../../../assets/svg';
import EmptyView from '../../empty/EmptyView';
import ListItem from '../../listItems/ListItem';
import {closeModal} from '../../../helpers/utils';
import useBottomSheet from './hooks/useBottomSheet';
import AppTextInput from '../../textInput/AppTextInput';
import {MODALS} from '../../../constants/routeConstant';
import { SEARCH } from '../../../constants/stringConstant';
import FooterButton from '../../footerButton/FooterButton';
import { SearchData } from '../../../interfaces/searchAddressData';
import {ModalfyParams, UsableModalComponentProp} from 'react-native-modalfy';

interface Props {
  // eslint-disable-next-line prettier/prettier
  modal: UsableModalComponentProp<ModalfyParams, keyof ModalfyParams>;
}
const BottomSheet: React.FC<Props> = ({ modal }) => {
  const {
    data,
    type,
    styles,
    colors,
    nameKey,
    address,
    selectId,
    selectItems,
    isShowButton = false,
    onPressConfirm,
    onSelectPress,
    isFetching,
    isLoading,
    onSearchAddress,
    inputRef,
    searchValue,
  } = useBottomSheet({modal: modal});

  const renderItem = ({item}: {item: any}) => {
    const isSelect: boolean = item?.id === selectId;
    const address1: Array<SearchData> = [item?.FlatNumber, item?.Address1, item?.Address2, item?.City, item?.PostalCode];

    const addressValue: string = address1.filter(Boolean).join(', ');

    return (
      <ListItem
        isSelected={
          type === 'radio'
          ? isSelect
          : selectItems.includes(item?.id)
        }
        item={item}
        address={address}
        setSelectedId={onSelectPress}
        nameKey={nameKey}
        otherText={addressValue.trim() || ''}
        type={type}
        size={18}
      />
    );
  };

  const renderEmpty = useCallback(()=> {
    return (
      isLoading || isFetching || searchValue?.replaceAll?.(' ', '')?.length < 5
      ? <></>
      : <EmptyView />
    );
  },[isFetching, isLoading, searchValue]);

  return (
    <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === 'ios'
          ? 'padding'
          : 'height'
        }
      >
      <View style={styles.inputContainer}>
      <AppTextInput
        inputRef={inputRef}
        placeholder={address ? SEARCH.address : SEARCH.search}
        icon={
          <Svg.searchIcon fill={colors.primary} />
        }
        autoCapitalize={'sentences'}
        style={styles.input}
        textStyle={styles.inputText}
        onChangeText={onSearchAddress}
      />
      </View>
      {(!isLoading && !isFetching) ? <FlatList
        data={data}
        numColumns={1}
        nestedScrollEnabled
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading || isFetching}
        keyExtractor={(item: SearchData | any, index: number) => address ? index : item?.id}
      /> :
      <ActivityIndicator color={colors.gray} />}
      <View style={styles.footer}>
        {isShowButton && (
          <FooterButton
            cancelLabel="Cancel"
            confirmLabel="Confirm"
            onPressConfirm={onPressConfirm}
            onPressCancel={() => closeModal(MODALS.bottomSheet)}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default BottomSheet;
