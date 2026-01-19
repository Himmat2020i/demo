import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import AppText from '../../../../../components/text/AppText';
import AppTextInput from '../../../../../components/textInput/AppTextInput';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../../../redux/store';
import {Question} from '../../DataModal';
import {
  updateAnswer,
  updateAnswerInTableAction,
} from '../../../../../redux/auth/authSlice';
import ErrorMessage from '../../../../../components/errorMessage/ErrorMessage';
import {useRangeNumericalStyle} from './Style';
import StatusView from '../statusView/StatusView';

interface RangeNumericInputComponentProps {
  item: Question;
  onInputChange: () => void;
}

const RangeNumericInputComponent: React.FC<RangeNumericInputComponentProps> = ({
  item,
  onInputChange,
}) => {
  const dispatch = useDispatch();
  const {styles} = useRangeNumericalStyle();

  const {selectedSectionQuestions, user} = useSelector(
    (state: RootState) => state.auths,
  );

  const selectedItem = selectedSectionQuestions.find((items: Question) => {
    return (
      items?.id === item.id &&
      items?.idQuestion === item?.idQuestion &&
      items?.idSection === item?.idSection
    );
  });

  const [leftValue, setLeftValue] = useState<string>(
    selectedItem?.answers
      ? selectedItem?.answers[0]?.answer?.split('|')[0]
      : '',
  );
  const [rightValue, setRightValue] = useState<string>(
    selectedItem?.answers
      ? selectedItem?.answers[0]?.answer?.split('|')[1]
      : '',
  );
  const updateAnswers = async (left: string, right: string) => {
    const {idOrganisation} = user;
    const answerArray = [left, right];
    const joinedAnswer = answerArray.join('|');

    dispatch(
      updateAnswerInTableAction({
        idQuestion: selectedItem.idQuestion,
        idSection: selectedItem.idSection,
        value: joinedAnswer,
        idBusiness: idOrganisation,
      }),
    );

    dispatch(
      updateAnswer({
        sectionId: selectedItem.idSection,
        questionId: selectedItem.idQuestion,
        answer: joinedAnswer,
        idScheme: selectedItem?.idScheme,
        id: selectedItem?.id,
        idBusiness: idOrganisation,
      }),
    );
    onInputChange();
    // triggerEvent();
  };

  useEffect(() => {
    setLeftValue(
      selectedItem?.answers
        ? selectedItem.answers[0]?.answer.split('|')[0]
        : '',
    );
    setRightValue(
      selectedItem?.answers
        ? selectedItem.answers[0]?.answer.split('|')[1]
        : '',
    );
  }, [selectedItem]);

  const isShowError = selectedItem?.isShowValidation;
  const showValidation = item?.answers[0]?.answer === '' && isShowError;

  return (
    <>
      <View style={styles.container}>
        <StatusView />
        <AppTextInput
          style={styles.inputContainer}
          textStyle={styles.inputText}
          placeholder={selectedItem?.questionPlaceHolder || ''}
          value={leftValue}
          onChangeText={text => {
            setLeftValue(text);
            updateAnswers(text, rightValue);
          }}
          returnKeyType={'done'}
          keyboardType="numeric"
        />
        <AppText style={styles.toText}>To</AppText>
        <AppTextInput
          style={styles.inputContainer}
          textStyle={styles.inputText}
          placeholder={selectedItem?.questionPlaceHolder || ''}
          value={rightValue}
          onChangeText={text => {
            setRightValue(text);
            updateAnswers(leftValue, text);
          }}
          returnKeyType={'done'}
          keyboardType="numeric"
        />
      </View>

      {showValidation && <ErrorMessage message={isShowError} />}
    </>
  );
};

export default RangeNumericInputComponent;
