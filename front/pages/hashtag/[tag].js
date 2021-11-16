import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { END } from 'redux-saga';
import axios from 'axios';

import AppLayout from '../../components/AppLayout';
import PostCard from '../../components/PostCard';
import { LOAD_HASHTAG_POSTS_REQUEST } from '../../reducers/post';
import wrapper from '../../store/configureStore';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';

const Hashtag = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { tag } = router.query;
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector((state) => state.post);

  useEffect(() => {
    const onScroll = () => {
      if (window.screenY + document.documentElement.clientHeight
        > document.documentElement.scrollHeight - 300) {
        if (hasMorePosts && !loadPostsLoading) {
          dispatch({
            type: LOAD_HASHTAG_POSTS_REQUEST,
            data: tag,
            lastId: mainPosts[mainPosts.length - 1]?.id,
          });
        }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePosts, loadPostsLoading, tag, mainPosts.length]);

  return (
    <AppLayout>
      <Head>
        <title>#{tag} 해시태그 | Nodebird </title>
      </Head>
      {mainPosts?.map((v) => (
        <PostCard key={v.id} post={v} />
      ))}
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req?.headers.cookie;
  axios.defaults.headers.Cookie = '';
  if (cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_HASHTAG_POSTS_REQUEST,
    data: context.params.tag,
  });

  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Hashtag;
