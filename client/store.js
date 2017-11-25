import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { fork } from 'redux-saga/effects';
import markReducer, { markSagas } from './features/mark/mark.ducks';

const rootReducer = combineReducers({
  mark: markReducer,
});

function* rootSaga() {
  yield fork(markSagas);
}

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();
const enhancer = applyMiddleware(sagaMiddleware);

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer);
  sagaMiddleware.run(rootSaga); // then run the saga
  return store;
}
