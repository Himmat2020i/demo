import {URLS} from '../constants/urlsConstant';
import {axiosBaseQuery} from '../redux/reduxUtils';
import {createApi} from '@reduxjs/toolkit/query/react';
import {
  SearchParams,
  SearchAddressResponse,
} from '../interfaces/searchAddressData';
import { getEnvConfig } from '../helpers/configService';

const addressSearch = createApi({
  baseQuery: axiosBaseQuery(getEnvConfig('ADDRESS_SEARCH_URL')),
  reducerPath: 'searchAddress',
  endpoints: builder => ({
    searchAddress: builder.query<SearchAddressResponse, SearchParams>({
      query: params => {
        return {
          url: URLS.searchAddress,
          method: 'GET',
          params,
        };
      },
    }),
  }),
});

export const {useLazySearchAddressQuery} = addressSearch;

export default addressSearch;
