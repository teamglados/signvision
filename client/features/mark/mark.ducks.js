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
  yield console.log('Handling photo capture...');

  try {
    const { path } = payload;

    const opts = {
      enableHighAccuracy: true, // use gps
      timeout: 20000, // timeout for getting the location?
      maximumAge: 1000, // location cache max age
    };

    // First get the current location
    navigator.geolocation.getCurrentPosition((pos) => {
      console.log(pos);
      RNFS.stat(path).then((stats) => {
        console.log(stats);

        if (stats.isFile()) {
          RNFS.readFile(path, 'base64').then((contents) => {
            console.log(contents);

            RNFS.unlink(path); // Delete tmp file
          });
        }
      });
    },
    error => console.log(error),
    opts,
    );
  } catch (e) {
    console.error(e);
  }
}

export function* markSagas() {
  yield all([
    takeEvery(MARK.CAPTURE, handleCapturePhoto),
  ]);
}
