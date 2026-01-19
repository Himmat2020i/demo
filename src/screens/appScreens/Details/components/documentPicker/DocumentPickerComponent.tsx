import {
  View,
  Modal,
  Linking,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Question} from '../../DataModal';
import Svg from '../../../../../assets/svg';
import StatusView from '../statusView/StatusView';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../../../redux/store';
import {getAllData} from '../../../../../../Database';
import {closeModal} from '../../../../../helpers/utils';
import AppText from '../../../../../components/text/AppText';
import {useDocumentPickerStyle} from './DocumentPickerStyle';
import {MODALS} from '../../../../../constants/routeConstant';
import React, {useEffect, useState, useCallback} from 'react';
import {updateDoc} from '../../../../../redux/auth/authSlice';
import useAddDocument from '../../../AddDocuments/hooks/useAddDocument';
import useDocumentPickerComponent from './hooks/useDocumentPickerComponent';
import ErrorMessage from '../../../../../components/errorMessage/ErrorMessage';

interface DocumentPickerProps {
  item: Question;
  onInputChange: () => void;
}

const DocumentPickerComponent: React.FC<DocumentPickerProps> = ({
  item,
  onInputChange,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<
    Array<{id: number, url: string}>,
  >([]);
  const dispatch = useDispatch();
  const {openFile} = useAddDocument();

  const {selectedSectionQuestions, user} = useSelector(
    (state: RootState) => state.auths,
  );
  const selectedItem = selectedSectionQuestions.find((items: Question) => {
    return (
      items?.id === item.id &&
      item?.idQuestion === items?.idQuestion &&
      item?.idSection === items?.idSection
    );
  });
  const [modalVisible, setModalVisible] = useState(false);

  const {addDocument, scanDocuments} = useDocumentPickerComponent();

  const updatedAnswer = useCallback(
    (url: string, rm: any, id: any) => {
      const {idOrganisation} = user;
      dispatch(
        updateDoc({
          sectionId: selectedItem.idSection,
          questionId: selectedItem.idQuestion,
          answer: url,
          idScheme: selectedItem?.idScheme,
          id: id,
          isTableUpdate: true,
          isRemove: rm,
          idBusiness: idOrganisation,
        }),
      );
      onInputChange();
    },
    [dispatch, onInputChange, selectedItem, user],
  );

  const onSelectedDoc = async (result: {uri: any}) => {
    const uri = result?.uri;
    const newFile = {id: selectedFiles.length + 1, url: uri};
    closeModal(MODALS.confirmation);
    setSelectedFiles(prevFiles => [...prevFiles, newFile]);
    const getLengthOfAnswers = (await getAllData('answers')).length + 1;
    updatedAnswer(newFile?.url, '', getLengthOfAnswers);
  };
  const onAddDocument = async () => {
    const data = await addDocument();
    onSelectedDoc(data);
    setModalVisible(false);
  };
  const handleScanDocuments = async () => {
    const data = await scanDocuments();
    onSelectedDoc(data);
    setModalVisible(false);
  };

  const openCustomModal = () => {
    setModalVisible(true);
  };

  useEffect(() => {
    if (selectedItem) {
      const answer = selectedItem?.answers;
      const updatedFiles = Array.isArray(answer)
        ? answer
            .filter((path: any) => path.answer !== '')
            ?.map((path: any) => {
              const urls = path?.answer?.split('|');
              return urls?.map((url: string) => ({
                id: path.id,
                url: url.trim(),
              }));
            })
            .flat()
        : [];
      if (updatedFiles.length > 0) {
        setSelectedFiles(updatedFiles);
      }
    }
  }, [selectedItem]);
  const handleRemoveFile = useCallback(
    (index: number, id: number) => {
      const updatedFiles = selectedFiles.filter((_, i) => i !== index);
      setSelectedFiles(updatedFiles);
      updatedAnswer(updatedFiles[0]?.url, 'rm', id);
    },
    [selectedFiles, updatedAnswer],
  );

  const renderFileTypeIcon = useCallback((item: {url: string}) => {
    const fileExtension = item?.url?.split('.').pop()?.toLowerCase();
    const renderFileTypeIcon = (iconName: string, label: string) => (
      <View style={styles.customTxtContainer}>
        <Svg.fileIcon height={14} width={14} fill={'blue'} />
        <AppText style={styles.customTxtLabel}>{label}</AppText>
        <AppText style={styles.customTxtUrl} numberOfLines={2}>
          {item.url}
        </AppText>
      </View>
    );

    switch (fileExtension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
        return renderFileTypeIcon('file-image-o', 'Img');
      case 'txt':
        return renderFileTypeIcon('file-text-o', 'Txt');
      case 'pdf':
        return renderFileTypeIcon('file-pdf-o', 'Pdf');
      case 'mp4':
        return renderFileTypeIcon('file-video-o', 'ThumbVideo');
      case 'docx':
        return renderFileTypeIcon('file-word-o', 'Docx');
      case 'pptx':
        return renderFileTypeIcon('file-pdf-o', 'Pptx');
      case 'doc':
        return renderFileTypeIcon('file-word-o', 'Doc');
      default:
        return renderFileTypeIcon('file-image-o', fileExtension || '');
    }
  }, []);

  const {styles, colors} = useDocumentPickerStyle();
  const isShowError = selectedItem?.isShowValidation;

  return (
    <>
      <View style={styles.container}>
        <StatusView />
        <TouchableOpacity onPress={openCustomModal} style={styles.button}>
          <Svg.addIcon fill={colors?.gray} height={15} width={15} />
        </TouchableOpacity>
        <ScrollView
          style={styles.scrollView}
          showsHorizontalScrollIndicator={false}
          horizontal>
          <View style={styles.selectedFiles}>
            {selectedFiles?.map((file, index) => {
              return (
                !!file?.url && (
                  <TouchableOpacity
                    key={index}
                    onPress={async () => {
                      if (file.url.includes('http')) {
                        Linking.openURL(file.url);
                      } else {
                        await openFile(file?.url);
                      }
                    }}
                    style={[styles.urlContainer, {}]}>
                    {renderFileTypeIcon(file, index)}
                    <TouchableOpacity
                      hitSlop={30}
                      style={styles.closeIconContainer}
                      onPress={() => handleRemoveFile(index, file.id)}>
                      <Svg.clearIcon fill={'white'} width={7} height={7} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                )
              );
            })}
          </View>
        </ScrollView>

        <Modal
          transparent={true}
          animationType={'slide'}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <AppText style={styles.optionText}>Select an Option</AppText>
              <Pressable
                onPress={handleScanDocuments}
                style={styles.modalButton}>
                <AppText style={styles.addDocument}>Scan Document</AppText>
              </Pressable>
              <Pressable onPress={onAddDocument} style={styles.modalButton}>
                <AppText style={styles.addDocument}>Add Document</AppText>
              </Pressable>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={styles.cancelContainer}>
                <AppText style={styles.cancelText}>Cancel</AppText>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
      {isShowError && <ErrorMessage message={isShowError} />}
    </>
  );
};

export default DocumentPickerComponent;
