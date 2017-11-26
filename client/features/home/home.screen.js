import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Button from '../common/Button';
import Gutter from '../common/Gutter';
import Text from '../common/Text';
import { resetMarks } from '../mark/mark.ducks';

const propTypes = {
  navigation: PropTypes.object.isRequired,
  resetMarks: PropTypes.func.isRequired,
};

class HomeScreen extends Component {
  goToEvaluation = () => {
    this.props.navigation.navigate('Evaluate');
  }

  goToMark = () => {
    this.props.resetMarks();
    this.props.navigation.navigate('Mark');
  }

  goToOptimize = () => {
    this.props.navigation.navigate('Optimize');
  }

  render() {
    return (
      <HomeScreenWrapper>
        <Button onPress={this.goToMark} lg>
          <Icon name="map-signs" size={30} color="#ddd" />
          <Gutter />
          <Text size="18">
            Start marking signs
          </Text>
        </Button>

        <Gutter vertical amount="24px" />

        <Button onPress={this.goToOptimize} lg>
          <Icon name="map-marker" size={30} color="#ddd" />
          <Gutter />
          <Text size="18">
            Optimized repair route
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

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => bindActionCreators({
  resetMarks,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
