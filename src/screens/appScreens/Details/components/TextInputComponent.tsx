import React, {FC} from 'react';
import AppTextInput from '../../../../components/textInput/AppTextInput';
import {useSelector, useDispatch} from 'react-redux';
import {useTextInputComponentStyle} from './TextInputComponentStyle';
import {Question} from '../DataModal';
import {
  updateAnswer,
  updateAnswerInTableAction,
} from '../../../../redux/auth/authSlice';
import {RootState} from '../../../../redux/store';
import ErrorMessage from '../../../../components/errorMessage/ErrorMessage';
import StatusView from './statusView/StatusView';

interface TextInputComponentProps {
  item: Question;
  onInputChange: () => void;
}

const getTextInputType = (idControl: number) =>
  idControl === 2 ? 'number' : idControl === 3 ? 'email' : 'default';

const TextInputComponent: FC<TextInputComponentProps> = ({
  item,
  onInputChange,
}) => {
  const {styles, colors} = useTextInputComponentStyle();
  const dispatch = useDispatch();
  const {selectedSectionQuestions, user} = useSelector(
    (state: RootState) => state.auths,
  );

  const selectedItem = selectedSectionQuestions.find(
    (items: Question) =>
      items?.id === item.id &&
      item?.idQuestion === items?.idQuestion &&
      item?.idSection === items?.idSection,
  );

  const answer = selectedItem?.answers?.[0]?.answer || '';
  const onChangeText = async (value: string) => {
    const {idOrganisation} = user;
    dispatch(
      updateAnswerInTableAction({
        idQuestion: item.idQuestion,
        idSection: item.idSection,
        value: value,
        idBusiness: idOrganisation,
        isInputText: true,
      }),
    );
    dispatch(
      updateAnswer({
        sectionId: item.idSection,
        questionId: item.idQuestion,
        answer: value,
        idScheme: item?.idScheme,
        id: item?.id,
        idBusiness: idOrganisation,
      }),
    );
    onInputChange();
    // triggerEvent();
  };
  const isShowError = selectedItem?.isShowValidation;
  const showValidation =
    (item?.answers[0]?.answer === '' && isShowError) ||
    isShowError === 'Value is not valid';
  const inputAnswer = selectedItem?.answers[0]?.answer;
  const idQuestion = selectedItem?.idQuestion === 755;

  const editable =
    idQuestion && (inputAnswer === 'Proprietor' || inputAnswer === 'Director');

  const keyboardType = React.useMemo(() =>
    item?.idControl === 26 ? 'decimal-pad' :
    item?.idControl === 2 ? 'numeric' : 'default'
    , [item?.idControl]);

  return (
    <>
      <StatusView />
      <AppTextInput
        style={[item.idControl === 4 ? styles.textArea : styles.inputStyle]}
        placeholderTextColor={colors.glaciarGray}
        textStyle={styles.textStyle}
        value={answer.toString()}
        placeholder={item?.questionPlaceHolder}
        multiline={item.idControl === 4}
        numberOfLines={item.idControl === 4 ? 2 : 1}
        onChangeText={onChangeText}
        autoCorrect={false}
        keyboardType={keyboardType}
        returnKeyType={item.idControl === 4 ? 'default' : 'done'}
        blurOnSubmit={true}
        textAlignVertical={'top'}
        prefix={item.idControl === 26 ? '£' : undefined}
        type={getTextInputType(item.idControl)}
        editable={!editable}
      />
      {showValidation && <ErrorMessage message={isShowError} />}
    </>
  );
};

export default TextInputComponent;
