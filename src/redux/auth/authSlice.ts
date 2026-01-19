import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import authApi from "../../services/authService";
import { storeData } from "../../helpers/localstorage";
import { ASYNC_STORE_VAR } from "../../constants/constants";
import {
  createTable,
  deleteData,
  getAllData,
  getDataById,
  insertData,
  insertDocData,
  updateAnswerInTable,
  updateAnswerToEmpty,
  updateStatusInTable,
} from "../../../Database";
import { setAuthToken } from "../../helpers/api";
import {
  Answer,
  Business,
  BusinessScheme,
  Control,
  Question,
  QuestionControlOption,
  QuestionSectionRelation,
  Scheme,
  SchemeSectionRelation,
  Section,
  UserData,
} from "../../screens/appScreens/Details/DataModal";
import store from "../store";

interface AuthState {
  user: UserData;
  token: string;
  businessforContractorById?: Business[];
  businessList?: Business[];
  schemeList?: BusinessScheme[];
  getAllSchemesData?: any[];
  selectedSection?: Section[];
  schemeSectionRelations?: SchemeSectionRelation[];
  sections?: Section[];
  questionSectionRelations?: QuestionSectionRelation[];
  questions?: Question[];
  selectedSectionQuestions?: Question[];
  answers?: Answer[];
  controls?: Control[];
  questionControlOptions?: QuestionControlOption[];
  backupAns: Answer[];
  TradePayload: object;
  checksum: string;
}

const initialState: AuthState = {
  // eslint-disable-next-line prettier/prettier
  user: {} as UserData,
  token: "",
  businessforContractorById: [],
  businessList: [],
  schemeList: [],
  getAllSchemesData: [],
  schemeSectionRelations: [],
  selectedSection: [],
  sections: [],
  questionSectionRelations: [],
  questions: [],
  answers: [],
  controls: [],
  questionControlOptions: [],
  selectedSectionQuestions: [],
  backupAns: [],
  TradePayload: {},
  checksum: '',
};

export const createdTables: string[] = [];

const authSlice = createSlice({
  name: "auths",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
    getSchemesFromLocal: (state, action: PayloadAction<any[]>) => {
      state.schemeList = action.payload;
    },
    getBusinessFromLocal: (state, action: PayloadAction<Business[]>) => {
      const bList =
        action?.payload?.length === 0 ? state?.businessList : action.payload;
      state.businessList = bList;
    },
    setBackupAns: (state, action: PayloadAction<Answer[]>) => {
      state.backupAns = action.payload;
    },

    setSelectedSections: (state, action: PayloadAction<Section[]>) => {
      const sortSections = action.payload?.sort(
        (a, b) => a.sectionSortOrder - b.sectionSortOrder
      );
      state.selectedSection = sortSections;
    },

    storeDataInLocal: (state, action: PayloadAction<any>) => {
      const answers = action?.payload?.answers;
      const controls = action?.payload?.controls;
      const questionControlOptions = action?.payload?.questionControlOptions;
      const questionSectionRelations =
        action?.payload?.questionSectionRelations;
      const questions = action?.payload?.questions;
      const schemeSectionRelations = action?.payload?.schemeSectionRelations;
      const sections = action?.payload?.sections;
      state.questions = questions;
      state.answers = answers;
      state.controls = controls;
      state.sections = sections;
      state.schemeSectionRelations = schemeSectionRelations;
      state.questionControlOptions = questionControlOptions;
      state.questionSectionRelations = questionSectionRelations;
    },

    updateStateQuestion: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
    },
    savePayload: (state, action: PayloadAction<Question[]>) => {
      state.TradePayload = action.payload;
    },
    setSelectedQuestions: (state, action: PayloadAction<Question[]>) => {
      const sortedQuestions = groupAndSortQuestions(action.payload);
      const isCompanySelected = sortedQuestions.some(
        (item: Question) =>
          item.idQuestion === 1025 &&
          item?.answers[0]?.answer === "Limited Company"
      );
      const isSoleSelected = sortedQuestions.some(
        (item: Question) =>
          item.idQuestion === 1025 && item?.answers[0]?.answer === "Sole Trader"
      );
      const other = sortedQuestions.some(
        (item: Question) =>
          item.idQuestion === 1025 && item?.answers[0]?.answer === "Other"
      );
      const modifiedQuestions = sortedQuestions.map((item: Question) => {
        if (item.idQuestion === 755) {
          if (
            other &&
            (state?.TradePayload?.questionId === 755 ||
              state?.TradePayload?.questionId === 1025)
          ) {
            return {
              ...item,
              answers: [
                {
                  ...item.answers[0],
                  answer: state.TradePayload?.answer || "",
                },
              ],
            };
          } else {
            if (isCompanySelected) {
              return {
                ...item,
                answers: [{ ...item.answers[0], answer: "Director" }],
              };
            } else if (isSoleSelected) {
              return {
                ...item,
                answers: [{ ...item.answers[0], answer: "Proprietor" }],
              };
            }
          }
        } else if ([745, 751, 752].includes(item.idQuestion)) {
          return {
            ...item,
            questionMandatory: 1,
          };
        }
        return item;
      });

      state.selectedSectionQuestions = modifiedQuestions;
      const filterTopQuestions = state.questions?.map((question: Question) => {
        const modifiedQuestion = modifiedQuestions.find(
          (q) => q.idQuestion === 755 && q.idSection === 41
        );
        return modifiedQuestion &&
          question.idSection === 41 &&
          question.idQuestion === 755
          ? modifiedQuestion
          : question;
      });
      state.questions = filterTopQuestions;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        const { data, statusCode } = action.payload || {};
        const token = data?.token;
        if (statusCode === 200) {
          setAuthToken(token);
          state.user = data;
          state.token = token;

          storeData(ASYNC_STORE_VAR.user, data);

          storeData(ASYNC_STORE_VAR.token, token);
          storeData(ASYNC_STORE_VAR.refreshToken, data?.refreshToken);
        }
      }
    );
    builder.addMatcher(
      authApi.endpoints.switchBusiness.matchFulfilled,
      (state, action) => {
        const { data } = action.payload || {};
        state.user = data;
        const token = data?.token;
        setAuthToken(token);
        state.token = token;
        storeData(ASYNC_STORE_VAR.user, data);
        storeData(ASYNC_STORE_VAR.token, token);
        storeData(ASYNC_STORE_VAR.refreshToken, data?.refreshToken);
      }
    );
    builder.addMatcher(
      authApi.endpoints.businessInfo.matchFulfilled,
      (state, action) => {
        state.businessList = action.payload?.data;
      }
    );
  },
});

