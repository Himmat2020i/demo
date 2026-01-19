import {Key} from 'react';

export interface LoginResponse {
  data?: {
    data: UserData,
    message: string,
    status: string,
    statusCode: number,
  };
  error?: {
    data: {
      data: null,
      message: string,
      status: string,
      statusCode: number,
    },
  };
}

export interface UserData {
  idUser: number;
  idOrganisation: number;
  UserType: number;
  Title: string;
  FirstName: string;
  LastName: string;
  EmailAddress: string;
  IsActive: boolean;
  RegistrationStatus: number;
  Token: string;
  ExpiryTime: string;
  RefreshToken: string;
}

export interface BusinessSchemeResponse {
  Status: string;
  StatusCode: number;
  Message: string;
  Data: BusinessScheme[];
}

export interface BusinessScheme {
  IdScheme: number;
  SchemeName: string;
  SchemeDescription: string;
  PassingScore: number;
  TotalScore: number;
  IsActive: boolean;
  Score: number;
  idOrganisation: number;
  ApplicationStatus: ApplicationStatus[];
}
export interface SchemeData {
  controls: Control[];
  questionControlOptions: QuestionControlOption[];
  questionSectionRelations: QuestionSectionRelation[];
  questions: Question[];
  schemeSectionRelations: SchemeSectionRelation[];
  schemes: Scheme[];
  sections: Section[];
}

export interface SchemeDataResponse {
  data: {
    data: SchemeData,
    message: string,
    status: string,
    statusCode: number,
  };
}

export interface ApplicationStatus {
  idApplicationStatus: number;
  applicationNumber: string | null;
  membershipNumber: string | null;
  businessName: string | null;
  userEmail: string | null;
  schemeName: string | null;
  idScheme: number;
  idOrganisation: number;
  idUser: number;
  status: string;
  score: number;
  statusDate: string;
}

export interface ApplicationStatusAnswerResponse {
  status: string;
  statusCode: number;
  message: string;
  data: {
    applicationStatus: ApplicationStatus[],
    answers: Answer[],
  };
}

export interface Answer {
  isTableUpdate: any;
  input: any;
  id: any;
  idBusiness: any;
  idApplicationStatus: number;
  idSection: number;
  idQuestion: number;
  answer: string;
}

export interface ApplicationRowDataSchemeWiseResponse {
  Status: string;
  StatusCode: number;
  Message: string;
  Data: {
    schemes: Scheme[],
    schemeSectionRelations: SchemeSectionRelation[],
    sections: Section[],
    questionSectionRelations: QuestionSectionRelation[],
    questions: Question[],
    controls: Control[],
    questionControlOptions: QuestionControlOption[],
  };
}

export interface Scheme {
  idScheme: number;
  SchemeName: string;
  SchemeDescription: string;
}

export interface SchemeSectionRelation {
  IdScheme: number;
  idSection: number;
}

export interface Section {
  idSection: number;
  sectionCode: string;
  idScheme: number;
  sectionName: string;
  sectionSortOrder: number;
}

export interface QuestionSectionRelation {
  idSection: number;
  idQuestion: number;
}

export interface Question {
  level: any;
  controlFormat: boolean;
  isShowValidation: string;
  questionPlaceHolder: string;
  questionControlOptions: any;
  idQuestionParent: number;
  controlOption: any;
  question: any;
  questionCode: any;
  questionHeaderDescription: any;
  questionFooterDescription: any;
  id: Key | null | undefined;
  questionMandatory: boolean;
  answers: any;
  questionHelpText: string;
  questionLabel: string;
  idSection: number;
  idScheme: number;
  idControl: number;
  idQuestion: number;
}

export interface Control {
  idControl: number;
  controlName: string;
  controlHelpText: string | null;
}

export interface QuestionControlOption {
  idQuestion: number;
  controlItemName: string;
  controlItemSortOrder: number;
}

export interface BusinessForContractorByIdResponse {
  status: string;
  statusCode: number;
  message: string;
  data: Business[];
}

export interface Business {
  idBusiness: number;
  organisationName: string;
  VATNumber: string;
  isBusinessActive: boolean;
  organisationMonitorStatus: string;
}
