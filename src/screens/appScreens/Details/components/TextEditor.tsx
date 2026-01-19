import React, {useRef, useState, useCallback, useEffect} from 'react';
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Modal,
  Linking,
} from 'react-native';
import {RichEditor,defaultActions, RichToolbar} from 'react-native-pell-rich-editor';
import {useSelector, useDispatch} from 'react-redux';
import {
  updateAnswer,
  updateAnswerInTableAction,
} from '../../../../redux/auth/authSlice';
import {RootState} from '../../../../redux/store';
import {Question} from '../DataModal';
import ImagePicker from 'react-native-image-crop-picker';
import ImageToBase64 from 'react-native-image-base64';
import AppButton from '../../../../components/button/AppButton';
import {useTextEditorStyle} from './TextEditorStyles';

interface TextEditorProps {
  item: Question;
  onInputChange: () => void;
}

const TextEditor: React.FC<TextEditorProps> = ({item, onInputChange}) => {
  const richText = useRef();
  const {styles} = useTextEditorStyle();
  const dispatch = useDispatch();
  const {user, selectedSectionQuestions} = useSelector(
    (state: RootState) => state.auths,
  );
  const [article, setArticle] = useState('');
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoModalVisible, setVideoModalVisible] = useState(false);

  const pickImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    }).then(image => {
      convertBase64(image);
    });
  };

  const convertBase64 = image => {
    ImageToBase64.getBase64String(image.path)
      .then(base64String => {
        let str = `data:${image.mime};base64,${base64String}`;

        richText.current.insertImage(str);
        setShowImageOptions(false);
      })
      .catch(err => console.log('getting error', err));
  };

  const editorInitializedCallback = useCallback(() => {
    richText.current?.registerToolbar(items => {});
  }, []);

  const selectedItem = selectedSectionQuestions.find(
    (items: Question) =>
      items?.id === item.id &&
      item?.idQuestion === items?.idQuestion &&
      item?.idSection === items?.idSection,
  );

  useEffect(() => {
    if (selectedItem) {
      const defaultAnswer = selectedItem.answers[0]?.answer;
      const answer = defaultAnswer || item.defaultValue;

      setArticle(answer);
    }
  }, [selectedItem, item]);


  const onChangeText = async (text: string) => {
    const {idOrganisation} = user;

    dispatch(
      updateAnswerInTableAction({
        idQuestion: selectedItem.idQuestion,
        idSection: selectedItem.idSection,
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

    setArticle(text);
    onInputChange();
    // triggerEvent();
  };

  const handleInsertImage = () => {
    setShowImageOptions(true);
  };

  const handleInsertVideo = () => {
    setVideoModalVisible(true);
  };

  const handleInsertImageUrl = () => {
    if (imageUrl.trim() !== '') {
      richText.current?.insertImage(imageUrl, 'image');
      setImageUrl('');
      setShowImageOptions(false);
    }
  };

  const handleInsertVideoUrl = () => {
    if (videoUrl.trim() !== '') {
      richText.current?.insertImage(videoUrl, 'video');
      setVideoUrl('');
      setVideoModalVisible(false);
    }
  };

  const handleDownload = () => {
    Linking.openURL(selectedItem?.downloadLink).catch(err =>
      console.error('An error occurred', err),
    );
  };

  return (
    <>
      <View style={styles.container}>
        <ScrollView
          style={[styles.editorContainer, {maxHeight: 300}]}
          contentContainerStyle={{paddingBottom: 100}}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}>
            <RichEditor
              ref={richText}
              style={styles.rich}
              // placeholder="Start Writing Here"
              placeholder=""
              onChange={onChangeText}
              initialContentHTML={article}
              editorInitializedCallback={editorInitializedCallback}
            />
          </KeyboardAvoidingView>
        </ScrollView>

        <View style={{position: 'absolute', bottom: 0}}>
          <RichToolbar
            androidHardwareAccelerationDisabled={true}
            style={styles.richBar}
            editor={richText}
            iconTint="#000"
            selectedIconTint="#007BFF"
            disabledIconTint="#828282"
            iconSize={24}
            actions={[
              ...defaultActions,
              'image',
              // 'video',
              'setBold',
              'setItalic',
              'setUnderline',
              'setStrikethrough',
              'insertBulletsList',
              'insertOrderedList',
              'setParagraph',
              'heading1',
              'heading2',
              'heading3',
              'alignLeft',
              'alignCenter',
              'alignRight',
              'alignFull',
              'setTextColor',
              'undo',
              'redo',
              'insertImage',
            ]}
            onPressAddImage={handleInsertImage}
          />
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={videoModalVisible}
          onRequestClose={() => setVideoModalVisible(false)}>
          <Pressable
            style={styles.modalContainer}
            onPress={() => setVideoModalVisible(false)}>
            <View style={styles.modalContent}>
              <TextInput
                placeholder="Enter Video URL"
                value={videoUrl}
                onChangeText={text => setVideoUrl(text)}
                style={styles.textInput}
              />

              <TouchableOpacity
                style={styles.insertButton}
                onPress={handleInsertVideoUrl}
                disabled={videoUrl.trim() === ''}>
                <Text style={styles.insertButtonText}>Insert Video URL</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setVideoModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={showImageOptions}
          onRequestClose={() => setShowImageOptions(false)}>
          <Pressable
            style={styles.modalContainer}
            onPress={() => setShowImageOptions(false)}>
            <View style={styles.modalContent}>
              <AppButton
                onPress={() => pickImage()}
                style={styles.galleryButton}
                title={'Select From Gallery'}
                labelStyle={styles.buttonLabel}
              />

              <TextInput
                placeholder="Enter Image URL"
                value={imageUrl}
                onChangeText={text => setImageUrl(text)}
                style={styles.textInput}
              />

              <TouchableOpacity
                style={styles.insertButton}
                onPress={handleInsertImageUrl}
                disabled={imageUrl.trim() === ''}>
                <Text style={styles.insertButtonText}>Insert Image URL</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowImageOptions(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      </View>
      {selectedItem?.downloadLink && (
        <AppButton
          onPress={() => handleDownload()}
          style={styles.downloadBtn}
          title={'Click here to download the template.'}
          labelStyle={styles.downloadTxt}
        />
      )}
    </>
  );
};

export default TextEditor;