const tablesToDeleteData = [
  "schemes",
  "schemeSectionRelations",
  "sections",
  "questionSectionRelations",
  "businessList",
  "questions",
  "schemeList",
  "answers",
  "controls",
  "applicationStatus",
  "questionControlOptions",
];

export const deleteAllData = () => async () => {
  try {
    for (const tableName of tablesToDeleteData) {
      await deleteData(tableName);
    }
  } catch (error) {
    console.error("Error deleting data:", error);
  }
};

export const getSelectedBusinessScheme = (idBusiness: number) => async () => {
  try {
    const selectedBusinessScheme = await getDataById("schemeList", idBusiness);
    store.dispatch(getSchemesFromLocal(selectedBusinessScheme));
  } catch (error) {
    console.error("Error getting selected business scheme:", error);
  }
};

export const updateQuestionListToLocalData = () => async (
  dispatch,
  getState
) => {
  try {
    const state = getState();
    const { questions } = state.auths;
    const updatedQuestions = [];
    const updatePromises = [];

    for (const question of questions) {
      const { answers } = question;
      const updatedAnswers = answers.map(async (answer: Answer) => {
        if (
          answer?.isTableUpdate &&
          answer?.input &&
          answer.id === question.id &&
          answer?.idSection
        ) {
          return {
            ...answer,
          };
        }
        return null;
      });
      const filteredAnswers = (await Promise.all(updatedAnswers)).filter(
        (answer) => answer !== null
      );
      updatePromises.push(...filteredAnswers);
    }
    const updatedAnswers = await Promise.all(updatePromises);
    updatedQuestions.push(...updatedAnswers);
    dispatch(updateAnswersInDatabase(updatedQuestions));
    const updateQuestion = questions.map((q) => {
      const updateAnswer = q.answers.map((a) => {
        return {
          ...a,
          input: false,
        };
      });
      return {
        ...q,
        answers: updateAnswer,
      };
    });
    dispatch(updateStateQuestion(updateQuestion));
  } catch (error) {
    console.error("Error updating questions and answers:", error);
  }
};

