import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';

import Button from '../common/Button';
import Gutter from '../common/Gutter';
import Text from '../common/Text';

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

  render() {
    return (
      <HomeScreenWrapper>
        <Button onPress={this.goToMark} lg>
          <Icon name="map-signs" size={30} color="#ddd" />
          <Gutter />
          <Text size='18'>
            Start marking signs
          </Text>
        </Button>

        <Gutter vertical amount='24px' />

        <Button onPress={this.goToEvaluation} lg>
          <Icon name="eye" size={30} color="#ddd" />
          <Gutter />
          <Text size='18'>
            Evaluate signs
          </Text>
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
  padding: 24px;
`;

HomeScreen.propTypes = propTypes;

export default HomeScreen;
