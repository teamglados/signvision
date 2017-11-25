import { createAction } from 'redux-actions';
import { createTypes } from '../../common/redux.helpers';
import update from 'immutability-helper';

// Action types
const MARK = createTypes('MARK', ['ADD']);

const initialState = {
  marks: [],
};

console.log(MARK.ADD);

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case MARK.ADD:
    return update(state, { marks: { $set: [] } });
  default: return state;
  }
}

export const addMark = createAction(MARK.ADD);

// Selectors
export const getMarks = state => state.marks;

// Sagas
function * handleMarkAdd() {
  try {
    yield console.log('Add mark');
  } catch (e) {
    console.error(e);
  }
}

export function * markSagas() {
  yield all([
    takeEvery(MARK.ADD, handleMarkAdd),
  ]);
}