export const updateDoc = (payload) => async (dispatch, getState) => {
  try {
    const state = getState();
    const { selectedSectionQuestions, user } = state.auths;
    const { idOrganisation } = user;
    const updatedQuestions = selectedSectionQuestions.map((question) => {
      if (
        question.idQuestion === payload.questionId &&
        question.idSection === payload.sectionId
      ) {
        let upAns = [];
        if (payload?.isRemove) {
          upAns = question?.answers.filter((ans) => ans.id !== payload.id);
        } else {
          if (
            question.answers.length === 1 &&
            question.answers[0].answer === ""
          ) {
            upAns.push({
              answer: payload.answer,
              idBusiness: idOrganisation,
              idQuestion: payload.questionId,
              idSection: payload.sectionId,
              id: payload.id,
              isTableUpdate: true,
            });
          } else {
            upAns = question.answers.map((ans) => ({ ...ans }));
            upAns.push({
              answer: payload.answer,
              idBusiness: idOrganisation,
              idQuestion: payload.questionId,
              idSection: payload.sectionId,
              id: payload.id,
              isTableUpdate: true,
            });
          }
        }
        return {
          ...question,
          isShowValidation: "",
          answers: upAns,
        };
      }
      return question;
    });
    dispatch(setSelectedQuestions(updatedQuestions));
    // Update stateQuestions
    const stateQuestions = getState().auths.questions;
    const updatedStateQuestions = stateQuestions.map((question) => {
      if (
        question.idQuestion === payload.questionId &&
        question.idSection === payload.sectionId
      ) {
        let upAnss = [];
        if (payload?.isRemove) {
          upAnss = question?.answers.filter((ans) => ans.id !== payload.id);
        } else {
          if (
            question.answers.length === 1 &&
            question.answers[0].answer === ""
          ) {
            upAnss.push({
              answer: payload.answer,
              idBusiness: idOrganisation,
              idQuestion: payload.questionId,
              idSection: payload.sectionId,
              id: payload.id,
              isTableUpdate: true,
            });
          } else {
            upAnss.push(...question.answers, {
              answer: payload.answer,
              idBusiness: idOrganisation,
              idQuestion: payload.questionId,
              idSection: payload.sectionId,
              id: payload.id,
              isTableUpdate: true,
            });
          }
        }
        return {
          ...question,
          isShowValidation: "",
          answers: upAnss,
        };
      }
      return question;
    });
    dispatch(updateStateQuestion(updatedStateQuestions));
    if (payload?.isRemove) {
      await updateAnswerToEmpty("answers", payload);
    } else {
      await insertDocData("answers", {
        answer: payload?.answer,
        idBusiness: idOrganisation,
        idQuestion: payload?.questionId,
        idSection: payload?.sectionId,
        isTableUpdate: true,
      });
    }
  } catch (error) {
    console.error("Error updating answer==>>:", error);
  }
};

export const updateStatus = (payload) => async () => {
  try {
    let status = payload?.status ? payload.status : payload;
    const schemeList = await getAllData("schemeList");
    await updateStatusInTable(status);
    const updateStatusSchemeList = schemeList.map((scheme) => {
      if (!Array.isArray(scheme.applicationStatus)) {
        scheme.applicationStatus = [];
      }
      if (scheme.applicationStatus.length === 0) {
        scheme.applicationStatus.push({ status: status });
      } else {
        scheme.applicationStatus[0].status = status;
      }

      return scheme;
    });
    store.dispatch(getSchemesFromLocal(updateStatusSchemeList));
  } catch (error) {
    console.error("Error updating status:", error);
  }
};

