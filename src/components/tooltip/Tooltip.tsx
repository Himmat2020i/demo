import React from 'react';
import {useToolTipStyle} from './TooltipStyle';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import { ScrollView } from 'react-native';

interface CustomSelectProps {
  isVisible?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  backgroundColor?: string;
  popover?: React.JSX.Element;
  children?: React.JSX.Element;
  width?: string | number | undefined;
}

const CustomSelect = React.memo(({popover, children}: CustomSelectProps) => {
  const {styles} = useToolTipStyle();

  return (
    <Menu>
      <MenuTrigger style={styles.toolContainer}>{children}</MenuTrigger>
      <MenuOptions optionsContainerStyle={styles.infoText}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <MenuOption>{popover}</MenuOption>
        </ScrollView>
      </MenuOptions>
    </Menu>
  );
});

export default CustomSelect;
