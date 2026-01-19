import {createApi} from '@reduxjs/toolkit/query/react';
import {URLS} from '../constants/urlsConstant';
import {axiosBaseQuery} from '../redux/reduxUtils';
import {ProfileData, ProfileResponse} from '../interfaces/profileData';
import {ChangePasswordParams} from '../interfaces/authInterface/changePassword';
import {CommonResponse} from '../interfaces/authInterface/commanResponse';
import {bundleRegisterDataResponse} from '../interfaces/bundleRegisterData';

const tagTypes = {
  document: 'document',
};

const appApi = createApi({
  baseQuery: axiosBaseQuery(),
  reducerPath: 'app',
  tagTypes: Object.values(tagTypes),
  endpoints: builder => ({
    fetchDocuments: builder.query<any, void>({
      query: () => ({
        url: URLS.documents,
        method: 'GET',
      }),
      providesTags: [tagTypes.document],
    }),

    schemeRowData: builder.mutation<any, any>({
      query: data => {
        return {
          url: URLS.schemeRowData,
          method: 'POST',
          data,
        };
      },
    }),

    applicationStatusandAnswer: builder.mutation<any, void>({
      query: data => {
        return {
          url: URLS.applicationStatusandAnswer,
          method: 'POST',
          data,
          silent: true,
        };
      },
    }),

    fetchBusinessList: builder.query<any, void>({
      query: () => ({
        url: URLS.businessList,
        method: 'GET',
      }),
    }),

    businessforContractorById: builder.query<
      any,
      {idUser: string, userType: string},
    >({
      query: data => {
        return {
          url: URLS.businessforContractorById
            .replace('{idUser}', data.idUser)
            .replace('{userType}', data.userType),
          method: 'POST',
          data,
        };
      },
    }),

    deleteDocument: builder.mutation<any, string>({
      query: id => {
        return {
          url: URLS.deleteDocuments(id),
          method: 'DELETE',
        };
      },
      invalidatesTags: [tagTypes.document],
    }),

    fetchDocumentType: builder.query<any, void>({
      query: () => ({
        url: URLS.documentType,
        method: 'GET',
      }),
    }),

    addDocument: builder.mutation<any, any>({
      query: data => {
        return {
          url: URLS.addDocument,
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          data,
          silent: false,
        };
      },
      invalidatesTags: [tagTypes.document],
    }),

    updateDocument: builder.mutation<any, any>({
      query: data => {
        return {
          url: URLS.updateDocument,
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          data,
        };
      },
      invalidatesTags: [tagTypes.document],
    }),

    changePassword: builder.mutation<CommonResponse, ChangePasswordParams>({
      query: data => {
        return {
          url: URLS.changePassword,
          method: 'POST',
          data,
        };
      },
    }),

    bundleRegisterData: builder.query<bundleRegisterDataResponse, void>({
      query: () => {
        return {
          url: URLS.bundleRegisterData,
          method: 'GET',
        };
      },
    }),

    getProfile: builder.query<ProfileResponse, void>({
      query: () => {
        return {
          url: URLS.profile,
          method: 'GET',
        };
      },
    }),

    updateProfile: builder.mutation<ProfileResponse, ProfileData>({
      query: data => {
        return {
          url: URLS.profile,
          method: 'POST',
          data,
        };
      },
    }),

    uploadFiles: builder.mutation<any, any>({
      query: data => {
        return {
          url: URLS.uploadsFiles,
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          data,
          silent: true,
        };
      },
      invalidatesTags: [tagTypes.document],
    }),

    updateUserInfo: builder.mutation<ProfileResponse, ProfileResponse>({
      query: data => {
        return {
          url: URLS.updateUserInfo,
          method: 'POST',
          data,
          silent: true,
        };
      },
    }),
  }),
});

export const {
  useLazyGetProfileQuery,
  useUpdateProfileMutation,
  useFetchBusinessListQuery,
  useLazyFetchBusinessListQuery,
  useFetchDocumentsQuery,
  useDeleteDocumentMutation,
  useFetchDocumentTypeQuery,
  useAddDocumentMutation,
  useUpdateDocumentMutation,
  useChangePasswordMutation,
  useSchemeRowDataMutation,
  useBundleRegisterDataQuery,
  useApplicationStatusandAnswerMutation,
  useLazyBusinessforContractorByIdQuery,
  useUploadFilesMutation,
  useUpdateUserInfoMutation,
} = appApi;

export default appApi;