export const updateAnswer = (payload) => async (dispatch, getState) => {
  try {
    const state = getState();
    const { selectedSectionQuestions } = state.auths;
    const updatedQuestions = selectedSectionQuestions.map((question) => {
      if (
        question?.idQuestion === payload?.questionId &&
        question?.idSection === payload?.sectionId
      ) {
        const updatedAnswers = question?.answers
          ?.map((answer: Answer) => {
            if (
              answer.idSection === payload.sectionId &&
              answer?.idBusiness === payload?.idBusiness
            ) {
              return {
                ...answer,
                answer: payload.answer,
                isTableUpdate: true,
                idBusiness: payload.idBusiness,
              };
            }
            return answer;
          })
          .filter((i) => i.answer !== "");
        return {
          ...question,
          answers:
            updatedAnswers.length === 0
              ? [
                  {
                    answer: payload?.answer,
                    idBusiness: payload?.idBusiness,
                    idQuestion: payload?.questionId,
                    idSection: payload?.sectionId,
                    id: payload?.id,
                    isTableUpdate: true,
                  },
                ]
              : updatedAnswers,
        };
      }
      return question;
    });
    dispatch(savePayload(payload));
    dispatch(setSelectedQuestions(updatedQuestions));

    const updatedStateQuestions = state.auths.questions.map(
      (question: Question) => {
        if (
          question.idQuestion === payload.questionId &&
          question.idSection === payload.sectionId
        ) {
          const updatedStateAnswers = question?.answers?.map(
            (answer: Answer) => {
              if (answer.idSection === payload.sectionId) {
                return {
                  ...answer,
                  answer: payload.answer,
                  idBusiness: payload?.idBusiness,
                  idQuestion: payload.questionId,
                  idSection: payload.sectionId,
                  isTableUpdate: true,
                  input: true,
                  id: payload.id,
                };
              }
              return answer;
            }
          );
          return {
            ...question,
            answers: updatedStateAnswers,
          };
        }
        return question;
      }
    );
    await dispatch(updateStateQuestion(updatedStateQuestions));
  } catch (error) {
    console.error("Error updating answer:", error);
  }
};
export const updateValidation = (payload: {
  isShowValidation: any;
  sectionId: number;
  questionId: number;
}) => (dispatch: any, getState: any) => {
  try {
    const state = getState();
    const { questions } = state.auths;

    const updatedQuestions = questions.map((question: Question) => {
      if (
        question.idQuestion === payload.questionId &&
        question.idSection === payload.sectionId
      ) {
        return {
          ...question,
          isShowValidation: payload?.isShowValidation,
        };
      }
      return question;
    });
    dispatch(updateStateQuestion(updatedQuestions));
  } catch (error) {
    console.error("Error updating validation:", error);
  }
};
export const setStateQuestion = (idScheme: number) => async (
  dispatch,
  getState
) => {
  try {
    const state = getState();
    const {
      schemeSectionRelations,
      sections,
      // answers,
      questionSectionRelations,
      questions,
      user,
      selectedSectionQuestions,
    } = state.auths;
    const { idOrganisation } = user;

    // get latest answer from answers table.. from redux its not updating soon..
    const answers = await getAllData("answers");
    dispatch(setBackupAns(answers));

    const filteredSchemeSectionRelations = schemeSectionRelations.filter(
      (relation) => relation.idScheme === idScheme
    );

    const sectionIds = filteredSchemeSectionRelations.map(
      (relation) => relation.idSection
    );

    const filteredSections = sections
      .filter((section) => sectionIds.includes(section.idSection))
      .map((addSchemeId) => ({
        ...addSchemeId,
        idScheme: idScheme,
      }));

    if (filteredSections.length > 0) {
      const filteredQuestionSectionRelations = questionSectionRelations.filter(
        (relation) => sectionIds.includes(relation.idSection)
      );
      const questionIds = filteredQuestionSectionRelations.map(
        (relation) => relation.idQuestion
      );

      const filteredQuestions = questions
        .filter((question) => questionIds.includes(question.idQuestion))
        .map((quesWithSchemeIdSectionid) => {
          const sectionId = filteredQuestionSectionRelations.find(
            (relation) =>
              relation.idQuestion === quesWithSchemeIdSectionid.idQuestion
          )?.idSection;

          const questionAnswers = answers
            .filter(
              (answer) =>
                answer.idQuestion === quesWithSchemeIdSectionid.idQuestion &&
                answer.idBusiness === idOrganisation &&
                sectionIds.includes(answer.idSection)
            )
            .map((ansWithId) => ({
              ...ansWithId,
              id: ansWithId?.id,
            }));

          const defaultAnswer = {
            answer: "",
            idSection: sectionId || 0,
            idQuestion: quesWithSchemeIdSectionid.idQuestion,
            id: quesWithSchemeIdSectionid?.id,
          };

          const answersArray =
            questionAnswers.length === 0 ? [defaultAnswer] : questionAnswers;

          return {
            ...quesWithSchemeIdSectionid,
            idScheme: idScheme,
            answers: answersArray,
            isShowValidation: "",
            idSection: sectionId || 0,
          };
        });
      dispatch(updateStateQuestion(filteredQuestions));
    } else {
      console.log("No sections found for the selected scheme3.");
    }
  } catch (error) {
    console.error("Error==>>>> getting selected scheme questions:", error);
  }
};

