import React from 'react';
import {View, TouchableOpacity, FlatList} from 'react-native';
import {Question} from '../DataModal';
import {useCheckBoxStyle} from './CheckBoxStyles';
import Svg from '../../../../assets/svg';
import HtmlComponent from './HtmlComponent';
import {useTheme} from '../../../../hooks';
import ErrorMessage from '../../../../components/errorMessage/ErrorMessage';
import AuthDropDown from '../../../../components/textInput/AuthDropDown';
import useCheckBox from '../hook/useCheckBox';
import StatusView from './statusView/StatusView';

interface CheckBoxProps {
  item: Question;
  onInputChange: () => void;
  idQuestionControlOption: number;
}

const CheckBox: React.FC<CheckBoxProps> = React.memo(
  ({item, onInputChange, idQuestionControlOption}) => {
    const {
      value,
      selectedOptions,
      handleDropDownPress,
      handleCheckBoxPress,
      isShowError,
      isDropDown,
      qControlOptions,
    } = useCheckBox(item, onInputChange, idQuestionControlOption);

    const styles = useCheckBoxStyle();
    const {colors} = useTheme();
    const showValidation = item?.answers[0]?.answer === '' && isShowError;
    const isRefSec = item?.idSection === 49 && item.idQuestion === 978;
    const sortArr = qControlOptions
      ?.slice()
      .sort((a, b) => a.controlItemName.localeCompare(b.controlItemName));
    return (
      <>
        <StatusView />
        {isDropDown ? (
          <>
            <View style={styles.dropDownContainer}>
              <AuthDropDown
                item={sortArr}
                value={value}
                onSubmitPress={handleDropDownPress}
                onChange={(item: any) => {
                  handleDropDownPress(item);
                }}
                type={'check'}
                icon="dropdownIcon"
                labelField="controlItemName"
                placeholder="Please Select"
                isShowButton={true}
                titleStyle={styles.dropDownTitleText}
              />
            </View>
            {showValidation && <ErrorMessage message={isShowError} />}
          </>
        ) : (
          <FlatList
            data={sortArr}
            keyExtractor={option => option?.id.toString() || ''}
            renderItem={({item: option}) => {
              let check = false;

              if (selectedOptions[0]?.includes(',') && isRefSec) {
                check = selectedOptions?.some(selectedOption =>
                  selectedOption.split(',').includes(option?.controlItemName),
                );
              } else {
                check =
                  selectedOptions?.includes(option?.controlItemName || '') ||
                  selectedOptions[0] === option?.controlItemName;
              }

              return (
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.checkBox}
                  onPress={() => {
                    if (item?.idSection === 49) {
                      handleCheckBoxPress(
                        option?.controlItemName || '',
                        item?.idSection || 0,
                      );
                    } else {
                      handleCheckBoxPress(option?.controlItemName || '', 0);
                    }
                  }}>
                  <View style={styles.checkIcon}>
                    <Svg.checkIcon
                      width={14}
                      height={14}
                      fill={check ? colors.appBlue : colors.white}
                    />
                  </View>
                  <View style={styles.controllerName}>
                    <HtmlComponent
                      baseStyleColor={colors.black}
                      htmlContent={option?.controlItemName}
                    />
                  </View>
                </TouchableOpacity>
              );
            }}
            ListFooterComponent={() =>
              showValidation && <ErrorMessage message={isShowError} />
            }
          />
        )}
      </>
    );
  },
);

export default CheckBox;
