import { Text } from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';

import Button from '../common/Button';

const propTypes = {
  something: PropTypes.any,
};

class HomeScreen extends Component {
  goToEvaluation = () => {
    this.props.navigation.navigate('Evaluation');
  }

  goToMark = () => {
    this.props.navigation.navigate('Mark');
  }

  goToMap = () => {
    this.props.navigation.navigate('Optimize');
  }

  render() {
    return (
      <HomeScreenWrapper>
        <Button onPress={this.goToMark}>
          <Icon name="rocket" size={30} color="#ddd" />
          <Text>Mark</Text>
        </Button>

        <Button onPress={this.goToEvaluation}>
          <Icon name="cube" size={30} color="#ddd" />
          <Text>Evaluate</Text>
        </Button>

        <Button onPress={this.goToMap}>
          <Icon name="map" size={30} color="#ddd" />
          <Text>Map</Text>
        </Button>
      </HomeScreenWrapper>
    );
  }
}

const HomeScreenWrapper = styled.View`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

HomeScreen.propTypes = propTypes;

export default HomeScreen;
