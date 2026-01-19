import React, {useCallback} from 'react';
import {View, TextInputProps, StyleSheet} from 'react-native';
import TextComponent from './TextComponent';
import TextInputComponent from './TextInputComponent';
import DatePickerComponent from './DatePickerComponent/DatePickerComponent';
import CustomDropDown from './CustomDropDown/CustomDropDown';
import RadioButton from './RadioButton';
import CheckBox from './CheckBox';
import DocumentPickerComponent from './documentPicker/DocumentPickerComponent';
import {Question} from '../DataModal';
import RangeNumericInputComponent from './RenderNumericInputComponent/RangeNumericInputComponent';
import TextEditor from './TextEditor';
import HtmlComponent from './HtmlComponent';
import {useTheme} from '../../../../hooks';
import FindAddress from './findAddress/FindAddress';

const MemoizedTextInputComponent = React.memo(TextInputComponent);
const MemoizedDatePickerComponent = React.memo(DatePickerComponent);
const MemoizedCustomDropDownComponent = React.memo(CustomDropDown);
const MemoizedRadioButtonComponent = React.memo(RadioButton);
const MemoizedCheckBoxComponent = React.memo(CheckBox);
const MemoizedDocumentPickerComponent = React.memo(DocumentPickerComponent);
const MemoizedRangeNumericInputComponent = React.memo(
  RangeNumericInputComponent,
);

const MemoizedTextEditor = React.memo(TextEditor);

const MemoizedFindAddress = React.memo(FindAddress);

let idQuestionControlOption = 0;
interface RenderItemsProps extends TextInputProps {
  index: number;
  item: Question;
  onInputChange: () => void;
}

const RenderItems: React.FC<RenderItemsProps> = ({
  item,
  index,
  onInputChange,
}) => {
  const {colors} = useTheme();
  if (item?.idControl === 7) {
    idQuestionControlOption =
      item?.questionControlOptions?.filter((i: {controlItemName: any}) => {
        return i.controlItemName === item?.answers[0]?.answer;
      })[0]?.idQuestionControlOption || 0;
  }

  const conditionalComponent = useCallback(() => {
    switch (item?.idControl) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 26:
        return (
          <MemoizedTextInputComponent
            onInputChange={onInputChange}
            key={`${item.id}-${index}`}
            item={item}
          />
        );
      case 5:
        return (
          <MemoizedDatePickerComponent
            onInputChange={onInputChange}
            key={`${item.id}-${index}`}
            item={item}
            mode="date"
          />
        );
      case 6:
        return (
          <MemoizedDatePickerComponent
            onInputChange={onInputChange}
            key={`${item.id}-${index}`}
            item={item}
            mode="datetime"
          />
        );
      case 7:
        return (
          item?.questionControlOptions.length > 0 && (
            <MemoizedCustomDropDownComponent
              onInputChange={onInputChange}
              key={`${item.id}-${index}`}
              item={item}
            />
          )
        );
      case 8:
        return (
          <MemoizedRadioButtonComponent
            onInputChange={onInputChange}
            key={`${item.id}-${index}`}
            item={item}
          />
        );
      case 9:
        return (
          <MemoizedCheckBoxComponent
            idQuestionControlOption={idQuestionControlOption}
            onInputChange={onInputChange}
            key={`${item.idQuestion}-${item?.idSection}`}
            item={item}
          />
        );
      case 10:
        return (
          <MemoizedDocumentPickerComponent
            onInputChange={onInputChange}
            key={`${item.id}-${index}`}
            item={item}
          />
        );

      case 14:
        return (
          <MemoizedRangeNumericInputComponent
            onInputChange={onInputChange}
            key={`${item.id}-${index}`}
            item={item}
          />
        );

      case 16:
        return (
          <MemoizedTextEditor
            onInputChange={onInputChange}
            key={`${item.id}-${index}`}
            item={item}
          />
        );

      case 24:
        return (
          <MemoizedFindAddress
            onInputChange={onInputChange}
            key={`${item.id}-${index}`}
            item={item}
          />
        );

      default:
        return null;
    }
  }, [item, onInputChange, index]);
  return (
    <View style={styles.container}>
      <TextComponent item={item} index={index} />
      {conditionalComponent()}
      {!!item?.questionFooterDescription && (
        <HtmlComponent
          baseStyleColor={colors.black}
          htmlContent={item.questionFooterDescription}
        />
      )}
    </View>
  );
};

export default React.memo(RenderItems);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
  },
});
