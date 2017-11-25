import RNFS from 'react-native-fs';
import { takeEvery, all } from 'redux-saga/effects';
import { createAction, handleActions } from 'redux-actions';
import update from 'immutability-helper';
import { createTypes } from '../../common/redux.helpers';

// Action types
const MARK = createTypes('MARK', ['ADD', 'CAPTURE']);

const initialState = {
  marks: [],
};

// Reducer
export default handleActions({
  [MARK.ADD]: state => update(state, {
    marks: { $set: [] },
  }),
}, initialState);

export const addMark = createAction(MARK.ADD);
export const capturePhoto = createAction(MARK.CAPTURE);

// Selectors
export const getMarks = state => state.marks;

// Sagas
function* handleCapturePhoto({ payload }) {
  try {
    const { path } = payload;
    const stats = yield RNFS.stat(path);
    console.log(stats);
    yield RNFS.unlink(path); // Delete tmp file
    // if (stats.isFile()) {
    //   const contents = yield RNFS.readFile(path, 'base64');
    //   console.log(contents);
    // }
  } catch (e) {
    console.error(e);
  }
}

export function* markSagas() {
  yield all([
    takeEvery(MARK.CAPTURE, handleCapturePhoto),
  ]);
}
