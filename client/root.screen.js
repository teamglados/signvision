import React, { PureComponent } from 'react';
import { StackNavigator } from 'react-navigation';
import Home from './features/home/home.screen';
import Mark from './features/mark/mark.screen';
import Report from './features/report/report.screen';
import Evaluate from './features/evaluate/evaluate.screen';
import Optimize from './features/optimize/optimize.screen';

class RootScreen extends PureComponent {
  onNavigate = (prevState, newState, action) => {
    console.log('Navigating', action);
  };

  render() {
    const RootNavigator = StackNavigator({
      Home: {
        screen: Home,
      },
      Mark: {
        screen: Mark,
      },
      Report: {
        screen: Report,
      },
      Evaluate: {
        screen: Evaluate,
      },
      Optimize: {
        screen: Optimize,
      },
    }, {
      headerMode: 'none',
    });

    return (
      <RootNavigator onNavigationStateChange={this.onNavigate} />
    );
  }
}

export default RootScreen;