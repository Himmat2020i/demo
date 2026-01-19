import Config from "react-native-config";

type configKey = 'API_URL' | 'ENV_NAME' | 'OTA_KEY' | 'ADDRESS_SEARCH_URL';

export const getEnvConfig = (key: configKey) => Config[key];
