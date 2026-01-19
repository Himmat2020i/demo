import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import {
  updateAnswer,
  updateAnswerInTableAction,
} from "../../../../redux/auth/authSlice";
import { Question } from "../DataModal";

interface CheckBoxHook {
  value: any;
  selectedOptions: string[];
  handleDropDownPress: (selectedValue: string) => void;
  handleCheckBoxPress: (selectedValue: string) => void;
  isShowError: string | undefined;
  qControlOptions: any;
  isDropDown: boolean;
}

const useCheckBox = (
  item: any,
  onInputChange: () => void,
  idQuestionControlOption: number
): CheckBoxHook => {
  const dispatch = useDispatch();
  const [value, setValue] = useState();
  const { selectedSectionQuestions, user } = useSelector(
    (state: RootState) => state.auths
  );
  const moveAnswerToQuestion = (
    sourceId: number,
    destinationId: number,
    selectedSectionQuestions: any[],
    updateAnswerFn: (ans: any) => void
  ) => {
    const sourceQuestion = selectedSectionQuestions.find(
      (item: any) => item?.idQuestion === sourceId
    );
    const destinationQuestion = selectedSectionQuestions.find(
      (item: any) => item?.idQuestion === destinationId
    );

    const findAnswer = sourceQuestion?.answers[0]?.answer;

    if (destinationQuestion) {
      const replaceAddParams = {
        answer: findAnswer || ' ',
        params: destinationQuestion,
      };
      updateAnswerFn(replaceAddParams);
    }
  };

  const selectedItem = selectedSectionQuestions.find(
    (q: {
      id: React.Key | null | undefined;
      idQuestion: number;
      idSection: number;
    }) =>
      q.id === item.id &&
      q.idQuestion === item.idQuestion &&
      q.idSection === item.idSection
  );

  const [qControlOptions, setQuestionControlOptions] = useState();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  useEffect(() => {
    const optionsNames = selectedItem?.answers
      ?.map((answer: Answer) => answer?.answer)
      .join("|")
      .split("|")
      .filter((answer: string) => answer !== "");
    setSelectedOptions(optionsNames || []);
  }, [selectedItem]);

  const handleDropDownPress = useCallback(
    async (selectedValue: string) => {
      setValue(selectedValue);
      const getName = selectedItem?.questionControlOptions
        .filter((ids: { id: string }) => {
          return selectedValue.includes(ids?.id);
        })
        .map((i: { controlItemName: any }) => i.controlItemName);
      const updatedAnswer = getName.join("|");
      updatedAns(updatedAnswer);
    },
    [selectedItem, updatedAns]
  );

  const updatedAns = useCallback(
    async (ans: any, isUpload: boolean) => {
      const { idOrganisation } = user;
      const idSection = ans?.params?.idSection
        ? ans?.params?.idSection
        : selectedItem?.idSection;
      const id = ans?.params?.id ? ans?.params?.id : selectedItem?.id;
      const idQuestion = ans?.params?.idQuestion
        ? ans?.params?.idQuestion
        : selectedItem?.idQuestion;
      const values = ans?.answer ? ans?.answer : ans;
      const commaSepratedValue = values.replace(/\|/g, ",");
       dispatch(
          updateAnswerInTableAction({
            idQuestion: idQuestion,
            idSection: idSection,
            value: commaSepratedValue,
            idBusiness: idOrganisation,
          })
        );
        dispatch(
          updateAnswer({
            sectionId: idSection,
            questionId: idQuestion,
            answer: commaSepratedValue,
            idScheme: 4,
            id: id,
            idBusiness: idOrganisation,
            isUpload: isUpload,
          })
        );
        onInputChange();
      // triggerEvent();
    },
    [dispatch, onInputChange, selectedItem, user]
  );

  const moveMappings = [
    { sourceId: 763, destinationId: 745 },
    { sourceId: 776, destinationId: 748 },
    { sourceId: 764, destinationId: 749 },
    { sourceId: 766, destinationId: 751 },
    { sourceId: 765, destinationId: 750 },
    { sourceId: 767, destinationId: 752 },
  ];

  const moveMappings1 = [
    { sourceId: 746, destinationId: 1541 },
    { sourceId: 745, destinationId: 763 },
    { sourceId: 748, destinationId: 776 },
    { sourceId: 751, destinationId: 766 },
    { sourceId: 752, destinationId: 767 },
  ];

  const moveMappings2 = [
    { sourceId: 753, destinationId: 1562 },
    { sourceId: 754, destinationId: 1563 },
    { sourceId: 755, destinationId: 1564 },
    { sourceId: 789, destinationId: 1567 },
    { sourceId: 775, destinationId: 1565 },
    { sourceId: 787, destinationId: 1575 },
  ];

  const handleCheckBoxPress = useCallback(
    async (selectedValue: string, sectionId: number) => {
      const isUpload = selectedValue === "Upload References";
      const strippedSelectedValue = selectedValue.replace(
        /<\/?[^>]+(>|$)/g,
        ""
      );

      let isSelected;
      let updatedOptions;

      if (sectionId === 49) {
        const trimmedOptions = selectedOptions.map((option) =>
          option.split(",")
        );
        const allOptions = trimmedOptions.flat();
        isSelected = allOptions.includes(selectedValue);
        updatedOptions = isSelected
          ? selectedOptions.map((option) =>
              option
                .split(",")
                .filter(
                  (optionValue) => optionValue.trim() !== selectedValue.trim()
                )
                .join(",")
            )
          : [...selectedOptions, selectedValue];
      } else {
        isSelected = selectedOptions.some((option) =>
          option.replace(/<\/?[^>]+(>|$)/g, "").includes(strippedSelectedValue)
        );
        updatedOptions = isSelected
          ? selectedOptions.filter(
              (option) =>
                !option
                  .replace(/<\/?[^>]+(>|$)/g, "")
                  .includes(strippedSelectedValue)
            )
          : [...selectedOptions, selectedValue];
      }

      const updatedAnswer = updatedOptions.join(",");
      updatedAns(updatedAnswer, isUpload);

      if (
        selectedItem.idQuestion === 977 &&
        updatedAnswer &&
        updatedOptions.some((option) =>
          option.replace(/<\/?[^>]+(>|$)/g, "").includes(strippedSelectedValue)
        ) &&
        selectedItem?.idSection === 41
      ) {
        moveMappings1.forEach(({ sourceId, destinationId }) => {
          moveAnswerToQuestion(
            sourceId,
            destinationId,
            selectedSectionQuestions,
            updatedAns
          );
        });
      }
      if (
        selectedItem.idQuestion === 1568 &&
        updatedAnswer &&
        selectedItem?.idSection === 41
      ) {
        moveMappings2.forEach(({ destinationId, sourceId, }) => {
          moveAnswerToQuestion(
            sourceId,
            destinationId,
            selectedSectionQuestions,
            updatedAns
          );
        });
      }
    },
    [
      updatedAns,
      selectedItem.idQuestion,
      selectedItem?.idSection,
      selectedOptions,
      moveMappings1,
      moveMappings2,
      selectedSectionQuestions,
    ]
  );
  const isShowError = selectedItem?.isShowValidation;
  const setValueHere = useCallback(
    (data: any[]) => {
      const answers = selectedItem?.answers[0]?.answer;
      if (answers) {
        const answerArray = answers
          .split("|")
          .flatMap((answer) => answer.split(","))
          .map((answer) => answer.trim().toLowerCase());

        const selectedOption = data
          ?.filter((option: { controlItemName: string }) =>
            answerArray.includes(option.controlItemName.trim().toLowerCase())
          )
          .map((i: { id: any }) => i?.id);
        setValue(selectedOption);
      }
    },
    [selectedItem]
  );

  useEffect(() => {
    const questionControlOptions = selectedItem?.questionControlOptions;

    if (idQuestionControlOption === 0) {
      setQuestionControlOptions(questionControlOptions);
      setValueHere(questionControlOptions);
    } else {
      const output = questionControlOptions.filter((i) => {
        return i?.idTrade === idQuestionControlOption || i?.idTrade === 0;
      });
      setQuestionControlOptions(output);
      setValueHere(output);
    }
  }, [idQuestionControlOption, selectedItem, setValueHere]);

  const isDropDown = selectedItem?.questionLabel === "Select Sub Trade";

  return {
    value,
    selectedOptions,
    handleDropDownPress,
    handleCheckBoxPress,
    isShowError,
    qControlOptions,
    isDropDown,
  };
};

export default useCheckBox;
