import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { DeckSwiper } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationActions } from 'react-navigation';
import Modal from 'react-native-modal';

import Card from './Card';
import CommentForm from './CommentForm';
import { primaryColor } from '../../common/theme';
import Button from '../common/Button';
import Text from '../common/Text';
import Gutter from '../common/Gutter';
import {
  getMarks,
  getMarksById,
  addComment,
  addMarkType,
} from '../mark/mark.ducks';

const propTypes = {
  marks: PropTypes.array.isRequired,
  navigation: PropTypes.object.isRequired,
  addComment: PropTypes.func.isRequired,
  addMarkType: PropTypes.func.isRequired,
  marksByid: PropTypes.object.isRequired,
};

class EvaluateScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      swipes: 0,
      commentedItem: null,
      dataSource: props.marks,
    };
  }

  setDeckRef = (ref) => { this.deckSwiper = ref; }
  showModal = () => this.setState({ isModalVisible: true })
  hideModal = () => this.setState({ isModalVisible: false })

  handleOk = item => {
    if (this.deckSwiper) {
      this.incSwipes();
      this.props.addMarkType({ id: item.id, type: 'ok' });
      this.deckSwiper._root.swipeRight();
    }
  }

  handleDecline = item => {
    if (this.deckSwiper) {
      this.incSwipes();
      this.props.addMarkType({ id: item.id, type: 'repair' });
      this.deckSwiper._root.swipeLeft();
    }
  }

  handleSwipeLeft = item => {
    this.incSwipes();
    this.props.addMarkType({ id: item.id, type: 'repair' });
  }

  handleSwipeRight = item => {
    this.incSwipes();
    this.props.addMarkType({ id: item.id, type: 'ok' });
  }

  incSwipes = () => {
    this.setState(prev => ({ swipes: prev.swipes + 1 }));
  }

  finishEvaluation = () => {
    this.props.navigation.navigate('Optimize');
  }

  goHome = () => {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Home' })],
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

  render() {
    const { marksByid } = this.props;
    const { isModalVisible, commentedItem, swipes, dataSource } = this.state;

    return (
      <EvaluateScreenWrapper>
        {dataSource.length > 0 &&
          <Milestone>
            <Text color={primaryColor}>
              {swipes} / {dataSource.length}
            </Text>
          </Milestone>
        }

        {dataSource.length ?
          <DeckSwiper
            ref={this.setDeckRef}
            dataSource={dataSource}
            looping={false}
            onSwipeLeft={this.handleSwipeLeft}
            onSwipeRight={this.handleSwipeRight}
            renderItem={item =>
              <Card
                item={marksByid[item.id]}
                onOk={() => this.handleOk(item)}
                onDecline={() => this.handleDecline(item)}
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
                    Show maintenance route
                  </Text>
                </Button>
              </DoneView>
            )}
          /> :

          <DoneView>
            <Icon name="smile-o" size={80} color={primaryColor} />

            <Gutter vertical />

            <Text size="20px" color={primaryColor}>
              No signs to evaluate, good job!
            </Text>

            <Gutter vertical amount="32px" />

            <Button lg onPress={this.goHome}>
              <Text size="18px">
                OK
              </Text>
            </Button>
          </DoneView>
        }

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

const Milestone = styled.View`
  margin-bottom: 8px;
  justify-content: center;
  align-items: center;
`;

EvaluateScreen.propTypes = propTypes;

const mapStateToProps = state => ({
  marks: getMarks(state),
  marksByid: getMarksById(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  addComment,
  addMarkType,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EvaluateScreen);
