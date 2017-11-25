import styled from 'styled-components/native';

const DEFAULT_AMOUNT = 16;

const Gutter = styled.View`
  ${props => props.vertical
    ? `height: ${props.amount || DEFAULT_AMOUNT};`
    : `width: ${props.amount || DEFAULT_AMOUNT};`}
`;

export default Gutter;
