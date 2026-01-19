import React, {useMemo, useRef, useCallback, useEffect, useState} from 'react';
import {
  View,
  FlatList,
  Alert,
  ImageBackground,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  BackHandler,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDetailsStyle} from './styles';
import SectionTab from './components/SectionTab';
import RenderItems from './components/RenderItems';
import AppButton from '../../../components/button/AppButton';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import CustomModal from './components/customModel/CustomModal';
import useDetails from './hook/useDetails';
import {useLazySubmitApplicationQuery} from '../../../services/authService';
import {
  checkInternetConnection,
  showToaster,
  startLoader,
  stopLoader,
} from '../../../helpers/utils';
import Svg from '../../../assets/svg';
import AppText from '../../../components/text/AppText';
import useCheckQuestionVisibility from './useCheckQuestionVisibility';
import {ALERT, BUTTONS, ONINTERNET} from '../../../constants/stringConstant';
import {updateStatus} from '../../../redux/auth/authSlice';
import EmptyView from '../../../components/empty/EmptyView';
import { AppEventsLogger } from 'react-native-fbsdk-next';

interface DetailsProps {}

const Details: React.FC<DetailsProps> = ({route}) => {
  const {idScheme} = route.params;
  const navigation = useNavigation();
  const {styles, colors} = useDetailsStyle();

  const {
    flatListRef,
    validationCount,
    isModalVisible,
    index,
    selectedSection,
    handleSectionPress,
    handleNavigation,
    onSubmit,
    nextSub,
    onInfoPress,
    onQuestionSelect,
    onEventClick,
    handleHeaderLeftPress,
  } = useDetails({idScheme});

  const [executeOnSubmit, setExecuteOnSubmit] = React.useState(false);
  const [submitApp] = useLazySubmitApplicationQuery();
  const [fromInput, setFromInput] = useState(false);
  const infoIconRef = useRef<any>(null);
  const selectedSections = useSelector(
    (state: RootState) => state.auths.selectedSection,
  );
  const user = useSelector((state: { auths: RootState }) => state.auths?.user);

  const {questions, selectedSectionQuestions, schemeList} = useSelector(
    (state: RootState) => state.auths,
  );
  const status = schemeList[0]?.applicationStatus[0]?.status?.toLowerCase?.() === 'approved'  || schemeList[0]?.applicationStatus[0]?.status?.toLowerCase?.() === 'archived';
  const dispatch = useDispatch();
  const {getFilter} = useCheckQuestionVisibility(
    selectedSectionQuestions,
    questions,
  );

  const getFilterData = getFilter();

  const sectionInfo = useMemo(
    () =>
      selectedSections ??
      []
        ?.filter(section => section)
        .map(({idSection, sectionName, idScheme}) => ({
          idSection,
          idScheme,
          sectionName,
        })),
    [selectedSections],
  );

  const finalOnSubmitApp = useCallback(
    async (count: number[]) => {
      try {
        const valCount = count.filter(k => k > 0).length > 0;
        if (valCount) {
          onInfoPress();
          stopLoader();
        } else {
          const param = {idScheme: 4};

          const checkNet = await checkInternetConnection();

          if (!checkNet) {
            stopLoader();
            showToaster(ONINTERNET, 'E');
            return;
          }
          submitApp(param).then(suc => {
            if (suc?.data?.statusCode === 200) {
              AppEventsLogger.logEvent('application_submit', {
                userId: user?.idUser,
              });
             const statusUpdate = suc?.data?.data?.status || 'Submitted';
            dispatch(updateStatus(statusUpdate));
            if (suc?.data?.message) {
              Alert.alert('', suc?.data?.message, [
              {text: 'OK', onPress: () => {}},
            ]);
            }
            }
            try {
            } catch (error) {
              console.error('Error parsing JSON:', error);
            }
          });
        }
      } catch (error) {
        console.error('Error in :', error);
      } finally {
      }
    },
    [onInfoPress, submitApp],
  );
  useEffect(() => {
    const localAndInput = async () => {
      if (executeOnSubmit) {
        if (fromInput) {
          setTimeout(() => {
            onSubmit((count: any) => {
              finalOnSubmitApp(count);
            });
          }, 10);
        } else {
          onSubmit(() => {});
        }
        setExecuteOnSubmit(false);
        setFromInput(false);
      }
    };
    localAndInput();
  }, [fromInput, executeOnSubmit, onSubmit, finalOnSubmitApp]);

  const selectedSectionId = sectionInfo[0]?.idSection;

  const selectedSectionName = selectedSection?.sectionName || '';

  const renderItem = useCallback(
    ({item}) => {
      const key = `${item?.id?.toString()}-${index}`;
      return (
        <RenderItems
          onInputChange={() => {
            if (validationCount.length > 0) {
              setExecuteOnSubmit(true);
              setFromInput(false);
            }
          }}
          key={key}
          index={index}
          item={item}
        />
      );
    },
    [index, validationCount],
  );

  const valCount = validationCount.filter(k => k > 0).length > 0;

  const measureView = useCallback(() => {
    if (infoIconRef?.current) {
      infoIconRef.current?.measureInWindow(() => {
        onInfoPress();
      });
    }
  }, [onInfoPress]);

  const headerRight = useCallback(
    () =>
      valCount ? (
        <Pressable ref={infoIconRef} onPress={measureView}>
          <Svg.infoIcon height={18} width={18} fill={colors.red} />
        </Pressable>
      ) : (
        <></>
      ),
    [colors, measureView, valCount],
  );

  const headerTitle = useCallback(
    () => (
      <AppText numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
        {selectedSectionName}
      </AppText>
    ),
    [selectedSectionName, styles],
  );

  const headerLeft = useCallback(
    () => (
      <Pressable hitSlop={30} onPress={() => handleHeaderLeftPress()}>
        <Svg.backIcon height={18} width={18} fill={colors.white} />
      </Pressable>
    ),
    [colors, handleHeaderLeftPress],
  );

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitleAlign: 'center',
      headerLayoutPresent: 'left',
      headerTitle,
      headerRight,
      headerLeft,
    });
  }, [headerRight, headerTitle, headerLeft, navigation]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (index > 0) {
          handleNavigation(-1);
          return true;
        } else {
          handleHeaderLeftPress();
          return true;
        }
      },
    );

    return () => backHandler.remove();
  }, [index, handleNavigation, handleHeaderLeftPress]);

  const submitValidationMsg = useMemo(() =>
    schemeList[0]?.applicationStatus[0]?.status?.toLowerCase?.() === 'approved' ? ALERT.statusApproved : ALERT.statusArchived
  , [schemeList]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={60}
      >
      <View style={styles.container}>
        <View style={styles.tabHeight}>
          <SectionTab
            sectionInfo={sectionInfo}
            selectedTabIndex={index}
            validationCounts={validationCount}
            onPress={handleSectionPress}
          />
        </View>
        <ImageBackground
          source={{uri: 'app_background'}}
          style={styles.subContainer}>
              <FlatList
                ref={flatListRef}
                key={`${selectedSectionId}-${index}`}
                contentContainerStyle={styles.contentContainer}
                data={getFilterData}
                ListEmptyComponent={
                  <EmptyView
                    emptyText={'No Data Found'}
                    textStyle={styles.emptyText}
                    containerStyle={styles.emptyCont}
                  />
                }
                renderItem={renderItem}
                keyExtractor={(item, index) =>
                  `${item?.id?.toString()}-${item?.idSection}-${index}`
                }
              />

          <View style={styles.buttonView}>
            {index > 0 && (
              <AppButton
                style={[styles.loginButton]}
                title={BUTTONS.previous}
                onPress={() => handleNavigation(-1)}
                labelStyle={styles.labelStyle}
              />
            )}
            <AppButton
              style={[styles.loginButton, {width: index > 0 ? '45%' : '100%'}]}
              title={nextSub ? BUTTONS.next : BUTTONS.submit}
              onPress={async () => {
                const delay = ms =>
                  new Promise(resolve => setTimeout(resolve, ms));
                await delay(50);
                try {
                  if (!status && !nextSub) {
                    startLoader();
                    await onEventClick(); // in both cases this api will call...
                  }
                  if (nextSub) {
                    handleNavigation(1);
                  } else {
                    if (status) {
                      Alert.alert(ALERT.appStatus, submitValidationMsg);
                    } else {
                      setFromInput(true);
                      setExecuteOnSubmit(true);
                    }
                  }
                } catch (error) {
                  console.error('Error in onPress:', error);
                }
              }}
              labelStyle={styles.labelStyle}
            />
          </View>
        </ImageBackground>
        {isModalVisible && (
          <CustomModal
            isVisible={isModalVisible}
            onClose={onInfoPress}
            iconRef={infoIconRef}
            SchemeID={idScheme}
            onQuestionSelect={onQuestionSelect}
            questions={questions}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default React.memo(Details);
