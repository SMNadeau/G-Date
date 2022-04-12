import React, { useState, useEffect } from 'react';
import { View, Text, Image, StatusBar } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { IMLocalized } from '../Core/localization/IMLocalization';
import DynamicAppStyles from '../DynamicAppStyles';
import dateAssessmentStyles from './styles';

const Date1Intro = (props) => {
  const { goToPreDateQs } = props;
  const styles = dateAssessmentStyles();

  const slides = [
    {
      key: 1,
      title: 'Good news!',
      text:
        'We have two matches for you. You will have the opportunity to go on two dates. Here’s how our Q&A system works-\nWe’ve identified a set of questions that predict compatibility.\nYou and your G-Date will be asked to simultaneously respond to a set of 12 randomly selected questions. When you answer a question, stay away from one-word answers! You have 2 minutes per question so type as much as you can with your time. The more in-depth your response, the more the other person can get a feel for what you’re like.\nWhen you see how your date answers, you’ll know if they’re right for you, (and vice versa).\nIf you are not digging your date, you can ditch them any time after the first 3 questions and move on to the next date.',
    },
    {
      key: 2,
      title: '',
      text:
        "After each speed date, we'll ask for your feedback on the quality of the date... but THAT information will not be shared with your date... so no hard feelings!",
    },
  ];

  useEffect(() => {
    StatusBar.setHidden(true);
  }, []);

  _renderItem = ({ item, dimensions }) => (
    <View style={[styles.container, dimensions]}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text}>{item.text}</Text>
      <View style={styles.bottomLogoView}>
        <Image
          source={DynamicAppStyles.iconSet.logo}
          style={styles.logoImage}
        />
      </View>
    </View>
  );

  _renderNextButton = () => {
    return <Text style={styles.button}>{IMLocalized('Got it!')}</Text>;
  };

  _renderDoneButton = () => {
    return (
      <Text style={styles.button}>
        {IMLocalized('Got it- Start my speed date already!')}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <AppIntroSlider
        slides={slides}
        onDone={goToPreDateQs}
        renderItem={_renderItem}
        renderNextButton={_renderNextButton}
        renderDoneButton={_renderDoneButton}
      />
    </View>
  );
};

export default Date1Intro;
