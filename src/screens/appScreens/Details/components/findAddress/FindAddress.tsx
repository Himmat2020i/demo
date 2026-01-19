import React, { FC, useState } from 'react';
import { Alert, View } from 'react-native';
import AuthDropDown from '../../../../../components/textInput/AuthDropDown';
import AppButton from '../../../../../components/button/AppButton';
import { debounce } from 'lodash';
import { SEARCH_ACCESS_CODE } from '../../../../../constants/constants';
import { SearchParams } from '../../../../../interfaces/searchAddressData';
import { useLazySearchAddressQuery } from '../../../../../services/addressSearch';
import { Question } from '../../DataModal';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import {
  updateAnswer,
  updateAnswerInTableAction,
} from '../../../../../redux/auth/authSlice';
import { useFindAddressStyle } from './FindAddressStyle';
import StatusView from '../statusView/StatusView';
import ErrorMessage from '../../../../../components/errorMessage/ErrorMessage';

interface CustomFindAddressProps {
  item: Question;
  onInputChange: () => void;
}

const FindAddress: FC<CustomFindAddressProps> = ({ item, onInputChange }) => {
  const [searchAddress, { isLoading, isFetching }] =
    useLazySearchAddressQuery();
  const { selectedSectionQuestions, user } = useSelector(
    (state: RootState) => state.auths,
  );

  const { styles } = useFindAddressStyle();

  const dispatch = useDispatch();
  const selectedItem = selectedSectionQuestions.find(
    (items: Question) =>
      items?.id === item.id &&
      item?.idQuestion === items?.idQuestion &&
      item?.idSection === items?.idSection,
  );
  const [value, setValue] = useState<any>();
  const [dropDown, setDropDown] = useState<any>();

  const onSearch = debounce(async () => {
    setDropDown(null);
    setValue(null);
    let findCode = '';

    if (selectedItem?.idQuestion === 985) {
      findCode = await getFilterInput(984);
    } else if (selectedItem?.idQuestion === 982) {
      findCode = await getFilterInput(986);
    } else if (selectedItem?.idQuestion === 987) {
      findCode = await getFilterInput(988);
    } else if (selectedItem?.idQuestion === 1530) {
      findCode = await getFilterInput(1529);
    }

    const postCode = findCode?.answers[0]?.answer;
    if (postCode === '') {
      Alert.alert('Please enter postal code.');
      return;
    }
    const params: SearchParams = {
      access_code: SEARCH_ACCESS_CODE,
      postCode: postCode,
    };
    searchAddress(params).then(res => {
      if (res?.data?.Data?.length > 0) {
        setDropDown(res?.data?.Data);
      } else {
        Alert.alert('Please enter valid postal code!');
        return;
      }
    });
  }, 100);

  const onChangeText = async params => {
    const { idOrganisation } = user;

    dispatch(
      updateAnswerInTableAction({
        idQuestion: params.idQuestion,
        idSection: params.idSection,
        value: params.value,
        idBusiness: idOrganisation,
      }),
    );

    dispatch(
      updateAnswer({
        sectionId: params.idSection,
        questionId: params.idQuestion,
        answer: params?.value,
        idScheme: 4,
        id: params?.id,
        idBusiness: idOrganisation,
      }),
    );

    onInputChange();
    // triggerEvent();
  };

  const getFilterInput = qId => {
    const selectedInput = selectedSectionQuestions.filter((input: Question) => {
      return (
        input?.idQuestion === qId && input?.idSection === selectedItem.idSection
      );
    });
    return selectedInput[0];
  };

  const paramMathod = (paramVal, value) => {
    const params = {
      value: value,
      idQuestion: paramVal?.idQuestion,
      id: paramVal?.id,
      idSection: paramVal?.idSection,
    };
    onChangeText(params);
  };

  const onSubmitPress = async value => {
    if (selectedItem?.idQuestion === 985) {
      const flat = await getFilterInput(746);
      paramMathod(flat, value?.FlatNumber);
      const address2 = await getFilterInput(748);
      paramMathod(address2, value?.Address2);
      const address1 = await getFilterInput(745);
      paramMathod(address1, value?.Address1);
      const city = await getFilterInput(751);
      paramMathod(city, value?.City);
      const address3 = await getFilterInput(749);
      paramMathod(address3, '');
      const postCode = await getFilterInput(752);
      paramMathod(postCode, value?.PostalCode);
    } else if (selectedItem?.idQuestion === 982) {
      const flat = await getFilterInput(1541);
      paramMathod(flat, value?.FlatNumber);
      const address2 = await getFilterInput(776);
      paramMathod(address2, value?.Address2);
      const address1 = await getFilterInput(763);
      paramMathod(address1, value?.Address1);
      const city = await getFilterInput(766);
      const address3 = await getFilterInput(764);
      paramMathod(address3, '');
      paramMathod(city, value?.City);
      const postCode = await getFilterInput(767);
      paramMathod(postCode, value?.PostalCode);
    } else if (selectedItem?.idQuestion === 987) {
      const address2 = await getFilterInput(789);
      paramMathod(address2, value?.Address2);
      const address1 = await getFilterInput(787);
      paramMathod(address1, value?.Address1);
      const city = await getFilterInput(792);
      paramMathod(city, value?.City);
      const postCode = await getFilterInput(767);
      paramMathod(postCode, value?.PostalCode);
    } else if (selectedItem?.idQuestion === 1530) {
      const flat = await getFilterInput(1569);
      paramMathod(flat, value?.FlatNumber);
      const address1 = await getFilterInput(1570);
      paramMathod(address1, value?.Address1);
      const address2 = await getFilterInput(1571);
      paramMathod(address2, value?.Address2);
      const address3 = await getFilterInput(1572);
      paramMathod(address3, '');
      const city = await getFilterInput(1573);
      paramMathod(city, value?.City);
      const postCode = await getFilterInput(1566);
      paramMathod(postCode, value?.PostalCode);
    }
  };
  return (
    <>
      <StatusView />
      <AppButton
        style={styles.button}
        title={'Find Address'}
        onPress={() => onSearch()}
        labelStyle={styles.buttonLabel}
        isLoading={isLoading || isFetching}
      />
      {dropDown?.length > 0 && (
        <View style={styles.container}>
          <AuthDropDown
            item={dropDown}
            address
            value={value}
            onChange={(item: any) => {
              setValue(item);
            }}
            onSubmitPress={onSubmitPress}
            type={'radio'}
            icon="dropdownIcon"
            placeholder="Please Select"
            isShowButton={false}
            style={styles.dropdownContainer}
            titleStyle={styles.textStyles}
          />
        </View>
      )}
    </>
  );
};

export default FindAddress;
