import { StyleSheet } from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Camera from 'react-native-camera';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';

import { capturePhoto, getMarks } from './mark.ducks';
import Button from '../common/Button';
import Text from '../common/Text';
import { primaryColor } from '../../common/theme';

const propTypes = {
  capturePhoto: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  marks: PropTypes.array.isRequired,
};

const PHOTO_INTERVAL = 2000;

class MarkScreen extends Component {
  state = {
    markAdded: false,
  }

  componentDidMount() {
    this.captureInterval = setInterval(this.takePhoto, PHOTO_INTERVAL);
  }

  // componentWillReceiveProps(nextProps) {
  //   console.log('[N]', nextProps, this.props);
  //   if (nextProps.marks.length > this.props.marks.length) {
  //     if (this.timeout) return;

  //     this.setState({ markAdded: true });

  //     this.timeout = setTimeout(() => {
  //       this.setState({ markAdded: false });
  //     }, 1500);
  //   }
  // }

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
    const { markAdded } = this.state;

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

          <Modal isVisible={markAdded}>
            <MarkAdded>
              <Icon name="map-marker" size={200} color={primaryColor} />
            </MarkAdded>
          </Modal>
        </Camera>
      </MarkScreenWrapper>
    );
  }
}

const MarkScreenWrapper = styled.View`
  flex: 1;
  flex-direction: row;
`;

const MarkAdded = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
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
