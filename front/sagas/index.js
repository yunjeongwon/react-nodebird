import { all, fork } from 'redux-saga/effects';
import axios from 'axios';

import userSaga from './user';
import postSaga from './post';
import { backUrl } from '../config/config';

axios.defaults.baseURL = backUrl;
axios.defaults.withCredentials = true; // 쿠키 전달

export default function* rootSaga() {
  yield all([
    fork(userSaga),
    fork(postSaga),
  ]);
}