export const getSelectedSchemeQuestions = (idScheme: number) => async (
  dispatch,
  getState
) => {
  try {
    const state = getState();
    const {
      schemeSectionRelations,
      sections,
      answers,
      questionSectionRelations,
      questions,
      questionControlOptions,
      user,
    } = state.auths;
    const idOrganisation = user?.idOrganisation;
    const filteredSchemeSectionRelations = schemeSectionRelations.filter(
      (relation) => relation.idScheme === idScheme
    );

    const sectionIds = filteredSchemeSectionRelations.map(
      (relation) => relation.idSection
    );

    const filteredSections = sections
      .filter((section) => sectionIds.includes(section.idSection))
      .map((addSchemeId) => ({
        ...addSchemeId,
        idScheme: idScheme,
      }));
    dispatch(setSelectedSections(filteredSections));
    if (filteredSections.length > 0) {
      const firstSectionId = filteredSections[0].idSection;
      const filteredQuestionSectionRelations = questionSectionRelations.filter(
        (relation) => relation.idSection === firstSectionId
      );
      const questionIds = filteredQuestionSectionRelations.map(
        (relation) => relation.idQuestion
      );

      const filteredQuestions = questions
        .filter((question) => questionIds.includes(question.idQuestion))
        .map((quesWithSchemeIdSectionid) => {
          const questionAnswers = answers.filter(
            (answer) =>
              answer.idSection === firstSectionId &&
              answer.idQuestion === quesWithSchemeIdSectionid.idQuestion &&
              answer.idBusiness === idOrganisation
          );
          const questionControlOpts = questionControlOptions.filter(
            (opt) => opt.idQuestion === quesWithSchemeIdSectionid.idQuestion
          );

          return {
            ...quesWithSchemeIdSectionid,
            idScheme: idScheme,
            idSection: firstSectionId,
            answers: questionAnswers,
            isShowValidation: "",
            questionControlOptions: questionControlOpts,
          };
        });

      dispatch(setSelectedQuestions(filteredQuestions));
    } else {
      console.log("No sections found for the selected scheme1.");
    }
  } catch (error) {
    console.error("Error getting selected scheme questions:", error);
  }
};
function groupAndSortQuestions(questions) {
  const groupedQuestions = {};
  const sortedQuestions = [];

  questions.forEach((question) => {
    const parentId = question?.idQuestionParent || 0;

    if (!groupedQuestions[parentId]) {
      groupedQuestions[parentId] = [];
    }
    groupedQuestions[parentId].push(question);
  });

  const sortQuestions = (parentId, level) => {
    if (groupedQuestions[parentId]) {
      groupedQuestions[parentId].sort(
        (a, b) => a.questionSortOrder - b.questionSortOrder
      );

      groupedQuestions[parentId].forEach((question: Question) => {
        question.level = level;
        sortedQuestions.push(question);
        sortQuestions(question.idQuestion, level + 1);
      });
    }
  };

  sortQuestions(0, 0);

  return sortedQuestions;
}

