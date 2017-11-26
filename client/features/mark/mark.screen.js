import { StyleSheet } from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Camera from 'react-native-camera';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';

import { capturePhoto, getMarks } from './mark.ducks';
import Button from '../common/Button';
import Text from '../common/Text';
import Gutter from '../common/Gutter';

const propTypes = {
  capturePhoto: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  marks: PropTypes.array.isRequired,
};

const PHOTO_INTERVAL = 2000;

class MarkScreen extends Component {
  componentDidMount() {
    this.captureInterval = setInterval(this.takePhoto, PHOTO_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.captureInterval);
  }

  setCamRef = (cam) => {
    this.camera = cam;
  }

  takePhoto = () => {
    if (this.camera) {
      const metadata = {};
      this.camera.capture({ metadata })
        .then(this.props.capturePhoto)
        .catch(err => console.error(err));
    }
  }

  finishMarking = () => {
    /* NOTE: we need to reset all screens so that camera ('Mark') screen
     * is unmounted --> clears photo capture interval
     */
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Evaluate' })],
    });

    this.props.navigation.dispatch(resetAction);
  }

  render() {
    const { marks } = this.props;

    return (
      <MarkScreenWrapper>
        <Camera
          ref={this.setCamRef}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
          captureTarget={Camera.constants.CaptureTarget.temp}
          captureQuality={Camera.constants.CaptureQuality['480p']}
          orientation="portrait"
          keepAwake
        >
          <Button onPress={this.finishMarking} lg success>
            <Text size="18px">
              Finish marking
            </Text>
          </Button>

          <Count count={marks.length}>
            <Icon name="map-marker" size={18} color="#fff" />
            <Gutter amount="6px" />
            <Text size="20px">
              {marks.length}
            </Text>
          </Count>
        </Camera>
      </MarkScreenWrapper>
    );
  }
}

const getCountWidth = ({ count }) => {
  if (count >= 100) return 90;
  if (count >= 10) return 70;
  return 60;
};

const MarkScreenWrapper = styled.View`
  flex: 1;
  flex-direction: row;
`;

const Count = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: ${props => getCountWidth(props)};
  height: 40;
  border-radius: 20;
  top: 16;
  right: 16;
  background-color: ${props => props.theme.primaryColor};
`;

const styles = StyleSheet.create({
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 24,
  },
});

MarkScreen.propTypes = propTypes;

const mapStateToProps = state => ({
  marks: getMarks(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  capturePhoto,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MarkScreen);
