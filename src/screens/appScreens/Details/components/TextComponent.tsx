import React, { useCallback } from 'react';
import {View} from 'react-native';
import AppText from '../../../../components/text/AppText';
import {useTextComponentStyle} from './TextComponentStyle';
import {Question} from '../DataModal';
import HtmlComponent from './HtmlComponent';
import Svg from '../../../../assets/svg';
import CustomSelect from '../../../../components/tooltip/Tooltip';

interface TextComponentProps {
  item: Question;
  index: number;
}

const TextComponent: React.FC<TextComponentProps> = ({item}) => {
  const {styles, colors} = useTextComponentStyle();
  const html = `<div style='color:black'>${item?.questionHelpText || ''}</div>`

  const renderPopover = useCallback(() => (
    item?.questionHelpText ? (
      <CustomSelect
        popover={
        <HtmlComponent
          htmlContent={html}
        />
        }>
        <Svg.infoIcon fill={colors.appBlue} height={15} width={15} />
        </CustomSelect>
    ) : <></>
  ), [item?.questionHelpText, html, colors.appBlue]);

  return (
    <View style={styles.controlContainer}>
      {!!item?.questionHeaderDescription && (
        <HtmlComponent
          htmlContent={item?.questionHeaderDescription}
        />
      )}
      <View style={styles.topRowView}>
        {!!item?.questionCode && item?.questionCode !== null && (
          <AppText
            style={[styles.qCode, {}]}>{`${item?.questionCode} - `}</AppText>
        )}
        {!!item?.question && (
          <View style={styles.controlContainer}>
            <AppText style={[styles.controlContainer, {flexDirection: 'row'}]}>
              <AppText style={[styles.qText, {}]}>{item?.question} </AppText>
              {!!item?.questionMandatory && !item?.questionLabel && (
                <AppText style={styles.star}>* </AppText>
              )}
              {!item?.questionLabel && renderPopover()}
            </AppText>
          </View>
        )}
      </View>
      {!!item?.questionLabel && (
        <AppText style={styles.qLabelText}>
          <AppText style={styles.qLabel}>{item?.questionLabel}</AppText>
          {!!item?.questionMandatory && (
            <AppText style={styles.star}>* </AppText>
          )}
          {renderPopover()}
        </AppText>
      )}
    </View>
  );
};

export default TextComponent;
