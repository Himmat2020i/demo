import axios from 'axios';
import {OTA_BASE_URL} from '../constants/constants';
import {URLS} from '../constants/urlsConstant';
import {getEnvConfig} from '../helpers/configService';
import RNFS from 'react-native-fs';
import {Alert, NativeModules, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { insertAndCreateTables } from '../redux/auth/authSlice';
import { deleteData, getAllData } from '../../Database';

export const checkVersion = async () => {
  const version = DeviceInfo.getVersion();
  const buildNumber =  DeviceInfo.getBuildNumber();
  const checksumData = await getAllData('config');
  const checksum = checksumData?.[0]?.checksum || '';

  const params = new URLSearchParams({
    appName: 'com.in8it.uktsa',
    platform: Platform.OS === 'android' ? 'Android' : 'iOS',
    appVersion: `${version}.${buildNumber}`,
    environment: getEnvConfig('ENV_NAME') || '',
    checksum: checksum || '',
  }).toString();

  axios
    .get(`${OTA_BASE_URL}${URLS.checkVersion}?${params}`, {
      method: 'GET',
      headers: {
        'X-Public-Key': getEnvConfig('OTA_KEY'),
      },
    })
    .then(res => {
      if (res?.data?.id) {
        downloadBundleFile(res?.data?.id || '', res?.data?.checksum);
      }
    });
};

const downloadBundleFile = async (id: string, checksum: string) => {
  const {LivePatchModule} = NativeModules;
  const fileName =
    Platform.OS === 'android' ? 'index.android.bundle' : 'main.jsbundle';
  try {
    const downloadDest = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    const options = {
      fromUrl: `${OTA_BASE_URL}${URLS.downloadBundle(id)}`,
      toFile: downloadDest,
      background: true,
    };
    await RNFS.downloadFile(options).promise.then(async () => {
      try {
        LivePatchModule.saveData('url', downloadDest);
        const mydata = await getAllData('config');
            if (mydata?.length) {
              await deleteData('config');
            }
            const data = {
              config: [{checksum}]
            }
            if (getEnvConfig('ENV_NAME') !== 'Production') {
              Alert.alert("Update Installed", "Latest updates installed successfully. Please restart the app to explore the new features")
            }
            insertAndCreateTables(data);
      } catch (error) {}
    });
  } catch (error) {}
};
