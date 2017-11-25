import RNFS from 'react-native-fs';
import { takeEvery, all, put } from 'redux-saga/effects';
import { createAction, handleActions } from 'redux-actions';
import update from 'immutability-helper';
import { createTypes } from '../../common/redux.helpers';
import { randBetween } from '../../common/utils';

// Action types
const MARK = createTypes('MARK', ['ADD', 'CAPTURE']);


const initialState = {
  marks: [],
};

// Reducer
export default handleActions({
  [MARK.ADD]: (state, action) => update(state, {
    marks: { $push: [action.payload] },
  }),
}, initialState);

export const addMark = createAction(MARK.ADD);
export const capturePhoto = createAction(MARK.CAPTURE);


// Selectors
export const getMarks = ({ mark }) => mark.marks;

const getPosition = () => {
  const opts = {
    enableHighAccuracy: true, // use gps
    timeout: 20000, // timeout for getting the location?
    maximumAge: 1000, // location cache max age
  };

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      pos => resolve(pos),
      error => reject(error),
      opts,
    );
  });
};

// Sagas
function* handleCapturePhoto({ payload }) {
  yield console.log('Handling photo capture...');

  try {
    const { path } = payload;

    // First get the current location
    const pos = yield getPosition();
    const stats = yield RNFS.stat(path);
    const mark = {
      id: pos.timestamp,
      geo: {
        lat: pos.coords.latitude + (randBetween(1, 10) * 0.0001),
        long: pos.coords.longitude - (randBetween(1, 50) * 0.001),
      },
    };

    yield put(addMark(mark));

    if (stats.isFile()) {
      const contents = yield RNFS.readFile(path, 'base64');
      console.log(contents[0]);
      console.log(pos);
      // TODO: post image and geo position to server

      RNFS.unlink(path); // Delete tmp file
    }
  } catch (e) {
    console.error(e);
  }
}

export function* markSagas() {
  yield all([
    takeEvery(MARK.CAPTURE, handleCapturePhoto),
  ]);
}
