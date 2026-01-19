import { useState, useCallback, useMemo, useRef } from "react";
import { Alert, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { NavigationProp, TabActions, useNavigation } from "@react-navigation/native";
import { RootState } from "../../../../redux/store";
import {
  handleSectionPressed,
  updateQuestionListToLocalData,
  updateValidation,
} from "../../../../redux/auth/authSlice";
import { Answer, Question, Section } from "../DataModal";
import { getAllData, updateAnswerInTable } from "../../../../../Database";
import { ALERT, VALIDATION } from "../../../../constants/stringConstant";
import {
  checkInternetConnection,
  getMatchIdQuestion,
  soleFilterArr,
  startLoader,
  stopLoader,
} from "../../../../helpers/utils";
import useCreateApi from "./useCreateApi";
import { navigationRef } from "../../../../navigation/rootNavigation";

const useDetails = ({ idScheme }) => {
  const flatListRef = useRef<FlatList>(null);
  const navigation: NavigationProp<ReactNavigation.RootParamList> = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auths?.user);
  const selectedSections = useSelector(
    (state: RootState) => state.auths?.selectedSection
  );

  const backupAns = useSelector((state: RootState) => state.auths.backupAns);
  const createAnswerApi = useCreateApi();
  const questions = useSelector((state: RootState) => state.auths.questions);

  const [validationCount, setValidationCount] = useState<number[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const { idUser, idOrganisation } = user;

  const sectionInfo = useMemo(
    () =>
      selectedSections
        ?.filter((section: Section) => section)
        .map(({ idSection, sectionName, idScheme }) => ({
          idSection,
          idScheme,
          sectionName,
        })),
    [selectedSections]
  );

  const [selectedSectionId, setSelectedSectionId] = useState(
    sectionInfo[0]?.idSection
  );

  const selectedSection = useMemo(
    () =>
      sectionInfo.find((section) => section.idSection === selectedSectionId),
    [sectionInfo, selectedSectionId]
  );

  const handleSectionPress = async (sectionId: number, newIndex: number) => {
    setSelectedSectionId(sectionId);
    setIndex(newIndex);
    dispatch(
      handleSectionPressed(selectedSections[newIndex]?.idSection, idScheme)
    );
    await createAnswerApi();
  };

  const updateLocalDb = () => {
    dispatch(updateQuestionListToLocalData());
  };
  const onEventClick = useCallback(async () => {
    const checkNet = await checkInternetConnection();
    if (!checkNet) {
      return;
    }

    await createAnswerApi();
  }, [idOrganisation, idUser, createAnswerApi]);

  const handleNavigation = async (direction: number) => {
    try {
      const newIndex = index + direction;
      if (newIndex >= 0 && newIndex < sectionInfo.length) {
        dispatch(
          handleSectionPressed(selectedSections[newIndex]?.idSection, idScheme)
        );
        setIndex(newIndex);
        setSelectedSectionId(sectionInfo[newIndex]?.idSection);

        const jumpToAction = TabActions.jumpTo(`${sectionInfo[newIndex]?.sectionName}${newIndex}`);
        navigationRef.current?.dispatch(jumpToAction);
        updateLocalDb();
        await createAnswerApi();
      }
    } catch (error) {
      console.error("Error updating questions:", error);
    }
  };

  const scrollToLastItem = () => {
    const lastIndices = sectionInfo.map((section) =>
      questions
        .filter((question) => question.idSection === section.idSection)
        .findLastIndex(
          (question) => !question?.answer && !!question.questionMandatory
        )
    );
    const lastIndex = lastIndices.findLastIndex((index) => index !== -1);
    if (lastIndex !== -1) {
      const lastQuestionIndex = lastIndices[lastIndex];

      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: lastQuestionIndex,
          animated: true,
        });
      } else {
        setTimeout(() => {
          if (flatListRef.current) {
            flatListRef.current.scrollToIndex({
              index: lastQuestionIndex,
              animated: true,
            });
          }
        }, 100);
      }
    }
  };
  const validateAnswer = async (
    dispatch,
    question: Question,
    answer,
    isFieldRequiredMessage
  ) => {
    if (!question.questionMandatory && !answer?.answer) {
      return;
    }
    if (
      answer?.answer !== "" &&
      question.questionMandatory &&
      question.controlFormat
    ) {
      const isShowValidation = new RegExp(question.controlFormat).test(
        answer?.answer
      )
        ? ""
        : VALIDATION.valueNotValid;
      dispatch(
        updateValidation({
          sectionId: question.idSection,
          questionId: answer.idQuestion,
          isShowValidation,
        })
      );
    } else if (answer?.answer === "" && question.questionMandatory) {
      dispatch(
        updateValidation({
          sectionId: question.idSection,
          questionId: answer.idQuestion,
          isShowValidation: isFieldRequiredMessage,
        })
      );
    }
  };

  const validateAnswerForDoc = async (
    dispatch,
    question,
    answer,
    isFieldRequiredMessage
  ) => {
    if (answer.length === 0 && question.questionMandatory) {
      const isShowValidation = isFieldRequiredMessage;

      dispatch(
        updateValidation({
          sectionId: question.idSection,
          questionId: question.idQuestion,
          isShowValidation,
        })
      );
    }
  };

  const onSubmit = useCallback(
    async (callback) => {
      try {
        const matchedId = getMatchIdQuestion(questions);
        const notAnComSelected = questions.some(
          (item: Question) =>
            item.idQuestion === 1025 &&
            item?.answers[0]?.answer !== "Limited Company"
        );

        const excludedIds = [
          746,
          984,
          985,
          977,
          745,
          748,
          749,
          750,
          751,
          752,
          780,
          768,
        ];
        const filterQuestion = questions.filter((question: Question) => {
          if (
            question.idSection === 41 &&
            notAnComSelected &&
            !!excludedIds.includes(question.idQuestion)
          ) {
            return false;
          } else if (
            question.idSection === 51 &&
            matchedId !== question.idQuestion
          ) {
            return false;
          } else {
            return true;
          }
        });
        const newValidationCounts = await Promise.all(
          selectedSections.map(async (section: Section) => {
            const sectionQuestions = filterQuestion.filter(
              (question: Question) => question.idSection === section.idSection
            );
            const sectionValidationPromises = [];
            const filterSolar = soleFilterArr(sectionQuestions, questions);
            filterSolar.forEach((question: Question) => {
              if (
                question.idControl === 10 &&
                question?.answers?.every((ans: Answer) => ans.answer === "")
              ) {
                sectionValidationPromises.push(
                  validateAnswerForDoc(
                    dispatch,
                    question,
                    [],
                    VALIDATION.fieldRequired
                  )
                );
              } else {
                question.answers.forEach((answer: Answer) => {
                  if (
                    answer?.answer !== "" &&
                    question.questionMandatory &&
                    question.controlFormat
                  ) {
                    const isShowValidation = new RegExp(
                      question.controlFormat
                    ).test(answer?.answer)
                      ? ""
                      : VALIDATION.valueNotValid;
                    sectionValidationPromises.push(
                      validateAnswer(
                        dispatch,
                        question,
                        answer,
                        isShowValidation
                      )
                    );
                  } else if (question?.idControl !== 10) {
                    sectionValidationPromises.push(
                      validateAnswer(
                        dispatch,
                        question,
                        answer,
                        VALIDATION.fieldRequired
                      )
                    );
                  }
                });
              }
            });

            const unansweredMandatoryCount = (
              await Promise.all(
                sectionValidationPromises.concat(
                  filterSolar.map(async (question: Question) => {
                    const regex = new RegExp(question.controlFormat).test(
                      question?.answers[0]?.answer
                    );
                    if (
                      question?.answers[0]?.answer !== "" &&
                      question?.questionMandatory &&
                      question?.controlFormat &&
                      question?.questionLabel === "Post Code" &&
                      !regex
                    ) {
                      return true;
                    } else {
                      if (
                        question.idControl === 10 &&
                        question?.answers?.every(
                          (ans: Answer) => ans.answer === ""
                        ) &&
                        !!question.questionMandatory
                      ) {
                        return true;
                      }
                      if (
                        question.idControl !== 10 &&
                        !!question.questionMandatory &&
                        question.answers.some(
                          (answer: Answer) => answer?.answer === ""
                        )
                      ) {
                        return true;
                      }
                    }
                  })
                )
              )
            ).filter(Boolean).length;

            return unansweredMandatoryCount;
          })
        );

        if (callback) {
          callback(newValidationCounts);
        }

        setValidationCount(newValidationCounts);
      } catch (error) {
        console.error("Error handling submit:", error);
      }
    },
    [dispatch, questions, selectedSections, setValidationCount]
  );
  const nextSub = index < sectionInfo.length - 1;

  const onInfoPress = () => {
    setModalVisible(!isModalVisible);
  };

  const onQuestionSelect = useCallback(
    async (selectedSectionId: any) => {
      setSelectedSectionId(selectedSectionId);
      const newIndex = sectionInfo.findIndex(
        (section: { idSection: any }) => section.idSection === selectedSectionId
      );

      try {
        if (newIndex >= 0 && newIndex < sectionInfo.length) {
          dispatch(
            handleSectionPressed(
              selectedSections[newIndex]?.idSection,
              idScheme
            )
          );
          setIndex(newIndex);
          setSelectedSectionId(sectionInfo[newIndex]?.idSection);
          const jumpToAction = TabActions.jumpTo(`${sectionInfo[newIndex]?.sectionName}${newIndex}`);
          navigationRef.current?.dispatch(jumpToAction);
        }
      } catch (error) {
        console.error("Error updating questions:", error);
      }
    },
    [dispatch, idScheme, sectionInfo, selectedSections]
  );

  const exit = async () => {
    try {
      backupAns.forEach(async (backupAnswer: Answer) => {
        const { idQuestion, idSection, answer } = backupAnswer;
        await updateAnswerInTable(idQuestion, idSection, answer, false);
      });
      navigation.goBack();
    } catch (error) {
      console.error("Error updating answers:", error);
    }
  };

  const saveAndGoBack = async () => {
    try {
      startLoader();
      updateLocalDb();
      await createAnswerApi();
      stopLoader();

      navigation.goBack();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleHeaderLeftPress = async () => {
    const answersData = await getAllData("answers");
    let apiResponse = [];
    apiResponse = answersData.filter((ans: Answer) => ans.isTableUpdate);

    if (apiResponse.length > 0) {
      const checkNet = await checkInternetConnection();
      if (!checkNet) {
        navigation.goBack();
        return;
      }

      Alert.alert(
        ALERT.saveExit,
        ALERT.wantExit,
        [
          {
            text: ALERT.exit,
            onPress: () => exit(),
            style: "cancel",
          },
          {
            text: ALERT.save,
            onPress: () => saveAndGoBack(),
          },
        ],
        { cancelable: false }
      );
    } else {
      navigation.goBack();
    }
  };

  return {
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
    scrollToLastItem,
    onEventClick,
    handleHeaderLeftPress,
  };
};

export default useDetails;
