import { useNavigation, useRoute } from "@react-navigation/native";
import { Controller, useForm } from "react-hook-form";
import { addDocumentFormSchema } from "../../../../helpers/yupHelper";
import {
  useAddDocumentMutation,
  useFetchDocumentTypeQuery,
  useUpdateDocumentMutation,
} from "../../../../services/appServices";
import { useEffect, useState } from "react";

import {
  dateFormat,
  getFileExtensionFromUrl,
  onFileOpen,
  showToaster,
  startLoader,
  stopLoader,
} from "../../../../helpers/utils";
import FileViewer from "react-native-file-viewer";
import mime from "mime";

const useAddDocument = () => {
  const { data } = useFetchDocumentTypeQuery();
  const [addDocument, { data: docData, isSuccess }] = useAddDocumentMutation();
  const [
    updateDocument,
    { data: updateData, isSuccess: updateSuccess },
  ] = useUpdateDocumentMutation();
  const navigation = useNavigation<any>();
  const { params } = useRoute();
  const {
    idMonitorDocument,
    idMonitorDocumentType: docMonitorId,
    filePathUrl,
    documentExpiryDate,
    description,
    fileName,
  } = params?.item || {};

  const [datePicker, setDatePicker] = useState(false);
  const { handleSubmit, control, getValues, setValue } = useForm({
    resolver: addDocumentFormSchema,
    mode: "onChange",
  });

  useEffect(() => {
    if (idMonitorDocument) {
      navigation.setOptions({ title: "Updated Document" });
    }
  }, [idMonitorDocument, navigation]);

  useEffect(() => {
    if (idMonitorDocument) {
      setValue("idMonitorDocumentType", docMonitorId.toString());
      setValue("documentExpiryDate", dateFormat(documentExpiryDate));
      setValue("description", description);
      setValue("document", {
        name: fileName || "",
        type: mime.getType(filePathUrl) || "",
        uri: filePathUrl || "",
      });
    }
  }, [
    params,
    data,
    idMonitorDocument,
    setValue,
    docMonitorId,
    documentExpiryDate,
    description,
    fileName,
    filePathUrl,
  ]);

  useEffect(() => {
    if (updateData?.statusCode === 200 && updateSuccess) {
      navigation.goBack();
      showToaster("Document successfully updated.", "S");
    }
  }, [navigation, updateData, updateSuccess]);

  useEffect(() => {
    if (docData?.statusCode === 200 && isSuccess) {
      stopLoader();
      navigation.goBack();
      showToaster("Document successfully saved.", "S");
    }
  }, [docData, isSuccess, navigation]);

  const onSubmit = async () => {
    const formData: any = new FormData();
    const {
      documentExpiryDate,
      idMonitorDocumentType,
      document,
      description,
    } = getValues();
    formData.append("documentExpiryDate", documentExpiryDate);
    formData.append("idMonitorDocumentType", idMonitorDocumentType);
    formData.append("document", document);
    formData.append("description", description || "");
    if (idMonitorDocument) {
      startLoader();
      formData.append("monitorDocumentId", idMonitorDocument || "");
      updateDocument(formData);
      return;
    }
    await addDocument(formData);
  };

  const selectDoc = async (pickerResult: {
    name: string;
    type: string;
    uri: string;
  }) => {
    setValue("document", {
      name: pickerResult?.name || "",
      type: pickerResult?.type || "",
      uri: pickerResult?.uri || "",
    });
  };

  const openFile = async (url: string) => {
    const isHttp = url?.toLowerCase?.()?.startsWith?.("http");
    if (isHttp) {
      onFileOpen(url, fileName);
      return;
    }
    await FileViewer.open(url, { showOpenWithDialog: true });
  };

  return {
    onSubmit,
    data: data?.data || [],
    control,
    Controller,
    handleSubmit,
    datePicker,
    setDatePicker,
    setValue,
    selectDoc,
    getValues,
    openFile,
    idMonitorDocument,
  };
};

export default useAddDocument;
