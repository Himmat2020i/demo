import {getMatchIdQuestion} from '../../../helpers/utils';
import {Question} from './DataModal';

const useCheckQuestionVisibility = (arr: Question[], sectionArr: []) => {
  const uniqueQuestionIds = [
    782, 783, 784, 785, 788, 795, 796, 797, 798, 799, 800, 801, 802, 803,
    804, 805, 806, 807, 988, 987,
  ];

  const isConditionMet = (
    answer: string,
    idQuestion: number,
    condition: boolean,
  ) => {
    return (
      arr.some(question => {
        const questionAnswer = question?.answers[0]?.answer;
        const questionId = question?.idQuestion;
        return questionAnswer === answer && questionId === idQuestion;
      }) === condition
    );
  };

  const partnr = isConditionMet('Partner', 781, true);
  const op = isConditionMet('other partnership', 777, true);
  const pp = isConditionMet('Proprietor', 781, true);
  const md = isConditionMet('Managing Director', 781, true);
  const st = isConditionMet('sole trader', 777, true);
  const plc = isConditionMet('Public liability company', 777, true);
  const lc = isConditionMet('limited company', 777, true);
  const llp = isConditionMet('limited liability partnership', 777, true);
  const ts = isConditionMet('third sector', 777, true);

  const isOtherSelect = arr.some((val: Question) => {
    const answer = val?.answers[0]?.answer;
    return (
      val?.idQuestion === 1025 &&
      val?.idSection === 41 &&
      answer !== 'Sole Trader' &&
      answer !== 'Limited Company'
    );
  });

  const getSoloTrader = arr.some((val: Question) => {
    return (
      val?.idQuestion === 1025 &&
      val?.answers[0]?.answer !== 'Limited Company' &&
      val?.idSection === 41
    );
  });

  const yesOrNo = arr.some((val: Question) => {
    return (
      val?.answers[0]?.answer === 'Yes' &&
      val?.idSection === 41 &&
      val?.idQuestion === 771
    );
  });

  const getSome = arr.some((val: Question) => {
    return (
      val?.answers[0]?.answer === 'Yes' &&
      val?.idSection === 42 &&
      val?.idQuestion === 828
    );
  });

  const getFilter = () => {
    const matchedId = getMatchIdQuestion(sectionArr);
    return arr.filter((question: Question) => {
      const idQuestion = question?.idQuestion;
      const idSection = question?.idSection;

      if (idSection === 51) {
        return idQuestion === matchedId;
      }

      if ((plc || lc || llp || ts || (st && pp)) && md) {
        return true;
      }

      if (op && partnr) {
        return true;
      }

      if (idQuestion === 829 && !getSome) {
        return false;
      }

      if (idQuestion === 1026 && !yesOrNo) {
        return false;
      }

      if (
        [
          746, 984, 985, 977, 745, 748, 749, 750, 751, 752, 780, 768, 1560,
        ].includes(idQuestion) &&
        getSoloTrader
      ) {
        return false;
      }

      if (isOtherSelect && (idQuestion === 780 || idQuestion === 768)) {
        return false;
      }

      return !uniqueQuestionIds.includes(idQuestion);
    });
  };

  return {
    getFilter,
  };
};

export default useCheckQuestionVisibility;
