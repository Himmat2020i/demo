import {useContext} from 'react';
import {AppContext} from '../context/AppContext';
import {THEMES} from '../styles/colors';

const useTheme = () => {
  const appData = useContext(AppContext);
  return THEMES[appData.theme || 'light'];
};

export default useTheme;