export const handleSectionPressed = (
  idSection: number,
  idScheme: number
) => async (dispatch, getState) => {
  try {
    const state = getState();
    const {
      schemeSectionRelations,
      sections,
      questionSectionRelations,
      questions,
      questionControlOptions,
    } = state.auths;
    const filteredSchemeSectionRelations = schemeSectionRelations.filter(
      (relation) => relation.idScheme === idScheme
    );

    const sectionIds = filteredSchemeSectionRelations.map(
      (relation) => relation.idSection
    );

    const filteredSections = sections
      .filter((section) => sectionIds.includes(section.idSection))
      .map((section) => ({
        ...section,
        idScheme,
      }));

    if (filteredSections.length > 0) {
      const firstSectionId = idSection;
      const filteredQuestionSectionRelations = questionSectionRelations.filter(
        (relation) => relation.idSection === firstSectionId
      );

      const questionIds = filteredQuestionSectionRelations.map(
        (relation) => relation.idQuestion
      );

      const filteredQuestions = questions
        .filter((question) => questionIds.includes(question.idQuestion))
        .map((question) => {
          const selectedControlOption = questionControlOptions.find(
            (opt) => opt.idQuestion === question.idQuestion
          );
          const idTrade = selectedControlOption
            ? selectedControlOption.idTrade
            : null;
          const idQuestionControlOption = selectedControlOption
            ? selectedControlOption.idQuestionControlOption
            : null;

          const defaultAnswer = {
            answer: "",
            idSection: question.idSection,
            idQuestion: question.idQuestion,
            idTrade,
            idQuestionControlOption,
          };

          const questionAnswers = question.answers
            ? question?.answers?.map((answer) => ({
                ...answer,
                idTrade,
                idQuestionControlOption,
              }))
            : [defaultAnswer];

          const questionControlOpts = questionControlOptions.filter(
            (opt) => opt.idQuestion === question.idQuestion
          );

          return {
            ...question,
            idScheme,
            answers: questionAnswers,
            questionControlOptions: questionControlOpts,
          };
        });
      dispatch(setSelectedQuestions(filteredQuestions));
      console.log("No sections found for the selected scheme2.");
    }
  } catch (error) {
    console.error("Error handling section press:", error);
  }
};
export const storeDataInRedux = () => {
  return async (dispatch) => {
    try {
      const answers = await getAllData("answers");
      const schemeSectionRelations = await getAllData("schemeSectionRelations");
      const sections = await getAllData("sections");
      const questionSectionRelations = await getAllData(
        "questionSectionRelations"
      );
      const questions = await getAllData("questions");
      const controls = await getAllData("controls");
      const questionControlOptions = await getAllData("questionControlOptions");

      const tablesData = {
        answers,
        schemeSectionRelations,
        sections,
        questionSectionRelations,
        questions,
        controls,
        questionControlOptions,
      };

      dispatch(storeDataInLocal(tablesData));
    } catch (error) {
      console.error("Error in storeDataInRedux:", error);
    }
  };
};

export const getBusinessListDb = () => {
  return async (dispatch) => {
    const localData = await getAllData("businessList");
    dispatch(getBusinessFromLocal(localData));
  };
};

export const updateAnswersInDatabase = (updatedQuestions) => async (
  dispatch,
  getState
) => {
  try {
    const state = getState();
    const {
      user: { idOrganisation },
    } = state.auths;
    const promises = updatedQuestions.map(async (question: Answer) => {
      const {
        answer,
        idQuestion,
        idSection,
        isTableUpdate,
        idApplicationStatus,
      } = question;
      if (isTableUpdate) {
        const existingData = await getAllData("answers");
        const existingAnswer = existingData.find(
          (data) =>
            data.idQuestion === idQuestion &&
            data.idSection === idSection &&
            data?.idBusiness === idOrganisation
        );
        if (existingAnswer) {
          await updateAnswerInTable(
            idQuestion,
            idSection,
            answer,
            idOrganisation,
            true,
            true
          );
        } else {
          await insertData("answers", [
            {
              answer: answer,
              idQuestion: idQuestion,
              idSection: idSection,
              idBusiness: idOrganisation,
              isTableUpdate: true,
              idApplicationStatus: idApplicationStatus,
            },
          ]);
        }
      }
    });
    await Promise.all(promises);
  } catch (error) {
    console.error("Error updating answers in the database:", error);
  }
};

export const insertAndCreateTables = async (tableData) => {
  try {
    for (const tableName in tableData) {
      const data = tableData[tableName];
      if (data && data.length > 0) {
        const dynamicColumns = Array.from(
          new Set(data?.flatMap((item) => Object.keys(item)))
        );
        if (dynamicColumns.length === 0) {
          console.warn(
            `Dynamic columns for ${tableName} are empty. Skipping table creation.`
          );
          continue;
        }

        const columnTypes = {};

        data.forEach((item) => {
          dynamicColumns.forEach((column) => {
            if (item[column] !== undefined) {
              columnTypes[column] =
                typeof item[column] === "number"
                  ? "INTEGER"
                  : typeof item[column] === "boolean"
                  ? "BOOL"
                  : "TEXT";

              if (typeof item[column] === "object" && item[column] !== null) {
                columnTypes[column] = "TEXT";
                item[column] = JSON.stringify(item[column]);
              }
            }
          });
        });

        if (dynamicColumns.length === 0) {
          console.warn(
            `Dynamic columns for ${tableName} are empty. Skipping table creation.`
          );
          continue;
        }
        await createTable(tableName, dynamicColumns, columnTypes);

        await insertData(tableName, data);
      } else {
        console.log(
          `${tableName} table has already been created or data is empty.`
        );
      }
    }
  } catch (e) {
    console.error("Error in insertAndCreateTables:", e);
  }
};

