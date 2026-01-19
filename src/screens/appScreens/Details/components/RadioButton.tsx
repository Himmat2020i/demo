import React, {FC, useEffect, useState} from 'react';
import {View, Pressable} from 'react-native';
import {useRadioButtonStyle} from './RadioButtonStyle';
import {DEFAULT_COLORS} from '../../../../styles';
import {Question} from '../DataModal';
import {useDispatch, useSelector} from 'react-redux';
import AppText from '../../../../components/text/AppText';
import {RootState} from '../../../../redux/store';
import {
  updateAnswer,
  updateAnswerInTableAction,
} from '../../../../redux/auth/authSlice';
import ErrorMessage from '../../../../components/errorMessage/ErrorMessage';
import StatusView from './statusView/StatusView';

interface RadioButtonProps {
  item: Question;
  onInputChange: () => void;
}

const RadioButton: FC<RadioButtonProps> = ({item, onInputChange}) => {
  const {styles, colors} = useRadioButtonStyle();
  const dispatch = useDispatch();

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

  const [selectedOption, setSelectedOption] = useState<string>(
    selectedItem?.answers[0]?.answer,
  );

  useEffect(() => {
    setSelectedOption(selectedItem?.answers[0]?.answer);
  }, [selectedItem?.answers]);

  const handleRadioPress = async (selectedValue: string) => {
    const {idOrganisation} = user;

    dispatch(
      updateAnswerInTableAction({
        idQuestion: selectedItem.idQuestion,
        idSection: selectedItem.idSection,
        value: selectedValue,
        idBusiness: idOrganisation,
      }),
    );

    dispatch(
      updateAnswer({
        sectionId: selectedItem.idSection,
        questionId: selectedItem.idQuestion,
        answer: selectedValue,
        idScheme: selectedItem?.idScheme,
        id: selectedItem?.id,
        idBusiness: idOrganisation,
      }),
    );
    onInputChange();
    // triggerEvent();
  };

  const isShowError = selectedItem?.isShowValidation;
  const showValidation = item?.answers[0]?.answer === '' && isShowError;

  return (
    <View style={styles.container}>
      <StatusView />
      {selectedItem?.questionControlOptions?.map(
        (option: {
          controlItemName:
            | string
            | number
            | boolean
            | React.ReactElement<any, string | React.JSXElementConstructor<any>>
            | Iterable<React.ReactNode>
            | null
            | undefined,
          idQuestionControlOption: React.Key | null | undefined,
        }) => {
          const redio = selectedOption === option?.controlItemName;
          return (
            <Pressable
              key={option?.idQuestionControlOption}
              style={styles.radioButton}
              hitSlop={15}
              onPress={() => handleRadioPress(option?.controlItemName)}>
              <View
                style={[
                  styles.radioIcon,
                  {borderColor: redio ? DEFAULT_COLORS.blue : colors.gray},
                ]}>
                <View
                  style={[
                    styles.radioOff,
                    {
                      backgroundColor: redio
                        ? DEFAULT_COLORS.blue
                        : colors.white,
                    },
                  ]}
                />
              </View>

              <AppText style={styles.radioLabel}>
                {option?.controlItemName}
              </AppText>
            </Pressable>
          );
        },
      )}

      {showValidation && <ErrorMessage message={isShowError} />}
    </View>
  );
};

export default RadioButton;
