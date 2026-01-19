import get from 'lodash/get';

export const getApiError = async (error: {
  response: {data: {message: string, statusCode: number}},
}) => {
  if (get(error, 'response.data.statusCode') === 500 || 400 || 409) {
    return {
      message: error.response.data?.message,
      status: error.response.data?.statusCode,
    };
  }
};