export const updateAnswerInTableAction = (payload) => async (
  dispatch,
  getState
) => {
  try {
    const state = getState();
    const { selectedSectionQuestions } = state.auths;
    const isExist = selectedSectionQuestions.some((question) => {
      return (
        (question.idQuestion === payload.idQuestion &&
          question.idSection === payload.idSection &&
          !!payload?.isInputText &&
          question.answers.some((newAns) => newAns?.answer !== "")) ||
        question.answers.some(
          (newAnss) =>
            newAnss?.idBusiness === payload?.idBusiness &&
            newAnss?.idQuestion === payload?.idQuestion
        )
      );
    });
    // Update or insert the answer
    await updateAnswerInTable(
      payload.idQuestion,
      payload.idSection,
      payload.value,
      payload.idBusiness,
      true,
      isExist
    );
  } catch (error) {
    console.error("Error in updateAnswerInTableAction:", error);
  }
};
export const fetchSchemeAnswerAndStatus = (payload) => async () => {
  const tablesToInsert = {
    answers: payload.answers,
    applicationStatus: payload.applicationStatus,
  };

  await insertAndCreateTables(tablesToInsert);
};

export const fetchSchemeRowDataDb = (payload: {
  schemes: Scheme;
  schemeSectionRelations: SchemeSectionRelation;
  sections: Section;
  questionSectionRelations: QuestionSectionRelation;
  questions: Question;
  controls: Control;
  questionControlOptions: QuestionControlOption;
}) => async () => {
  const tablesToInsert = {
    schemes: payload?.schemes,
    schemeSectionRelations: payload?.schemeSectionRelations,
    sections: payload?.sections,
    questionSectionRelations: payload?.questionSectionRelations,
    questions: payload?.questions,
    controls: payload?.controls,
    questionControlOptions: payload?.questionControlOptions,
  };
  await insertAndCreateTables(tablesToInsert);
};

export const fetchBusinessDb = (payload) => async () => {
  const tableName = "businessList";

  if (!createdTables.includes(tableName)) {
    createdTables.push(tableName);

    const dynamicColumns = Array.from(
      new Set(payload?.flatMap((item: any) => Object.keys(item)))
    );
    const columnTypes = {};

    payload.forEach((item: any) => {
      dynamicColumns.forEach((column) => {
        if (item[column] !== undefined) {
          columnTypes[column] =
            typeof item[column] === "number"
              ? "INTEGER"
              : typeof item[column] === "boolean"
              ? "BOOL"
              : "TEXT";
        }
      });
    });
    await createTable(tableName, dynamicColumns, columnTypes);
    await insertData(tableName, payload);
  } else {
    console.log(`${tableName} table has already been created.`);
  }
};

export const fetchBusinessSchemeDataDb = (params) => async () => {
  const payload = params?.businessSchemesData;
  const idOrganisation = params?.idOrganisation;
  const schemeTableName = "schemeList";
  return new Promise(async (resolve) => {
    try {
      if (!Array.isArray(payload) || payload.length === 0) {
        resolve(false);
        return;
      }

      const dynamicColumns = Object.keys(payload[0]);
      const idOrganisationColumn = "idOrganisation";

      const columnTypes = dynamicColumns.reduce((types, column) => {
        types[column] = column === idOrganisationColumn ? "INTEGER" : "TEXT";
        return types;
      }, {});

      const allColumns = [...dynamicColumns, idOrganisationColumn];
      const allColumnTypes = {
        ...columnTypes,
        [idOrganisationColumn]: "INTEGER",
      };

      await createTable(schemeTableName, allColumns, allColumnTypes);

      const dataToInsert = payload.map((item) => ({
        ...item,
        [idOrganisationColumn]: idOrganisation,
      }));
      await insertData(schemeTableName, dataToInsert);
      const schemeListData = await getAllData("schemeList");
      store.dispatch(getSchemesFromLocal(schemeListData));

      resolve(true);
    } catch (error) {
      console.error("Error in fetchBusinessSchemeDataDb:", error);
      resolve(false);
    }
  });
};

export const {
  setUser,
  setToken,
  getSchemesFromLocal,
  getBusinessFromLocal,
  setSelectedQuestions,
  updateStateQuestion,
  storeDataInLocal,
  setSelectedSections,
  setBackupAns,
  savePayload,
} = authSlice.actions;

export default authSlice;
