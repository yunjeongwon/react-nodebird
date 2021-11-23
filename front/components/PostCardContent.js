import React, { useEffect } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Button, Input } from 'antd';
import { useSelector } from 'react-redux';

import useInput from '../hooks/useInput';

const PostCardContent = ({
  postData, editMode, onCancelUpdatePost, onChangePost }) => { // 첫 번째 게시글 #헤시태그 #익스프레스
  const [editText, onChangeEditText] = useInput(postData);
  const { updatePostLoading, updatePostDone } = useSelector((state) => state.post);

  useEffect(() => {
    if (updatePostDone) {
      onCancelUpdatePost();
    }
  }, [updatePostDone]);

  return (
    <>
      { editMode
        ? (
          <>
            <Input.TextArea value={editText} onChange={onChangeEditText} />
            <Button loading={updatePostLoading} onClick={onChangePost(editText)}>수정</Button>
            <Button onClick={onCancelUpdatePost}>취소</Button>
          </>
        )
        : (
          postData.split(/(#[^\s#]+)/g).map((v) => {
            if (v.match(/(#[^\s#]+)/g)) {
              return <Link href={`/hashtag/${v.slice(1)}`} prefetch={false} key={v}><a>{v}</a></Link>;
            }
            return v;
          })
        )}
    </>
  );
};

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
  editMode: PropTypes.bool,
  onCancelUpdatePost: PropTypes.func.isRequired,
  onChangePost: PropTypes.func.isRequired,
};

PostCardContent.defaultProps = { // isRequired 아니면 defaultProps 해주자
  editMode: false,
};

export default PostCardContent;
