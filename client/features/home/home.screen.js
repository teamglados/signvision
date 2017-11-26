import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ImageBackground, Dimensions } from 'react-native';

import Button from '../common/Button';
import Gutter from '../common/Gutter';
import Text from '../common/Text';
import { resetMarks, getMarks } from '../mark/mark.ducks';

const propTypes = {
  navigation: PropTypes.object.isRequired,
  resetMarks: PropTypes.func.isRequired,
};

const { width, height } = Dimensions.get('window');

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
    const { marks } = this.props;

    return (
      <ImageBackground
        source={require('../../common/home.png')}
        style={{ width, height }}
      >
        <HomeScreenWrapper>
          <Brand>
            <Logo
              source={require('../../common/logo.png')}
              resizeMode="contain"
            />
          </Brand>

          <Button onPress={this.goToMark} lg>
            <Icon name="map-signs" size={30} color="#ddd" />
            <Gutter />
            <Text size="20px">
              Start marking signs
            </Text>
          </Button>

          <Gutter vertical amount="24px" />

          <Button onPress={this.goToOptimize} disabled={!marks.length} lg>
            <Icon name="map-marker" size={30} color="#ddd" />
            <Gutter />
            <Text size="20px">
              Maintenance route
            </Text>
          </Button>
        </HomeScreenWrapper>
      </ImageBackground>
    );
  }
}

const HomeScreenWrapper = styled.View`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-horizontal: 24px;
`;

const Brand = styled.View`
  align-items: center;
  margin-bottom: 16px;
`;

const Logo = styled.Image`
  width: ${width * 0.8};
`;

HomeScreen.propTypes = propTypes;

const mapStateToProps = state => ({
  marks: getMarks(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  resetMarks,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
