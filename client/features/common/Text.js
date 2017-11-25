import styled from 'styled-components/native';

const Text = styled.Text`
  font-size: ${props => props.size || 16};
  color: ${props => props.color || '#fff'};
  background-color: transparent;
`;

export default Text;