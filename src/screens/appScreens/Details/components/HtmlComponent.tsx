import React from 'react';
import {View, StyleSheet, Dimensions, Image} from 'react-native';
import HTML, {
  CustomTagRendererRecord,
  HTMLContentModel,
  HTMLElementModel,
  IMGElementProps,
  MixedStyleRecord,
  RenderHTMLProps,
  defaultHTMLElementModels,
  defaultSystemFonts,
  useIMGElementProps,
} from 'react-native-render-html';
import {DEFAULT_COLORS, FONTS} from '../../../../styles';
import {useResponsiveScreen} from '../../../../hooks';

interface HtmlComponentProps {
  htmlContent: string;
  baseStyleColor?: string;
}

const windowWidth = Dimensions.get('window').width;

const HtmlComponent: React.FC<HtmlComponentProps> = ({
  htmlContent,
  baseStyleColor = 'black',
}) => {
  const {hp} = useResponsiveScreen();

  const baseStyle = StyleSheet.create({
    base: {
      fontSize: 18,
      fontFamily: FONTS.regular,
      flexWrap: 'nowrap',
      color: baseStyleColor,
    },
  }).base;
  const systemFonts = [...defaultSystemFonts, FONTS.regular];

  const customImageRenderer = (props: any) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const imgElementProps: IMGElementProps = useIMGElementProps(props);
    return (
      <View style={styles.imageView}>
        <Image
          source={{uri: imgElementProps?.source?.uri}}
          resizeMode="contain"
          resizeMethod="resize"
          style={styles.image}
        />
      </View>
    );
  };

  const renderers: CustomTagRendererRecord = {
    img: customImageRenderer,
  };

  const customHTMLElementModels = {
    label: HTMLElementModel.fromCustomModel({
      tagName: 'label',
      mixedUAStyles: {
        width: '100%',
        alignSelf: 'center',
        fontWeight: 'bold',
        fontFamily: FONTS.bold,
        paddingVertical: hp(10),
      },
      contentModel: HTMLContentModel.block,
    }),
    h4: HTMLElementModel.fromCustomModel({
      tagName: 'h4',
      mixedUAStyles: {
        width: '100%',
        paddingVertical: hp(10),
      },
      contentModel: HTMLContentModel.block,
    }),

    img: defaultHTMLElementModels.img.extend({
      contentModel: HTMLContentModel.mixed,
      mixedUAStyles: {
        borderRadius: 5,
      },
    }),
    table: HTMLElementModel.fromCustomModel({
      tagName: 'table',
      mixedUAStyles: {
        width: '100%',
      },
      contentModel: HTMLContentModel.block,
    }),
    br: HTMLElementModel.fromCustomModel({
      tagName: 'br',
      mixedUAStyles: {
        width: '100%',
        paddingTop: hp(6),
      },
      contentModel: HTMLContentModel.block,
    }),
  };

  const renderHTMLProps: RenderHTMLProps = {
    contentWidth: windowWidth,
    source: {html: htmlContent},
    customHTMLElementModels: customHTMLElementModels,
    ignoredDomTags: [''],
    renderers: renderers,
    systemFonts: systemFonts,
    baseStyle,
  };

  const renderersProps = {
    img: {
      enableExperimentalPercentWidth: true,
    },
  };

  const tagsStyles: MixedStyleRecord = {
          h3: {fontWeight: '700'},
          strong: {fontWeight: 'bold'},
          b: {fontWeight: 'bold'},
          label: {fontWeight: 'bold'},
          a: {color: DEFAULT_COLORS.blue},
          br: { height: 10, display: 'flex' },
          table: {
            marginVertical: 10,
          },
          tr: {
            flexDirection: 'row',
          },
          th: {
            color: 'white',
            padding: 8,
          },
          td: {
            padding: 8,
          },
        }

  return (
    <View style={styles.container}>
      <HTML
        {...renderHTMLProps}
        renderersProps={renderersProps}
        renderers={renderers}
        enableCSSInlineProcessing={true}
        tagsStyles={tagsStyles}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexShrink: 1,
  },
  imageContainer: {
    marginVertical: 10,
  },
  image: {
    width: '60%',
    height: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageView: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(HtmlComponent);
