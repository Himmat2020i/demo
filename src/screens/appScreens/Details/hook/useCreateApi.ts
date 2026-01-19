import { useDispatch, useSelector } from "react-redux";
import mime from "mime";
import { updateStatus } from "../../../../redux/auth/authSlice";
import {
  getAllData,
  updateIsTableUpdateInTable,
} from "../../../../../Database";
import { checkInternetConnection, webUrl } from "../../../../helpers/utils";
import {
  useLazyBusinessSchemeQuery,
  useLazyCreateAnswerQuery,
} from "../../../../services/authService";
import { useUploadFilesMutation } from "../../../../services/appServices";
import { Answer } from "../DataModal";

const useCreateApi = () => {
  const [
    useUploadFilesMutations,
    { data: updateData, isSuccess: updateSuccess },
  ] = useUploadFilesMutation();

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auths?.user);
  const { idUser, idOrganisation } = user;
  const [createAnswerQuery] = useLazyCreateAnswerQuery();
  const [businessSchemeListQuery] = useLazyBusinessSchemeQuery();

  const processParams = async (apiResponse) => {
    const docParams = [];
    const nonDocParams = [];

    apiResponse.forEach((item) => {
      if (
        typeof item?.answer === "string" &&
        (item?.answer?.startsWith("/Dropbox/") ||
          item?.answer?.startsWith("http") ||
          item?.answer?.startsWith("https") ||
          item?.answer?.startsWith("file"))
      ) {
        docParams.push(item);
      } else {
        nonDocParams.push(item);
      }
    });

    return { docParams, nonDocParams };
  };

  const retryDocumentSubmission = async (ansData) => {
    const MAX_ATTEMPTS = 8;
    const RETRY_DELAY = 200;
    let path = "";

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        if (ansData.answer.includes("/Dropbox/")) {
          return ansData.answer;
        } else {
          const serverPathObjs = await onSubmitDoc({
            idScheme: 4,
            idSections: ansData.idSection,
            answer: ansData.answer,
            id: ansData.id,
          });
          if (serverPathObjs && serverPathObjs.path) {
            path = serverPathObjs.path;
            break;
          } else {
            console.error(
              "onSubmitDoc returned undefined or empty path:",
              ansData
            );
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
          }
        }
      } catch (error) {
        console.error("Error in onSubmitDoc:", error);
        throw error;
      }
    }

    return path;
  };

  const createModifiedDocParams = (docParams, serverPaths) => {
    const combinedAnswersMap = new Map();
    docParams.forEach((item, index) => {
      const serverPath = serverPaths[index];
      const { idQuestion, idSection, idBusiness } = item;

      if (!combinedAnswersMap.has(idQuestion)) {
        combinedAnswersMap.set(idQuestion, {
          Answer: serverPath,
          idApplicationStatus: 0,
          idOrganisation: idBusiness,
          idQuestion: idQuestion,
          idScheme: 4,
          idSectionnumber: idSection,
          idUser: idUser,
          numberIdSection: idSection,
          sectionNameStr: "",
        });
      } else {
        const existingAnswer = combinedAnswersMap.get(idQuestion);
        existingAnswer.Answer += `|${serverPath}`;
      }
    });

    const combinedAnswers = Array.from(combinedAnswersMap.values());

    const idSections = [];
    docParams.forEach((item) => {
      idSections.push(item.idSection);
    });

    return {
      answer: combinedAnswers,
      bid: idOrganisation,
      idScheme: 4,
      idSections: idSections,
      idUser: idUser,
      userType: "",
    };
  };

  const onSubmitDoc = async (params) => {
    try {
      const formData = new FormData();
      const fileName = params?.answer.substring(
        params?.answer.lastIndexOf("/") + 1
      );

      const fileType = mime.getType(fileName) || "application/octet-stream";
      const file = {
        uri: params?.answer || "",
        name: fileName || "",
        type: fileType || "",
      };
      formData.append("document", file);
      formData.append("idScheme", params?.idScheme);
      formData.append("idSection", params?.idSections);
      const response = await useUploadFilesMutations(formData);
      const respReturn = {
        path: response?.data?.data,
        id: params?.id,
      };
      return respReturn;
    } catch (error) {
      console.error("Error submitting document:", error);
      throw error; // Re-throw the error to be handled by the caller
    }
  };

  const createAnswerApi = async () => {
    try {
      const checkNet = await checkInternetConnection();
      if (!checkNet) {
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 200));
      const getAlAns = await getAllData("answers");
      let apiResponse = getAlAns?.filter(
        (ans: Answer) => ans.isTableUpdate && ans.idBusiness === idOrganisation
      );
      apiResponse = apiResponse.map((item: Answer) => {
        if (
          typeof item?.answer === "string" &&
          item?.answer?.includes(webUrl)
        ) {
          item.answer = item.answer.replace(webUrl, "");
        }
        return item;
      });
      const { docParams, nonDocParams } = await processParams(apiResponse);
      const promises = [];
      if (nonDocParams.length > 0) {
        const nonDocAnswerParams = nonDocParams.map((item) => ({
          idScheme: 4,
          idSectionnumber: item?.idSection || 0,
          idApplicationStatus: 0,
          idQuestion: item?.idQuestion || 0,
          idOrganisation: idOrganisation || 0,
          idUser: idUser || 0,
          numberIdSection: item?.idSection || 0,
          sectionNameStr: "",
          Answer: item?.answer?.toString() || "",
        }));
        const nonDocParamsBatch = {
          bid: idOrganisation,
          idScheme: 4,
          idSections: nonDocAnswerParams.map((item) => item.idSectionnumber),
          answer: nonDocAnswerParams,
          idUser: idUser,
          userType: "",
        };
        const getAllNonDocIdQuestion = nonDocParamsBatch?.answer.map(
          (item) => item.idQuestion
        );

        promises.push(
          createAnswerQuery(nonDocParamsBatch).then(async (nonDocRes) => {
            if (nonDocRes?.data?.statusCode === 200) {
              await updateIsTableUpdateInTable(getAllNonDocIdQuestion);
            }
          })
        );
      }

      if (docParams.length > 0) {
        const serverPaths = await Promise.all(
          docParams.map(async (ansData) => retryDocumentSubmission(ansData))
        );
        const modifiedDocParams = createModifiedDocParams(
          docParams,
          serverPaths
        );

        const getAllDocIdQuestion = modifiedDocParams?.answer.map(
          (item) => item.idQuestion
        );
        promises.push(
          createAnswerQuery(modifiedDocParams).then(async (ress) => {
            if (ress?.data?.statusCode === 200) {
              await updateIsTableUpdateInTable(getAllDocIdQuestion);
            }
          })
        );
      }
      await Promise.all(promises);
      const businessSchemesResponse = await businessSchemeListQuery();
      const status =
        businessSchemesResponse?.data?.data[0]?.applicationStatus[0]?.status ||
        "Apply now";
      dispatch(updateStatus(status));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return createAnswerApi;
};

export default useCreateApi;
