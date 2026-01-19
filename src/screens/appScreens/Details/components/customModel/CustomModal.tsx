import React, {useCallback, useEffect, useState} from 'react';
import {Modal, View, TouchableOpacity, FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import {Answer, Question, Section} from '../../DataModal';
import {RootState} from '../../../../../redux/store';
import AppText from '../../../../../components/text/AppText';
import {soleFilterArr} from '../../../../../helpers/utils';
import {useCustomModelStyle} from './CustomModelStyle';

interface CustomModalProps {
  isVisible: boolean;
  onClose: () => void;
  iconRef: React.RefObject<TouchableOpacity>;
  onQuestionSelect: (sectionId: number) => void;
  SchemeID: number;
  questions: Question[];
}

const CustomModal: React.FC<CustomModalProps> = ({
  isVisible,
  onClose,
  iconRef,
  onQuestionSelect,
}) => {
  const [iconPosition, setIconPosition] = useState({top: 0, right: 0});
  const [unansweredQuestions, setUnansweredQuestions] = useState([]);
  const {styles} = useCustomModelStyle();

  const sections = useSelector((state: RootState) => state.auths.sections);

  const questions = useSelector((state: RootState) => state.auths.questions);

  const measureIcon = useCallback(() => {
    if (iconRef.current) {
      iconRef.current.measure((x, y, width, height, px, py) => {
        setIconPosition({
          top: py + 15,
          right: 25,
        });
      });
    }
  }, [iconRef]);

  useEffect(() => {
    const unansweredList = [];
    sections.forEach((section: Section) => {
      let sectionAlreadyAdded = false;
      const filterSolar = soleFilterArr(questions, questions);
      filterSolar.forEach((question: Question) => {
        const reg = new RegExp(question.controlFormat).test(
          question.answers[0]?.answer,
        );

        if (
          question.idControl === 10 &&
          question.idSection === section.idSection &&
          !!question.questionMandatory &&
          !!question?.answers?.every((ans: Answer) => ans.answer === '') &&
          !sectionAlreadyAdded
        ) {
          unansweredList.push({
            sectionName: section?.sectionName,
            SectionID: section.idSection,
            QuestionsID: question.idQuestion,
          });
          sectionAlreadyAdded = true;
        } else if (
          question?.idControl !== 10 &&
          question.idSection === section.idSection &&
          !!question.questionMandatory &&
          question.answers[0]?.answer !== 0 &&
          !question.answers[0]?.answer &&
          !sectionAlreadyAdded
        ) {
          unansweredList.push({
            sectionName: section?.sectionName,
            SectionID: section.idSection,
            QuestionsID: question.idQuestion,
          });
          sectionAlreadyAdded = true;
        } else if (
          question.answers[0]?.answer !== '' &&
          question.controlFormat &&
          question.idSection === section.idSection &&
          !!question.questionMandatory &&
          !sectionAlreadyAdded &&
          !reg
        ) {
          unansweredList.push({
            sectionName: section?.sectionName,
            SectionID: section.idSection,
            QuestionsID: question.idQuestion,
          });
          sectionAlreadyAdded = true;
        }
      });
    });

    setUnansweredQuestions(unansweredList);
  }, [sections, questions]);

  useEffect(() => {
    if (isVisible) {
      requestAnimationFrame(() => {
        measureIcon();
      });
    }
  }, [isVisible, iconRef, measureIcon]);

  const handleQuestionSelect = (SectionID: number) => {
    onClose();
    onQuestionSelect(SectionID);
  };

  const renderItem = ({item}: {item: any}) => (
    <TouchableOpacity
      onPress={() => {
        handleQuestionSelect(item.SectionID);
      }}
      style={styles.itemContainer}>
      <View style={styles.dot} />
      <AppText style={styles.itemText}>
        {'Complete section '}
        <AppText style={styles.sectionName}>{item.sectionName}</AppText>
      </AppText>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View
          style={[
            styles.modalContent,
            {top: iconPosition.top, right: iconPosition.right},
          ]}>
          <AppText style={styles.subtitle}>Please complete all details</AppText>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={unansweredQuestions
              ?.slice()
              .sort((a, b) => a?.sectionName.localeCompare(b?.sectionName))}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.flatListContainer}
          />
          <View style={styles.triangle} />
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <AppText style={styles.closeButtonText}>Close</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;
