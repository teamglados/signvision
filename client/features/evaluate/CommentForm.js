import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Form, Item, Input, Label } from 'native-base';
import Button from '../common/Button';
import Text from '../common/Text';

const propTypes = {
  onComment: PropTypes.func.isRequired,
  initialComment: PropTypes.string,
};

class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: props.initialComment || '',
    };
  }

  handleChange = comment => {
    this.setState({ comment });
  }

  handleSubmit = () => {
    const { comment } = this.state;
    if (comment) this.props.onComment(comment);
  }

  render() {
    const { comment } = this.state;

    return (
      <CommentFormWrapper>
        <Form>
          <Item floatingLabel>
            <Label>How is the condition of the sign?</Label>
            <Input onChangeText={this.handleChange} value={comment} />
          </Item>
        </Form>

        <Controls>
          <Button onPress={this.handleSubmit} disabled={!comment} w="100">
            <Text>OK</Text>
          </Button>
        </Controls>
      </CommentFormWrapper>
    );
  }
}

const CommentFormWrapper = styled.View`
  height: 200px;
  width: 100%;
  background-color: #fff;
  padding-vertical: 24px;
  border-radius: 4px;
  flex-direction: column;
`;

const Controls = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

CommentForm.propTypes = propTypes;

export default CommentForm;
