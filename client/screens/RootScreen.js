import React, { PureComponent } from 'react';
import { StackNavigator } from 'react-navigation';
import Home from '../features/home/home.screen';
import Mark from '../features/mark/mark.screen';
import Report from '../features/report/report.screen';
import Evaluate from '../features/evaluate/evaluate.screen';
import Optimize from '../features/optimize/optimize.screen';

class RootScreen extends PureComponent {
  onNavigate = (prevState, newState, action) => {
    console.log('Navigating', action);
  };

  render() {
    const RootNavigator = StackNavigator({
      Home: {
        screen: Home,
        navigationOptions: {
          headerTitle: 'Home',
        },
      },
      Mark: {
        screen: Mark,
        navigationOptions: {
          headerTitle: 'Mark signs',
        },
      },
      Report: {
        screen: Report,
        navigationOptions: {
          headerTitle: 'Sign report',
        },
      },
      Evaluate: {
        screen: Evaluate,
        navigationOptions: {
          headerTitle: 'Repair evaluation',
        },
      },
      Optimize: {
        screen: Optimize,
        navigationOptions: {
          headerTitle: 'Optimize repair route',
        },
      },
    });

    return (
      <RootNavigator onNavigationStateChange={this.onNavigate} />
    );
  }
}

export default RootScreen;