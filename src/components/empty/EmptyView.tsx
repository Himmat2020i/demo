import React from 'react';
import {TextStyle, View, ViewStyle} from 'react-native';
import AppText from '../text/AppText';
import {useEmptyViewStyle} from './EmptyViewStyle';
import {EMPTY} from '../../constants/stringConstant';

interface Props {
  emptyText?: string;
  textStyle?: TextStyle;
  containerStyle?: ViewStyle;
}

const EmptyView = React.memo(
  ({emptyText, containerStyle, textStyle}: Props) => {
    const styles = useEmptyViewStyle();
    return (
      <View style={[styles.noDataContainer, containerStyle]}>
        <AppText style={[styles.noDataText, textStyle]}>
          {emptyText || EMPTY}
        </AppText>
      </View>
    );
  },
);

export default EmptyView;
