import React, {useEffect} from 'react';
import {SCREEN_WIDTH} from '../../styles';
import RenderHTML, {
  HTMLContentModel,
  HTMLElementModel,
} from 'react-native-render-html';
import {ScrollView} from 'react-native';
import {useRenderHtmlStyle} from './RenderHtmlStyle';
import {useNavigation, useRoute} from '@react-navigation/native';

const HTMLRender = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const {styles} = useRenderHtmlStyle();

  const source = {
    html: route?.params?.html?.content || '',
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: route?.params?.title || '',
    });
  }, [navigation, route?.params?.title]);

  const customHTMLElementModels = {
    label: HTMLElementModel.fromCustomModel({
      tagName: 'label',
      mixedUAStyles: styles?.label,
      contentModel: HTMLContentModel.mixed,
    }),
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <RenderHTML
        source={source}
        contentWidth={SCREEN_WIDTH}
        enableExperimentalMarginCollapsing
        customHTMLElementModels={customHTMLElementModels}
      />
    </ScrollView>
  );
};

export default HTMLRender;
