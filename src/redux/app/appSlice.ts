import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import appApi from '../../services/appServices';
import {Question} from '../../screens/appScreens/Details/DataModal';
import {RegisterParameter} from '../../interfaces/registerData';

export interface appState {
  businessList?: any[];
  schemes?: any[];
  sections?: any[];
  questions?: any[];
  schemeSectionRelations?: any[];
  // questionSectionRelations?: any[];
  controls?: [];
  questionControlOptions?: [];
  selectedSectionQuestions?: [];
  selectedSchemeSections?: [];
  businessforContractorById?: [];
  bundleRegisterData?: [];
  registrationData: RegisterParameter;
}

const initialState: appState = {
  businessList: [],
  schemes: [],
  sections: [],
  questions: [],
  schemeSectionRelations: [],
  // questionSectionRelations: [],
  controls: [],
  questionControlOptions: [],

  //these are selected data. working in the app
  selectedSectionQuestions: [],
  businessforContractorById: [],
  selectedSchemeSections: [],
  bundleRegisterData: [],
  registrationData: {},
};

const appSlice = createSlice({
  name: 'apps',
  initialState,
  reducers: {
    setBusinessList: (state, action: PayloadAction<any[]>) => {
      const updatedData = action.payload.map(scheme => ({
        ...scheme,
        Sections: scheme.Sections.map(section => ({
          ...section,
          Questions: section.Questions.map((question: Question) => {
            const foundSection = state.sections?.find(
              dataSection => dataSection?.idSection === section?.idSection,
            );
            const foundQuestion = foundSection?.Questions.find(
              dataQuestion => dataQuestion.idQuestion === question.idQuestion,
            );
            return {
              ...question,
              Answer:
                foundQuestion?.answer !== undefined
                  ? foundQuestion?.answer
                  : question?.answer,
              isShowErr:
                foundQuestion?.isShowErr !== undefined
                  ? foundQuestion.isShowErr
                  : question.isShowErr,
            };
          }),
        })),
      }));

      state.businessList = updatedData;
    },

    setSelectedSchemeSections: (state, action) => {
      const selectedSchemeId = action?.payload?.idScheme;

      const relatedSections = state.schemeSectionRelations
        .filter(relation => relation.IdScheme === selectedSchemeId)
        .map(relation =>
          state?.sections.find(
            section => section.idSection === relation.idSection,
          ),
        );
      state.selectedSchemeSections = relatedSections;
    },
    initialDataSet: (state, action) => {
      const updatedData = action.payload.map(scheme => ({
        ...scheme,
        Sections: scheme.Sections.map(section => ({
          ...section,
          Questions: section.Questions.map(question => {
            return {
              ...question,
              isShowValidation: false,
            };
          }),
        })),
      }));

      state.businessList = updatedData;
    },
    setSchemeSectionRelations: (state, action) => {
      state.schemeSectionRelations = action.payload;
    },

    setQuestionSectionRelations: (state, action) => {
      // state.questionSectionRelations = action.payload;
    },

    setControls: (state, action) => {
      state.controls = action.payload;
    },

    setQuestionControlOptions: (state, action) => {
      state.questionControlOptions = action.payload;
    },

    setSchemes: (state, action) => {
      state.schemes = action.payload;
    },

    setSections: (state, action) => {
      state.sections = action.payload;
    },

    setQuestions: (state, action) => {
      state.questions = action.payload;
    },

    updateValidation: (state, action) => {},

    getBusinessList: (state, action) => {},

    setBundleRegisterData: (state, action) => {
      state.bundleRegisterData = action.payload;
    },
    setRegistrationData: (state, action) => {
      state.registrationData = action?.payload;
    },
  },
  extraReducers: (builder: any) => {
    builder.addMatcher(
      appApi.endpoints.fetchBusinessList.matchFulfilled,
      async (state: any, action: any) => {},
    );

    builder.addMatcher(
      appApi.endpoints.businessforContractorById.matchFulfilled,
      (state, action) => {
        state.businessforContractorById = action?.payload?.Data;
      },
    );
  },
});

export const updateValidation =
  (payload: {sectionId: number, questionId: number}) =>
  (dispatch: any, getState: any) => {
    const state = getState();
    const {businessList} = state.apps;

    const updatedData = businessList.map(scheme => ({
      ...scheme,
      Sections: scheme.Sections.map(section => ({
        ...section,
        Questions: section.Questions.map(question => {
          if (
            question.idQuestion === payload.questionId &&
            section.idSection === payload.sectionId
          ) {
            return {
              ...question,
              isShowValidation: !questionanswer && !!question.required,
            };
          }
          return question;
        }),
      })),
    }));

    dispatch(setBusinessList(updatedData));
  };

export const {
  setSchemes,
  setSections,
  setQuestions,
  initialDataSet,
  setBusinessList,
  getBusinessList,
  setRegistrationData,
  setBundleRegisterData,
  setSelectedSchemeSections,
} = appSlice.actions;

export default appSlice;
