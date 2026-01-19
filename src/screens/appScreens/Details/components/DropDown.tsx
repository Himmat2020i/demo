import React, {FC, useState, useEffect} from 'react';
import {View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {useDropDownStyle} from './DropDownStyle';
import {Question} from '../DataModal';
import {useDispatch, useSelector} from 'react-redux';
import {setBusinessList} from '../../../../redux/app/appSlice';
import ErrorMessage from '../../../../components/errorMessage/ErrorMessage';

interface DropDownProps {
  index: number;
  item: Question;
}

const DropDown: FC<DropDownProps> = ({item, index}) => {
  const [selectedValue, setSelectedValue] = useState('');
  const {styles, hp, colors} = useDropDownStyle();
  const dispatch = useDispatch();

  const sectionList = useSelector(
    (state: {apps: appState}) =>
      state.apps.businessList[0]?.Sections[0]?.Questions,
  );

  useEffect(() => {
    if (item?.answer !== selectedValue) {
      const updatedQuestions = sectionList.map((question: Question, i) => {
        if (i === index) {
          return {
            ...question,
            isShowErr: false,
            answer: selectedValue,
          };
        }
        return question;
      });

      dispatch(setBusinessList([{Sections: [{Questions: updatedQuestions}]}]));
    }
  }, [dispatch, index, item?.answer, sectionList, selectedValue]);

  const isShowError = item?.isShowValidation;
  const showValidation = item?.answers[0]?.answer === '' && isShowError;
  return (
    <>
      <View style={styles.container}>
        <Dropdown
          style={styles.dropDown}
          placeholderStyle={styles.place}
          selectedTextStyle={styles.selectedText}
          data={item.controlOption?.map(option => ({
            label: option.controlItemName,
            value: option.controlItemName,
          }))}
          maxHeight={hp(200)}
          labelField="label"
          valueField="value"
          placeholder={item.questionLabel}
          value={selectedValue}
          onValueChange={value => {
            setSelectedValue(value);
          }}
          containerStyle={{borderColor: colors.primary}}
          arrowColor={colors.primary}
        />
      </View>
      {showValidation && <ErrorMessage message={isShowError} />}
    </>
  );
};
export default DropDown;
