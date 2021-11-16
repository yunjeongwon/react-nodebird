import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { END } from 'redux-saga';

import AppLayout from '../components/AppLayout';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const {
    mainPosts, hasMorePosts, loadPostsLoading, retweetError,
  } = useSelector((state) => state.post);

  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  useEffect(() => {
    function onScroll() {
      console.log(
        window.scrollY,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
      );
      if (window.scrollY + document.documentElement.clientHeight
        > document.documentElement.scrollHeight - 300) {
        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId,
          });
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePosts, loadPostsLoading]);

  return (
    <AppLayout>
      { me && <PostForm /> }

      { mainPosts.map((post) => <PostCard key={post.id} post={post} />) }
    </AppLayout>
  );
};

// 방문할 때 서버사이드렌더링을 한다, 그 때마다 백엔드로부터 데이터 받아와서 렌더링한다
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : ''; // 브라우저는 쿠키를 넣어서 주는데 프론트에서는 직접 쿠키를 넣어서 보내줘야한다
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_POSTS_REQUEST,
  });

  context.store.dispatch(END); // 요청이 승인이 날 때까지 기다리기
  await context.store.sagaTask.toPromise();
});

export default Home;
