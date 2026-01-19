import {useCallback} from 'react';
import {
  pick,
  types,
} from '@react-native-documents/picker';
import DocumentScanner from 'react-native-document-scanner-plugin';
import {
  closeModal,
  openModal,
} from '../../../../../../helpers/utils';
import {MODALS} from '../../../../../../constants/routeConstant';
import {FILE_EXTENSIONS} from '../../../../../../constants/constants';
import {PermissionsAndroid, Platform} from 'react-native';
import mime from 'mime';

const useDocumentPickerComponent = () => {
  let selectedDocumentData = '';

  const letCloseModal = () => {
    closeModal(MODALS.confirmation);
  };
  const addDocument = async () => {
    try {
      const [result] = await pick({
          mode: 'open',
          allowMultiSelection: false,
          type: [types.allFiles],
          presentationStyle: 'fullScreen',
        })

      if (!result) {
        throw new Error('No file selected');
      }
      const maxSize: number = 50 * 1024 * 1024;
      const fileSize = result?.size || 0;
      const extension = mime.getType(result?.name || '') || '';


      if (fileSize >= maxSize) {
        throw new Error('File size exceeds the maximum allowed limit (50MB).');
      }

      if (FILE_EXTENSIONS.includes(extension)) {
        throw new Error('Unsupported file type.');
      }

      return {
        name: result?.name || '',
        type: extension || '',
        uri: result?.uri || '',
      };
    } catch (error: any) {
      console.error('Error while adding document:', error?.message || error);

      return null;
    } finally {
      letCloseModal();
    }
  };

  const processDocumentResult = (result: string) => {
    const parts = result.split('/');
    const fileName = parts[parts.length - 1];
    return {
      name: fileName,
      type: mime.getType(result) || "",
      uri: result || '',
    };
  };
  const scanDocuments = useCallback(async () => {
    try {
      if (Platform.OS === 'android') {
        const cameraPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to your camera',
            buttonPositive: 'OK',
          },
        );

        if (cameraPermission !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('Camera permission denied');
          return;
        }
      }

      const {scannedImages} = await DocumentScanner.scanDocument({
        maxNumDocuments: 1,
      });
      const result = scannedImages?.[0] || '';

      return processDocumentResult(result);
    } catch (error) {
      console.error('Document scanner error:', error);
      return null; // Handle error gracefully
    } finally {
      await letCloseModal();
    }
  }, []);

  const onAddPress = ({item}: {item?: React.JSX.Element, title?: string}) => {
    openModal(MODALS.confirmation, {
      subTitle: item,
      title: '',
      onPressCancel: false,
      onPressConfirm: false,
    });
  };

  return {
    onAddPress,
    scanDocuments,
    addDocument,
    selectedDocumentData,
  };
};

export default useDocumentPickerComponent;
