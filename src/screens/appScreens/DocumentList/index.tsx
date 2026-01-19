import React, {useEffect, useState} from 'react';
import {useDocumentsListStyle} from './styles';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  View,
  Animated,
} from 'react-native';
import Svg from '../../../assets/svg';
import AppText from '../../../components/text/AppText';
import useDocumentMonitor from './hooks/useDocumentMonitor';
import Collapsible from 'react-native-collapsible';

import {
  dateFormat,
  getFileExtensionFromUrl,
  onFileOpen,
} from '../../../helpers/utils';
import {DEFAULT_COLORS} from '../../../styles';

const DocumentList = () => {
  const {styles, colors} = useDocumentsListStyle();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isOpenColleps, setIsOpenColleps] = useState(true);
  const [rotateValue, setRotateValue] = useState(new Animated.Value(0));
  const [rotateValues, setRotateValues] = useState({});

  const {
    onPressAdd,
    groupData,
    isLoading,
    isFetching,
    refetch,
    onDelete,
    SwipeListView,
  } = useDocumentMonitor();

  const getStatus = (status: string) => {
    switch (status) {
      case 'Submitted':
      case 'Warning':
        return DEFAULT_COLORS.yellow;
      case 'Approved':
        return DEFAULT_COLORS.green;
      case 'Unmonitored':
        return colors.statusBlue;
      default:
        return colors.red;
    }
  };
  const rotateArrow = section => {
    const toValue = isCollapsed[section] ? 1 : 0;
    if (rotateValues[section]) {
      Animated.timing(rotateValues[section], {
        toValue,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };
  const renderItem = ({item}: any) => {
    const {
      monitorField,
      description,
      expiryStatus,
      fileName,
      filePathUrl,
      documentExpiryDate,
    } = item || {};
    return (
      <View style={styles.listContainer}>
        <View style={styles.fileContainer}>
          <Svg.fileIcon height={'100%'} width={'100%'} />
          <AppText numberOfLines={1} style={styles.fileType}>
            {getFileExtensionFromUrl(filePathUrl)}
          </AppText>
        </View>
        <View style={styles.textContainer}>
          <View style={styles.textSubContainer}>
            <AppText numberOfLines={1} fontFamily={'bold'} style={styles.label}>
              {monitorField || ''}
            </AppText>
            {description && (
              <AppText numberOfLines={1} style={styles.subLabel}>
                {description || ''}
              </AppText>
            )}
            <Pressable
              style={styles.linkContainer}
              onPress={() => onFileOpen(filePathUrl, fileName)}>
              <AppText numberOfLines={1} style={styles.fileLink}>
                {fileName || ''}
              </AppText>
            </Pressable>
          </View>
          <View style={styles.dateContainer}>
            <AppText numberOfLines={1} style={styles.date}>
              Expiry : <AppText>{dateFormat(documentExpiryDate || '')}</AppText>
            </AppText>
            <View
              style={[
                styles.statusContainer,
                {backgroundColor: getStatus(expiryStatus)},
              ]}>
              <AppText numberOfLines={1} style={styles.status}>
                {expiryStatus || ''}
              </AppText>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderHidden = ({item}: any) => (
    <View style={styles.hiddenContainer}>
      <Pressable style={styles.iconContainer} onPress={() => onPressAdd(item)}>
        <Svg.editIcon width={30} height={30} fill={colors.white} />
        <AppText style={styles.iconText}>Edit</AppText>
      </Pressable>
      <Pressable
        style={styles.deleteIcon}
        onPress={() => onDelete(item?.idMonitorDocument || '')}>
        <Svg.deleteIcon width={30} height={30} fill={colors.white} />
        <AppText style={styles.iconText}>Delete</AppText>
      </Pressable>
    </View>
  );
  const toggleSection = section => {
    setIsCollapsed({...isCollapsed, [section]: !isCollapsed[section]});
    setIsOpenColleps(!isOpenColleps);
    rotateArrow(section);
  };

  useEffect(() => {
    if (groupData) {
      const initialRotateValues = {};
      Object.keys(groupData).forEach(section => {
        initialRotateValues[section] = new Animated.Value(0);
      });
      setRotateValues(initialRotateValues);
      setIsCollapsed(
        Object.fromEntries(
          Object.keys(groupData).map(section => [section, true]),
        ),
      );
    }
  }, [groupData]);

  useEffect(() => {
    setTimeout(() => {
      setIsOpenColleps(false);
    }, 1500);
  }, []);

  return (
    <ImageBackground source={{uri: 'app_background'}} style={styles.container}>
      <ScrollView
        contentContainerStyle={{paddingBottom: 80}}
        style={styles.container}>
        {Object.keys(groupData).map((section, index) => (
          <View key={index} style={styles.topSection}>
            <Pressable onPress={() => toggleSection(section)}>
              <View style={styles.sectionView}>
                <AppText style={styles.text}>{section}</AppText>
                {rotateValues[section] && (
                  <Animated.View
                    style={{
                      marginRight: 20,
                      transform: [
                        {
                          rotate: rotateValues[section]?.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '180deg'],
                          }),
                        },
                      ],
                    }}>
                    <Svg.simpleArrowUp
                      height={15}
                      width={15}
                      fill={colors.white}
                    />
                  </Animated.View>
                )}
              </View>
            </Pressable>
            <Collapsible
              duration={500}
              collapsed={
                isCollapsed[section] ?? !(index === 0 && isOpenColleps)
              }>
              <SwipeListView
                data={groupData[section]}
                disableRightSwipe
                recalculateHiddenLayout
                useFlatList
                refreshing={isLoading || isFetching}
                onRefresh={refetch}
                renderItem={renderItem}
                renderHiddenItem={renderHidden}
                keyExtractor={(_, index) => index.toString()}
                rightOpenValue={-150}
                previewOpenValue={-150}
                previewRowKey={'0'}
                previewOpenDelay={100}
                showsVerticalScrollIndicator={false}
              />
            </Collapsible>
          </View>
        ))}
      </ScrollView>
      <Pressable style={styles.fabIcon} onPress={() => onPressAdd()}>
        <Svg.addIcon height={18} width={18} fill={colors.white} />
      </Pressable>
    </ImageBackground>
  );
};

export default DocumentList;
