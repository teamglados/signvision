import RNFS from 'react-native-fs';
import { takeEvery, all, put } from 'redux-saga/effects';
import { createAction, handleActions } from 'redux-actions';
import update from 'immutability-helper';
import { createTypes } from '../../common/redux.helpers';
import { guid } from '../../common/utils';
import { demoCoords } from '../../common/demo';

// Action types
const MARK = createTypes('MARK', [
  'ADD', 'CAPTURE', 'ADD_COMMENT', 'ADD_TYPE', 'RESET', 'RECEIVE', 'SEND',
]);


const initialState = {
  marks: {},
};

// Reducer
export default handleActions({
  [MARK.RESET]: state => update(state, {
    marks: { $set: {} },
  }),
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
  [MARK.ADD_TYPE]: (state, action) => update(state, {
    marks: {
      [action.payload.id]: {
        type: { $set: action.payload.type }
      },
    },
  }),
}, initialState);

export const addMark = createAction(MARK.ADD);
export const capturePhoto = createAction(MARK.CAPTURE);
export const addComment = createAction(MARK.ADD_COMMENT);
export const addMarkType = createAction(MARK.ADD_TYPE);
export const resetMarks = createAction(MARK.RESET);
export const sendMark = createAction(MARK.SEND);

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
    const { coords, timestamp } = yield getPosition();
    const stats = yield RNFS.stat(path);
    console.log('Real coords', coords);

    if (stats.isFile()) {
      const contents = yield RNFS.readFile(path, 'base64');
      RNFS.unlink(path); // Delete tmp file

      if (!demoCoords.length) return;

      const id = guid();
      const geo = demoCoords[0];

      // post image and geo location to server
      yield put(sendMark({
        id,
        timestamp,
        lat: geo.lat,
        lng: geo.long,
        data: contents,
      }));
    }
  } catch (e) {
    console.error(e);
  }
}

function* handleMarkReceive({ payload }) {
  // Consume coords
  if (demoCoords.length) demoCoords.shift();

  const {
    id,
    timestamp,
    image,
    image_full,
    probability,
    valid,
    lat,
    lng,
  } = payload;

  if (valid) {
    const mark = {
      id,
      timestamp,
      image,
      probability,
      imageFull: image_full,
      comment: '',
      type: null,
      geo: { lat, long: lng },
    };

    console.log('[ADDING MARK]');
    yield put(addMark(mark));
  }
}

export function* markSagas() {
  yield all([
    takeEvery(MARK.CAPTURE, handleCapturePhoto),
    takeEvery(MARK.RECEIVE, handleMarkReceive),
  ]);
}
