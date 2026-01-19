import React from 'react';
import {Text, Pressable, View} from 'react-native';
import useDocumentPickerComponent from '../../screens/appScreens/Details/components/documentPicker/hooks/useDocumentPickerComponent';
import {closeModal} from '../../helpers/utils';
import {MODALS} from '../../constants/routeConstant';
import {useModalContentStyle} from './ModalContentStyle';

interface Props {
  onDataSelected: (item?: any) => void;
}

const ModalContent = React.memo(({onDataSelected}: Props) => {
  const {scanDocuments, addDocument, selectedDocumentData} =
    useDocumentPickerComponent();

  const {styles} = useModalContentStyle();

  React.useEffect(() => {
    if (selectedDocumentData && onDataSelected) {
      onDataSelected(selectedDocumentData);
    }
  }, [selectedDocumentData, onDataSelected]);

  const handleScanDocuments = async () => {
    const data = await scanDocuments();
    onDataSelected(data);
  };

  const handleAddDocument = async () => {
    const data = await addDocument();
    onDataSelected(data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.selectOption}>Select an Option</Text>
      <Pressable onPress={handleScanDocuments} style={styles.button}>
        <Text style={styles.buttonText}>Scan Document</Text>
      </Pressable>
      <Pressable onPress={handleAddDocument} style={styles.button}>
        <Text style={styles.buttonText}>Add Document</Text>
      </Pressable>
      <Pressable
        onPress={() => closeModal(MODALS.confirmation)}
        style={styles.cancelButton}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </Pressable>
    </View>
  );
});

export default ModalContent;
