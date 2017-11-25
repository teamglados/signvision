import { combineReducers } from 'redux';
import { fork } from 'redux-saga/effects';
import markReducer, { markSagas } from './features/mark/mark.ducks';

const rootReducer = combineReducers({
  mark: markReducer,
});

export function* rootSaga() {
  yield fork(markSagas);
}

export default rootReducer;