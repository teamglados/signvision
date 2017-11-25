import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { DeckSwiper } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationActions } from 'react-navigation';
import Modal from 'react-native-modal';

import { getMarks, getMarksById, addComment } from '../mark/mark.ducks';
import Card from './Card';
import CommentForm from './CommentForm';
import { primaryColor } from '../../common/theme';
import Button from '../common/Button';
import Text from '../common/Text';
import Gutter from '../common/Gutter';

const propTypes = {
  marks: PropTypes.array.isRequired,
  navigation: PropTypes.object.isRequired,
  addComment: PropTypes.func.isRequired,
  marksByid: PropTypes.object.isRequired,
};

class EvaluateScreen extends Component {
  state = {
    swipes: 0,
    commentedItem: null,
  }

  setDeckRef = (ref) => {
    this.deckSwiper = ref;
  }

  handleOk = () => {
    if (this.deckSwiper) {
      this.deckSwiper._root.swipeRight();
    }
  }

  handleDecline = () => {
    if (this.deckSwiper) {
      this.deckSwiper._root.swipeLeft();
    }
  }

  finishEvaluation = () => {
    /* NOTE: we need to reset all screens so that camera ('Mark') screen
     * is unmounted --> clears photo capture interval
     */
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Optimize' })],
    });
    this.props.navigation.dispatch(resetAction);
  }

  handleCommentActivation = item => {
    this.setState({ commentedItem: item });
    this.showModal();
  }

  addComment = comment => {
    const { commentedItem } = this.state;
    this.props.addComment({ id: commentedItem.id, comment });
    this.hideModal();
  }

  showModal = () => this.setState({ isModalVisible: true })
  hideModal = () => this.setState({ isModalVisible: false })

  render() {
    const { marks, marksByid } = this.props;
    const { isModalVisible, commentedItem } = this.state;

    return (
      <EvaluateScreenWrapper>
        <DeckSwiper
          ref={this.setDeckRef}
          dataSource={marks}
          looping={false}
          renderItem={item =>
            <Card
              item={marksByid[item.id]}
              onOk={this.handleOk}
              onDecline={this.handleDecline}
              onAddComment={() => this.handleCommentActivation(item)}
            />
          }
          renderEmpty={() => (
            <DoneView>
              <Icon name="map-signs" size={80} color={primaryColor} />

              <Gutter vertical />

              <Text size="20px" color={primaryColor}>
                All done for now!
              </Text>

              <Gutter vertical amount="32px" />

              <Button lg onPress={this.finishEvaluation}>
                <Text size="18px">
                  Show optimized repair route
                </Text>
              </Button>
            </DoneView>
          )}
        />

        <Modal
          avoidKeyboard
          onBackdropPress={this.hideModal}
          isVisible={isModalVisible}
        >
          <CommentForm
            onComment={this.addComment}
            initialComment={commentedItem
              ? marksByid[commentedItem.id].comment
              : ''
            }
          />
        </Modal>
      </EvaluateScreenWrapper>
    );
  }
}

const EvaluateScreenWrapper = styled.View`
  flex: 1;
  padding-horizontal: 12px;
  padding-vertical: 32px;
`;

const DoneView = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 48px;
`;

EvaluateScreen.propTypes = propTypes;

const mapStateToProps = state => ({
  marks: getMarks(state),
  marksByid: getMarksById(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  addComment,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EvaluateScreen);
