import { MODALS } from '../constants/routeConstant';
import modalfy from './modalfy';
import NetInfo from '@react-native-community/netinfo';
import moment from 'moment';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import { Question } from '../screens/appScreens/Details/DataModal';

const globalAny: any = global;
export const answerMatchMap = {
  'Buckinghamshire County Council': 1535,
  'Surrey County Council': 1534,
  'Buckinghamshire and Surrey County Council': 961,
  'Worcestershire council': 1024,
  'Nation Wide: Independence CIC': 1552,
};
export const findStatus = (currentStatus: string) => {
  switch (currentStatus) {
    case 'Pending':
      return '#E69138';
    case 'Approved':
      return '#3CB371';
    case 'Resubmitted':
      return '#E69138';
    case 'Declined':
      return '#ed5565';
    case 'Archived':
      return '#23c6c8';
    case 'Suspended':
      return '#ed5565';
    case 'Accepted':
      return '#9058c3';
    default:
      return '#1c84c6';
  }
};
export const webUrl = 'https://test.in8it.com';
export const getMatchIdQuestion = (sectionQuestionArr: []) => {
  let matchedId = 0;
  sectionQuestionArr?.some((dataObject: Question) => {
    const answerObject = dataObject.answers && dataObject.answers[0];
    if (
      dataObject.idSection === 41 &&
      answerMatchMap[answerObject.answer] !== undefined
    ) {
      matchedId = answerMatchMap[answerObject.answer];
      return true;
    }
    return false;
  });
  return matchedId;
};

export const doIfOnline = (
  onConnectivityAssured: () => void,
  onConnectivityLost: () => void,
) => {
  NetInfo.fetch().then(net => {
    if (net?.isConnected) {
      onConnectivityLost();
    } else {
      onConnectivityAssured();
    }
  });
};

export const startLoader = () => {
  globalAny.props.showAppLoader();
};

export const stopLoader = () => {
  globalAny?.props?.hideAppLoader();
};

export const showToaster = (
  message: string,
  type: 'S' | 'E',
  title?: string,
) => {
  globalAny.props.showToaster({
    message,
    type,
    title,
  });
};

export const openNetworkWarning = () => {
  if (modalfy.isModalOpened(MODALS.network)) {
    return;
  }
  modalfy.open(MODALS.network);
};

export const closeNetworkWarning = () => {
  modalfy.close(MODALS.network);
};

export const openModal = (name: string, params: any) => {
  if (modalfy.isModalOpened(name)) {
    return;
  }
  modalfy.open(name, params);
};

export const closeModal = (name: string) => {
  if (modalfy.isModalOpened(name)) {
    modalfy.close(name);
    return;
  }
};

export const getFileExtensionFromUrl = (url: string) => {
  if (!url) {
    return null;
  }
  const pathSegments = url.split('/');
  const lastSegment = pathSegments[pathSegments.length - 1];
  const fileNameParts = lastSegment.split('.');

  if (fileNameParts.length < 2) {
    return null;
  }

  const fileExtension = fileNameParts.pop() || '';
  return fileExtension.toLowerCase();
};

export const dateFormat = (date: any) => {
  return date ? moment(date).format('DD/MM/YYYY') : '-';
};

export const onFileOpen = async (url: string, fileName: string) => {
  try {
    const downloadDest = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    const options = {
      fromUrl: url,
      toFile: downloadDest,
      background: true,
    };
    startLoader();
    await RNFS.downloadFile(options).promise.then(async () => {
      try {
        await FileViewer.open(downloadDest, {
          displayName: fileName,
          showOpenWithDialog: true,
        });
      } catch (error) {
        showToaster('File not supported', 'E');
      }
    });
  } catch (error) {
    showToaster('File not supported', 'E');
  } finally {
    stopLoader();
  }
};

export const soleFilterArr = (arr: [], sectionArr: []) => {
  const matchedId = getMatchIdQuestion(sectionArr);
  const getSoloTrader = arr.some((val: Question) => {
    return (
      val?.idQuestion === 1025 &&
      val?.answers[0]?.answer !== 'Limited Company' &&
      val?.idSection === 41
    );
  });

  const vatQuestion = arr.some((val: Question) => {
    return (
      val?.idQuestion === 771 &&
      val?.answers[0]?.answer !== 'Yes' &&
      val?.idSection === 41
    );
  });
  const filterSolar = arr.filter((questions: Question) => {
    if (
      [746, 984, 985, 977, 745, 748, 749, 750, 751, 752, 780, 768].includes(
        questions.idQuestion,
      ) &&
      getSoloTrader
    ) {
      return false;
    } else if (questions.idQuestion === 1026 && vatQuestion) {
      return false;
    } else if (
      sectionArr?.length > 0 &&
      questions.idSection === 51 &&
      matchedId !== questions.idQuestion
    ) {
      return false;
    } else {
      return true;
    }
  });

  return filterSolar;
};

export const getFileNameFromUrl = (url: string) => {
  try {
    const decodedFileName = decodeURIComponent(url);
    const parts = decodedFileName.split('/');
    return parts[parts.length - 1];
  } catch (error) {
    console.error('Error parsing URL:', error);
    return null;
  }
};

export const checkInternetConnection = async () => {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected;
  } catch (error) {
    console.error('Error checking internet connection:', error);
    return false;
  }
};
