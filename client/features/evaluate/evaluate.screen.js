import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { DeckSwiper } from 'native-base';

import Card from './Card';

const propTypes = {
  something: PropTypes.any,
};

class EvaluateScreen extends Component {
  state = {

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

  render() {
    const cards = [
      { image: 'https://source.unsplash.com/random/500x300' },
      { image: 'https://source.unsplash.com/random/500x300' },
      { image: 'https://source.unsplash.com/random/500x300' },
      { image: 'https://source.unsplash.com/random/500x300' },
    ];

    return (
      <EvaluateScreenWrapper>
        <DeckSwiper
          ref={this.setDeckRef}
          dataSource={cards}
          renderItem={item =>
            <Card
              item={item}
              onOk={this.handleOk}
              onDecline={this.handleDecline}
            />
          }
        />
      </EvaluateScreenWrapper>
    );
  }
}

const EvaluateScreenWrapper = styled.View`
  flex: 1;
  padding-horizontal: 12px;
  padding-vertical: 32px;
`;

EvaluateScreen.propTypes = propTypes;

export default EvaluateScreen;
