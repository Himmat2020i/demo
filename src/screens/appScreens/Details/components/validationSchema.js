// validationSchema.js

import * as yup from 'yup';
const validationSchema = yup.object().shape({
  Answers: yup.array().of(
    yup.object().shape({
      Answer: yup.mixed().test('is-required', function (value) {
        const cID = this.parent.ControlID;
        if (cID === 10) {
          return (
            (Array.isArray(value) &&
              value.length > 0 &&
              value.every(
                item => typeof item === 'object' && item.url.trim() !== '',
              )) ||
            this.createError({
              message: 'At least one valid document is required',
            })
          );
        }

        // For other control IDs (1, 2, 3, 4), validate the Answer string or array
        return (
          (typeof value === 'string' &&
            value.trim() !== '' &&
            value.trim() !== '""') ||
          (Array.isArray(value) && value.length > 0) ||
          this.createError({
            message: 'This field is required',
          })
        );
      }),
      QuestionsID: yup.number().required(),
    }),
  ),
});

export default validationSchema;
