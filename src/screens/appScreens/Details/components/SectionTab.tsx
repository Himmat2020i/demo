import React from 'react';
import {View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Section} from '../DataModal';
import {useDetailsStyle} from '../styles';
import AppText from '../../../../components/text/AppText';

const Tab = createMaterialTopTabNavigator();

interface SectionTabProps {
  sectionInfo: Section[];
  selectedTabIndex: number;
  onPress: (sectionId: number, index: number, idScheme: number) => void;
  validationCounts: number[];
}

const SectionTab: React.FC<SectionTabProps> = ({
  sectionInfo,
  selectedTabIndex,
  onPress,
  validationCounts,
}) => {
  const {styles, colors} = useDetailsStyle();

  const renderScreen = (section: Section, index: number) => (
    <Tab.Screen
      key={section?.idSection}
      name={`${section?.sectionName}${index}`}
      listeners={() => ({
        tabPress: () => {
          if (onPress) {
            onPress(section.idSection, index, section.idScheme);
          }
        },
      })}
      options={{
        tabBarLabel: ({focused}) => (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <AppText
              numberOfLines={1}
              style={{
                color:
                  focused && validationCounts[index] > 0
                    ? colors?.red
                    : !focused
                    ? colors?.storemGrey
                    : colors?.appBlue,
                fontWeight: '600',
                fontSize: 16,
                textAlign: 'center',
              }}>
              {section?.sectionName}
            </AppText>
            {validationCounts[index] > 0 && (
              <View
                style={{
                  height: 15,
                  width: 15,
                  backgroundColor: colors?.red,
                  position: 'absolute',
                  right: -16,
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  top: -5,
                }}>
                <AppText
                  style={{
                    color: colors?.white,
                    fontSize: 8,
                    fontWeight: '600',
                  }}>
                  {`${validationCounts[index]}`}
                </AppText>
              </View>
            )}
          </View>
        ),
      }}>
      {() => <></>}
    </Tab.Screen>
  );

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarBounces: false,
        tabBarScrollEnabled: true,
        swipeEnabled: true,
        tabBarActiveTintColor:
          validationCounts[selectedTabIndex] > 0
            ? colors?.red
            : colors?.storemGrey,
        tabBarStyle: styles.tabContainer,
        tabBarIndicatorStyle: {
          height: 2,
          backgroundColor:
            validationCounts[selectedTabIndex] > 0
              ? colors?.red
              : colors?.appBlue,
        },
      }}>
      {sectionInfo.map(renderScreen)}
    </Tab.Navigator>
  );
};

export default SectionTab;
