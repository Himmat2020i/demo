import React from 'react';
import {View} from 'react-native';
import {Question} from '../../DataModal';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../../redux/store';
import AppText from '../../../../../components/text/AppText';
import DocumentPickerComponent from './DocumentPickerComponent';
import {useDocumentPickerStyle} from './DocumentPickerStyle';

interface DocumentPickerControllerProps {
  defaultValue?: any;
  item: Question;
  index: number;
}

const DocumentPickerController: React.FC<DocumentPickerControllerProps> = ({
  defaultValue,
  item,
  index,
}) => {
  const sectionList = useSelector(
    (state: {apps: RootState}) =>
      state.apps.businessList[0]?.Sections[0]?.Questions,
  );
  const isShowErr = sectionList[index]?.isShowErr;
  const {styles} = useDocumentPickerStyle();

  return (
    <View>
      <DocumentPickerComponent item={item} defaultValue={defaultValue || []} />
      {isShowErr && (
        <AppText style={styles.emptyText}>This field cannot be empty.</AppText>
      )}
    </View>
  );
};

export default DocumentPickerController;
