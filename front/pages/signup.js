import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { Button, Checkbox, Form, Input } from 'antd';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import axios from 'axios';
import { END } from 'redux-saga';

import AppLayout from '../components/AppLayout';
import useInput from '../hooks/useInput';
import { LOAD_MY_INFO_REQUEST, SIGN_UP_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';

const ErrorMessage = styled.div`
  color: red;
`;

const Signup = () => {
  const dispatch = useDispatch();
  const { signUpLoading, signUpDone, signUpError, me } = useSelector((state) => state.user);

  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, onChangePassword] = useInput('');

  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const onChangePasswordCheck = useCallback((e) => {
    setPasswordCheck(e.target.value);
    setPasswordError(e.target.value !== password);
  }, [password]);

  const [term, setTerm] = useState(false);
  const [termError, setTermError] = useState('');
  const onChangeTerm = useCallback((e) => {
    setTerm(e.target.checked);
    setTermError(!e.target.checked);
  }, []);

  const onSubmit = useCallback(() => {
    if (password !== passwordCheck) {
      return setPasswordError(true);
    }
    if (!term) {
      return setTermError(true);
    }
    return dispatch({
      type: SIGN_UP_REQUEST,
      data: { email, password, nickname },
    });
  }, [email, password, nickname, passwordCheck, term]);

  useEffect(() => {
    if (signUpDone) {
      Router.replace('/'); // push랑 비슷한데 replace는 뒤로가기가 안된다
    }
  }, [signUpDone]);

  useEffect(() => {
    if (signUpError) {
      alert(signUpError);
    }
  }, [signUpError]);

  useEffect(() => {
    if (me) {
      Router.replace('/');
      alert('로그아웃 해야 회원가입할 수 있습니다.');
    }
  }, [me]);

  if (me) {
    return null;
  }

  return (
    <AppLayout>
      <Head>
        <title>회원가입 | Nodebird</title>
      </Head>
      <Form onFinish={onSubmit}>
        <div>
          <label htmlFor="user-email">이메일</label>
          <br />
          <Input name="user-email" type="email" value={email} onChange={onChangeEmail} required />
        </div>
        <div>
          <label htmlFor="user-nickname">닉네임</label>
          <br />
          <Input name="user-nickname" value={nickname} onChange={onChangeNickname} required />
        </div>
        <div>
          <label htmlFor="user-password">비밀번호</label>
          <br />
          <Input name="user-password" type="password" value={password} onChange={onChangePassword} required />
        </div>
        <div>
          <label htmlFor="user-password-check">비밀번호체크</label>
          <br />
          <Input
            name="user-password-check"
            type="password"
            value={passwordCheck}
            onChange={onChangePasswordCheck}
            required
          />
          { passwordError && <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>}
        </div>

        <div>
          <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>정보 수집에 동의합니다.</Checkbox>
          { termError && <ErrorMessage>약관에 동의하셔야 합니다.</ErrorMessage> }
        </div>

        <div style={{ marginTop: 10 }}>
          <Button type="primary" htmlType="submit" loading={signUpLoading}>가입하기</Button>
        </div>
      </Form>
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : null;
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });

  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Signup;
