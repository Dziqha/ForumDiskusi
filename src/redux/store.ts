import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import authUserReducer from './reducers/authUserReducer';
import threadsReducer from './reducers/threadsReducer';
import threadDetailReducer from './reducers/threadDetailReducer';
import usersReducer from './reducers/usersReducer';
import leaderboardsReducer from './reducers/leaderboardsReducer';
import loadingReducer from './reducers/loadingReducer';

const rootReducer = combineReducers({
  authUser: authUserReducer,
  threads: threadsReducer,
  threadDetail: threadDetailReducer,
  users: usersReducer,
  leaderboards: leaderboardsReducer,
  isLoading: loadingReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
