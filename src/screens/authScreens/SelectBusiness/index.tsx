import React, {useState} from 'react';
import {FlatList, ImageBackground, SafeAreaView} from 'react-native';
import {useSelectBusinessStyle} from './styles';
import ListItem from '../../../components/listItems/ListItem';
import {ONINTERNET, SWITCH_BUSINESS} from '../../../constants/stringConstant';
import FooterButton from '../../../components/footerButton/FooterButton';
import WelcomeLabel from '../../../components/welcomLabel/WelComelabel';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import {
  fetchBusinessSchemeDataDb,
  fetchSchemeAnswerAndStatus,
  getSelectedBusinessScheme,
} from '../../../redux/auth/authSlice';
import {navigate} from '../../../navigation/rootNavigation';
import {
  useLazyBusinessSchemeQuery,
  useLazyCreateAnswerQuery,
  useLazySwitchBusinessQuery,
} from '../../../services/authService';
import {useApplicationStatusandAnswerMutation} from '../../../services/appServices';
import {deleteData, getAllData} from '../../../../Database';
import {ROUTES} from '../../../constants/routeConstant';
import {
  checkInternetConnection,
  showToaster,
  startLoader,
  stopLoader,
} from '../../../helpers/utils';
import {Answer} from '../../appScreens/Details/DataModal';

const SelectBusiness = () => {
  const {styles, colors} = useSelectBusinessStyle();
  const {user} = useSelector((state: RootState) => state.auths);

  const [selectedId, setSelectedId] = useState(user?.idOrganisation || null);
  const businessList = useSelector(
    (state: RootState) => state.auths.businessList,
  );

  const newBL = businessList.reduce((acc, current) => {
    const isBusinessExists = acc.some(
      item => item?.idBusiness === current?.idBusiness,
    );
    if (!isBusinessExists) {
      acc.push(current);
    }
    return acc;
  }, []);

  newBL.sort((a, b) => {
    const orgName = !Number(a?.organisationName)
      ? a?.organisationName?.toUpperCase()
      : a?.organisationName;
    const nameA = orgName;
    const nameB = orgName;
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

  const [switchBusiness] = useLazySwitchBusinessQuery();
  const [businessSchemeListQuery] = useLazyBusinessSchemeQuery();
  const [statusAndAns] = useApplicationStatusandAnswerMutation();
  const [createAnswerQuery] = useLazyCreateAnswerQuery();

  const dispatch = useDispatch();

  const postBeforeDelete = async () => {
    const {idUser, UserType} = user;
    try {
      const answersData = await getAllData('answers');
      const apiResponse = answersData.filter(ans => ans.isTableUpdate);
      const answerParams = apiResponse.map(i => ({
        idScheme: 4,
        idSectionnumber: i?.idSection || 0,
        idApplicationStatus: i?.idApplicationStatus || 0,
        idQuestion: i?.idQuestion || 0,
        idOrganisation: i?.idBusiness || 0,
        idUser: idUser || 0,
        numberIdSection: i?.idSection || 0,
        sectionNameStr: '',
        Answer: i?.answer || '',
      }));
      const params = {
        bid: apiResponse[0]?.idBusiness,
        idScheme: 4,
        idSections: answerParams.map(item => item.idSectionnumber),
        answer: answerParams,
        idUser: idUser,
        userType: UserType,
      };

      createAnswerQuery(params).then(res => {
        if (res) {
        }
      });
    } catch (error) {
      console.error('Error in createAnswerApi:', error);
    } finally {
    }
  };

  const changeBusiness = async (item: {idBusiness: any}) => {
    try {
      const {idBusiness} = item;
      const checkNet = await checkInternetConnection();
      if (!checkNet) {
        showToaster(ONINTERNET, 'E');

        return;
      }
      await switchBusiness(idBusiness).then(async res => {
        const idOrganisation = res?.data?.data?.idOrganisation;
        const idUser = res?.data?.data?.idUser;
        startLoader();
        await postBeforeDelete();
        await Promise.all(
          businessList
            .filter(
              getSelectedBus => getSelectedBus.idBusiness === idOrganisation,
            )
            ?.map(async (business: {idBusiness: any}) => {
              try {
                const {idBusiness} = business;
                const businessSchemesResponse = await businessSchemeListQuery();
                const businessSchemesData = businessSchemesResponse?.data?.data;
                await deleteData('schemeList');
                const payload = {
                  idOrganisation: idOrganisation,
                  businessSchemesData: businessSchemesData,
                };
                dispatch(fetchBusinessSchemeDataDb(payload));

                await Promise.all(
                  businessSchemesData.map(async () => {
                    const statusAndParams = {
                      idScheme: 4,
                      idOrganisation: idBusiness,
                      idUser: idUser,
                    };
                    const ansResp = await statusAndAns(statusAndParams);
                    const {answers, applicationStatus} = ansResp?.data?.data;

                    const answersWithSeparated = answers
                      .map((item: Answer) => {
                        if (
                          item?.answer?.startsWith('http') &&
                          item?.answer?.includes('|')
                        ) {
                          const urls = item.answer
                            .split('|')
                            .filter(url => url);
                          return urls.map(url => ({
                            answer: url,
                            idQuestion: item.idQuestion,
                            idSection: item.idSection,
                            idApplicationStatus: item.idApplicationStatus,
                          }));
                        } else {
                          return {
                            answer: item.answer,
                            idQuestion: item.idQuestion,
                            idSection: item.idSection,
                            idApplicationStatus: item.idApplicationStatus,
                          };
                        }
                      })
                      .flat();
                    if (answersWithSeparated.length > 0) {
                      const addKeyAnswer = await Promise.all(
                        answersWithSeparated.map(async item => ({
                          ...item,
                          idBusiness: idBusiness,
                          isTableUpdate: false,
                        })),
                      );

                      // Update keys object
                      const updateKey = {
                        answers: addKeyAnswer,
                        applicationStatus: applicationStatus,
                      };

                      await deleteData('applicationStatus');
                      await deleteData('answers');
                      dispatch(fetchSchemeAnswerAndStatus(updateKey));
                    } else {
                      await deleteData('answers');
                    }
                  }),
                );
              } catch (error) {
                console.error('Error fetching data:', error);
              }
            }),
        );
      });
      stopLoader();
      setSelectedId(item?.idBusiness);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const renderItems = ({item}: {item: any}) => {
    const isSelect = selectedId === item?.idBusiness;
    return (
      <ListItem
        isSelected={isSelect}
        item={item}
        setSelectedId={changeBusiness}
        nameKey={'organisationName'}
        size={18}
        type={'radio'}
      />
    );
  };
  const onPress = () => {
    dispatch(getSelectedBusinessScheme(selectedId));
    navigate('Home');
  };
  return (
    <ImageBackground source={{uri: 'app_background'}} style={styles.container}>
      <SafeAreaView style={styles.container}>
        <WelcomeLabel
          onPressBack={() => navigate(ROUTES.home)}
          label={SWITCH_BUSINESS.label}
          message={SWITCH_BUSINESS.message}
          labelStyle={styles.label}
          subLabelStyle={styles.subLabel}
          iconColor={colors.primary}
        />
        <FlatList
          data={newBL}
          renderItem={renderItems}
          contentContainerStyle={styles.subContainer}
        />
        <FooterButton
          confirmLabel={'Switch'}
          onPressConfirm={onPress}
          confrimStyle={styles.footer}
          containerStyle={styles.buttonView}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};
export default SelectBusiness;
