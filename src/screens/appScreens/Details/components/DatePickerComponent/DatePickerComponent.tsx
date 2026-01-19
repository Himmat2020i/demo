import React, {useState, useRef, useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {useDispatch, useSelector} from 'react-redux';
import {
  updateAnswer,
  updateAnswerInTableAction,
} from '../../../../../redux/auth/authSlice';
import {Question} from '../../DataModal';
import {RootState} from '../../../../../redux/store';
import Svg from '../../../../../assets/svg';
import AppTextInput from '../../../../../components/textInput/AppTextInput';
import ErrorMessage from '../../../../../components/errorMessage/ErrorMessage';
import StatusView from '../statusView/StatusView';
import {useDatePickerStyle} from './Style';

interface DatePickerComponentProps {
  onInputChange: () => void;
  item: Question;
  mode: 'time' | 'date' | 'datetime';
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({
  onInputChange,
  item,
  mode,
}) => {
  const [date, setDate] = useState<Date | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const prevDateRef = useRef<Date | null>(null);
  const {styles, colors} = useDatePickerStyle();
  const dispatch = useDispatch();

  const {selectedSectionQuestions, user} = useSelector(
    (state: RootState) => state.auths,
  );
  const selectedItem = selectedSectionQuestions.find(
    (items: Question) =>
      item?.id === items?.id &&
      item?.idQuestion === items?.idQuestion &&
      item?.idSection === items?.idSection,
  );

  const updateRedux = async (text: string) => {
    const {idOrganisation} = user;

    dispatch(
      updateAnswerInTableAction({
        idQuestion: selectedItem?.idQuestion,
        idSection: selectedItem?.idSection,
        value: text,
        idBusiness: idOrganisation,
      }),
    );

    dispatch(
      updateAnswer({
        sectionId: selectedItem?.idSection,
        questionId: selectedItem?.idQuestion,
        answer: text,
        idScheme: selectedItem?.idScheme,
        id: selectedItem?.id,
        idBusiness: idOrganisation,
      }),
    );
    onInputChange();
    // triggerEvent();
  };

  useEffect(() => {
    if (selectedItem?.answers[0]?.answer) {
      const [day, month, year] = selectedItem?.answers[0]?.answer
        ?.split('/')
        ?.map(Number);
      const parsedDate = new Date(year, month - 1, day);
      if (!isNaN(parsedDate.getTime())) {
        setDate(parsedDate);
        setInputValue(formatDateToString(parsedDate));
      }
    } else {
      setDate(null);
      setInputValue('');
    }
  }, [selectedItem?.answers]);

  const onDateChangeHandler = (selectedDate: Date) => {
    const formattedDate = formatDateToString(selectedDate);
    setDate(selectedDate);
    setInputValue(formattedDate);
    prevDateRef.current = selectedDate;
    updateRedux(formattedDate);
    setShowDatePicker(false);
  };

  const onTextInputChange = (text: string) => {
    updateRedux(text);
    setInputValue(text);
  };

  const handleTextInputBlur = () => {
    const parsedDate = parseDateString(inputValue);
    if (parsedDate) {
      setDate(parsedDate);
      setInputValue(formatDateToString(parsedDate));
      prevDateRef.current = parsedDate;
    } else if (prevDateRef.current) {
      setDate(prevDateRef.current);
      setInputValue(formatDateToString(prevDateRef.current));
    }
  };

  const isShowError = selectedItem?.isShowValidation;
  const showValidation = item?.answers[0]?.answer === '' && isShowError;
  return (
    <>
      <StatusView />
      <TouchableOpacity
        style={styles.container}
        onPress={() => setShowDatePicker(true)}>
        <AppTextInput
          onChangeText={onTextInputChange}
          value={inputValue}
          onBlur={handleTextInputBlur}
          required
          onPressIn={() => setShowDatePicker(true)}
          editable={false}
          placeholder="DD/MM/YYYY"
          labelStyle={styles.labelStyle}
          style={styles.input}
          textAlignVertical="center"
          textStyle={styles.inputText}
          type="text"
          // onIconPress={() => setShowDatePicker(true)}
          icon={
            <Svg.dateIcon
              fill={inputValue ? colors.gray : colors.glaciarGray}
              height={18}
              width={18}
            />
          }
        />
      </TouchableOpacity>
      {showDatePicker && (
        <TouchableOpacity
          onPress={() => {
            setShowDatePicker(false);
          }}>
          <DatePicker
            modal
            mode={mode}
            open={true}
            minimumDate={item?.idQuestion === 1561 ? undefined : new Date()}
            date={inputValue ? parseDateString(inputValue) : new Date()}
            onConfirm={onDateChangeHandler}
            onCancel={() => setShowDatePicker(false)}
          />
        </TouchableOpacity>
      )}

      {showValidation && <ErrorMessage message={isShowError} />}
    </>
  );
};

const parseDateString = (input: string): Date | null => {
  const [day, month, year] = input.split('/').map(Number);
  const parsedDate = new Date(year, month - 1, day);
  return !isNaN(parsedDate.getTime()) ? parsedDate : null;
};

const formatDateToString = (date: Date): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const formattedDay = day < 10 ? `0${day}` : `${day}`;
  const formattedMonth = month < 10 ? `0${month}` : `${month}`;

  return `${formattedDay}/${formattedMonth}/${year}`;
};

export default DatePickerComponent;
