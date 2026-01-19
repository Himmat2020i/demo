import React, {useCallback} from 'react';
import {TouchableOpacity, View, ImageBackground, Pressable} from 'react-native';
import {navigate} from '../../../navigation/rootNavigation';
import Svg from '../../../assets/svg';
import AppText from '../../../components/text/AppText';
import {
  getSelectedSchemeQuestions,
  setStateQuestion,
} from '../../../redux/auth/authSlice';
import useHome from './hooks/useHome';
import {findStatus} from '../../../helpers/utils';
import CustomSelect from './components/CustomSelect';
import EmptyView from '../../../components/empty/EmptyView';
import {API_ISSUE, COMMON_STRING} from '../../../constants/stringConstant';

const Home = () => {
  const {
    popUp,
    styles,
    colors,
    iconRef,
    dispatch,
    schemeList,
    isShowModal,
    getUserName,
    onEditPress,
    onItemSelect,
    setIsShowModal,
    onDocumentMonitor,
    getSchemeList,
  } = useHome();

  const onItemPress = useCallback(
    async (item: {idScheme: any}) => {
      const idScheme = item?.idScheme;
      dispatch(getSelectedSchemeQuestions(idScheme));
      dispatch(setStateQuestion(idScheme));

      navigate('Details', {
        idScheme: idScheme,
      });
    },
    [dispatch],
  );

  const renderItem = useCallback(
    item => {
      const status =
        !!item?.applicationStatus.length > 0
          ? item?.applicationStatus[0]?.status
          : COMMON_STRING.applyNow;
      return (
        <TouchableOpacity
          style={styles.touch}
          onPress={() => onItemPress(item)}>
          <View style={styles.schemeItemContainer}>
            <View style={styles.textContainer}>
              <AppText fontFamily={'bold'} style={styles.businessName}>
                {item?.schemeName}
              </AppText>
              <AppText numberOfLines={1} style={styles.businessSubName}>
                {item?.schemeDescription}
              </AppText>
            </View>
            <View
              style={[
                styles.statusContainer,
                {
                  backgroundColor: findStatus(status),
                },
              ]}>
              <AppText style={styles.statusText}>{status}</AppText>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [styles, onItemPress],
  );

  return (
    <ImageBackground source={{uri: 'app_background'}} style={styles.container}>
      <ImageBackground
        source={{uri: 'dashboard'}}
        style={styles.subContainer}
        imageStyle={styles.subContainer}>
        <View ref={iconRef} style={styles.iconContainer}>
          <Pressable hitSlop={20} onPress={popUp} style={styles.icon}>
            <Svg.menuIcon width={18} height={18} fill={colors.white} />
          </Pressable>
        </View>
        <View style={styles.welcomeContainer}>
          <View style={styles.welcomeSubContainer}>
            <AppText style={styles.welcomeText}>Welcome</AppText>
            <AppText numberOfLines={2} fontFamily="bold" style={styles.nameText}>
              {getUserName()}
            </AppText>
          </View>
          <View>
            <View style={styles.logoContainer}>
              <AppText style={styles.logoText}>{getUserName('short')}</AppText>
            </View>
            <Pressable style={styles.editIcon} onPress={onEditPress}>
              <Svg.editIcons fill={colors.primary} width={10} height={10} />
            </Pressable>
          </View>
        </View>
        <Pressable style={styles.subTextContainer} onPress={onDocumentMonitor}>
          <AppText fontFamily="bold" style={styles.documentText}>
            Document Monitor
          </AppText>
          <AppText style={styles.documentSubText}>
            This indicates if your documents are up to date.
          </AppText>
        </Pressable>
      </ImageBackground>

      <View style={styles.schemeContainer}>
        {schemeList.length > 0 && (
          <View style={styles.labelContainer}>
            <AppText fontFamily={'bold'} style={styles.label}>
              Scheme
            </AppText>
          </View>
        )}
        {schemeList.length > 0 ? (
          renderItem(schemeList[0])
        ) : (
          <EmptyView
            emptyText={API_ISSUE}
            textStyle={styles.emptyText}
            containerStyle={styles.emptyContainer}
          />
        )}
      </View>

      {isShowModal && (
        <CustomSelect
          selectArray={getSchemeList()}
          iconRef={iconRef}
          onClose={() => setIsShowModal(false)}
          isVisible={isShowModal}
          onItemSelect={onItemSelect}
        />
      )}
    </ImageBackground>
  );
};

export default Home;
