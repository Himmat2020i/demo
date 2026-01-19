import React, {FC, useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import {Question} from '../../DataModal';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../../../redux/store';
import {
  updateAnswer,
  updateAnswerInTableAction,
} from '../../../../../redux/auth/authSlice';
import AuthDropDown from '../../../../../components/textInput/AuthDropDown';

import StatusView from '../statusView/StatusView';
import {useCustomDocumentStyle} from './Style';

interface CustomDropDownProps {
  item: Question;
  onInputChange: () => void;
}
const CustomDropDown: FC<CustomDropDownProps> = ({item, onInputChange}) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState();
  const {styles} = useCustomDocumentStyle();
  const {selectedSectionQuestions, user} = useSelector(
    (state: RootState) => state.auths,
  );
  const selectedItem = selectedSectionQuestions.filter((items: Question) => {
    return (
      item?.id === items?.id &&
      item?.idQuestion === items?.idQuestion &&
      item?.idSection === items?.idSection
    );
  })[0];
  useEffect(() => {
    const selectedOption = selectedItem.questionControlOptions?.find(
      (option: {controlItemName: any}) =>
        option.controlItemName === selectedItem?.answers[0]?.answer,
    );
    if (selectedOption) {
      const selectedId = selectedOption.id;
      setValue(selectedId);
    }
  }, [selectedItem, selectedItem.questionControlOptions]);

  const updateRedux = useCallback(
    async (text: string) => {
      const {idOrganisation} = user;
      dispatch(
        updateAnswerInTableAction({
          idQuestion: selectedItem.idQuestion,
          idSection: selectedItem.idSection,
          value: text,
          idBusiness: idOrganisation,
        }),
      );

      dispatch(
        updateAnswer({
          sectionId: selectedItem.idSection,
          questionId: selectedItem.idQuestion,
          answer: text,
          idScheme: selectedItem?.idScheme,
          id: selectedItem?.id,
          idBusiness: idOrganisation,
        }),
      );
      if (item?.idScheme === 4 && item?.idQuestion === 1025 && item?.idSection === 41) {
        let newVal = '';
        if (text?.toLowerCase?.() === 'sole trader') {
          newVal = 'Proprietor';
        } else if (text?.toLowerCase?.() === 'limited company') {
          newVal = 'Director';
        } else {
          newVal = 'Other';
        }
          dispatch(
              updateAnswer({
                sectionId: item.idSection,
                questionId: 755,
                answer: newVal,
                idScheme: item?.idScheme,
                id: 23,
                idBusiness: idOrganisation,
              }),
            );
        dispatch(
          updateAnswerInTableAction({
            idQuestion: 755,
            idSection: item.idSection,
            value: newVal,
            idBusiness: idOrganisation,
          }),
        );
      }
      onInputChange();
      // triggerEvent();
    },
    [dispatch, onInputChange, selectedItem, user],
  );

  const handleSelect = useCallback(
    async (selectedValue: number) => {
      const selectedOption = selectedItem.questionControlOptions.find(
        (option: {id: number}) => option?.id === selectedValue,
      );
      if (selectedOption) {
        const selectedId = selectedOption.id;
        setValue(selectedId);
        await updateRedux(selectedOption.controlItemName);
      }
    },
    [selectedItem.questionControlOptions, updateRedux],
  );

  const isShowError = selectedItem?.isShowValidation;
  const showValidation = item?.answers[0]?.answer === '' && isShowError;
  const sortArr = selectedItem?.questionControlOptions
    ?.slice()
    .sort(
      (a: {controlItemName: number}, b: {controlItemName: number}) =>
        a.controlItemName - b.controlItemName,
    );
  return (
    <View style={styles.container}>
      <StatusView />
      <AuthDropDown
        item={sortArr}
        value={value}
        error={showValidation ? isShowError : false}
        onChange={(item: any) => {
          setValue(item);
        }}
        onSubmitPress={handleSelect}
        type={'radio'}
        icon="dropdownIcon"
        labelField="controlItemName"
        placeholder="Please Select"
        isShowButton={false}
        style={styles.authDropdown}
        titleStyle={styles.titleStyle}
      />
    </View>
  );
};

export default CustomDropDown;
