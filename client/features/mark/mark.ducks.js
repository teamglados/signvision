import RNFS from 'react-native-fs';
import { takeLatest, all, put } from 'redux-saga/effects';
import { createAction, handleActions } from 'redux-actions';
import update from 'immutability-helper';
import { createTypes } from '../../common/redux.helpers';
import { randBetween } from '../../common/utils';

// Action types
const MARK = createTypes('MARK', ['ADD', 'CAPTURE', 'ADD_COMMENT']);


const initialState = {
  marks: {},
};

// Reducer
export default handleActions({
  [MARK.ADD]: (state, action) => update(state, {
    marks: {
      [action.payload.id]: { $set: action.payload },
    },
  }),
  [MARK.ADD_COMMENT]: (state, action) => update(state, {
    marks: {
      [action.payload.id]: {
        comment: { $set: action.payload.comment }
      },
    },
  }),
}, initialState);

export const addMark = createAction(MARK.ADD);
export const capturePhoto = createAction(MARK.CAPTURE);
export const addComment = createAction(MARK.ADD_COMMENT);

// Selectors
export const getMarks = ({ mark }) => Object.values(mark.marks);
export const getMarksById = ({ mark }) => mark.marks;

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
  try {
    const { path } = payload;

    // First get the current location
    const pos = yield getPosition();
    const stats = yield RNFS.stat(path);

    if (stats.isFile()) {
      const contents = yield RNFS.readFile(path, 'base64');
      console.log(contents[0]);
      console.log(pos);
      // TODO: post image and geo position to server

      const mark = {
        id: `mark_${pos.timestamp}`,
        timestamp: pos.timestamp,
        image: 'https://source.unsplash.com/random/500x300',
        comment: '',
        geo: {
          lat: pos.coords.latitude + (randBetween(1, 10) * 0.0001),
          long: pos.coords.longitude - (randBetween(1, 50) * 0.001),
        },
      };

      console.log('[ADDING MARK]');
      yield put(addMark(mark));

      RNFS.unlink(path); // Delete tmp file
    }
  } catch (e) {
    console.error(e);
  }
}

export function* markSagas() {
  yield all([
    takeLatest(MARK.CAPTURE, handleCapturePhoto),
  ]);
}
