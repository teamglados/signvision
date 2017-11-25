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
  state = {

  }

  render() {
    return (
      <HomeScreenWrapper>
        <Button>
          <Icon name="rocket" size={30} color="#900" />
          <Text>Home</Text>
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
