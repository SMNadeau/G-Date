import PropTypes from 'prop-types';
import React, { Component, useState } from 'react';
import { View, Text } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { useColorScheme } from 'react-native-appearance';
import dynamicStyles from './styles';
import ChatBot from 'react-native-chatbot';

export default class TimerComponent extends Component {
  constructor(props) {
    super(props);

    this.onComplete = this.onComplete.bind(this);
    this.state = {
      trigger: this.props.trigger,
      //chatReg: this.props.trigger,
      steps: this.props.steps,
      waitAction: this.props.step.waitAction,
      previousStep: this.props.previousStep,
      replace: this.props.replace,
      date: this.props.date,
      timer: this.props.timer ? this.props.timer : 15,
      visible: true,
    };

    this.styles = dynamicStyles();

    this.previousStepType = this.state.previousStep.metadata.type;
  }

  componentDidMount() {
    this.props.triggerNextStep(this.state);
  }

  onComplete = () => {
    this.props.onTimerComplete();
    this.state.trigger = this.state.date;
    //this.state.chatReg
    this.props.triggerNextStep(this.state);
    this.state.visible = false;
    return [false];
  }

  renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      return <Text style={[this.styles.timer]}>System Message: Times Up</Text>;
    }

    return (
      <View style={[this.styles.timer]}>
        <Text style={[this.styles.text]}>Remaining</Text>
        <Text style={[this.styles.value]}>{remainingTime}</Text>
        <Text style={[this.styles.text]}>seconds</Text>
      </View>
    );
  };

  render() {
    return this.state.visible ? (
      <View style={this.styles.timer}>
        <CountdownCircleTimer
          onComplete={this.onComplete}
          isPlaying
          duration={this.state.timer}
          size={120}
          strokeWidth={10}
          colors={[
            ['#004777', 0.4],
            ['#F7B801', 0.4],
            ['#A30000', 0.2],
          ]}>
          {this.renderTime}
        </CountdownCircleTimer>
      </View>
    ) : (
      <View>
        <Text> System Message: Time's Up! </Text>
      </View>
    );
  }
}

TimerComponent.propTypes = {
  steps: PropTypes.object,
  triggerNextStep: PropTypes.func,
  step: PropTypes.object,
  previousStep: PropTypes.object,
};

TimerComponent.defaultProps = {
  steps: undefined,
  triggerNextStep: undefined,
  step: undefined,
  previousStep: undefined,
};
