// import React, { useCallback, useRef } from 'react';
// import { Button, Form, Input } from 'antd';
// import PropTypes from 'prop-types';

// import useInput from '../hooks/useInput';
// import { useDispatch, useSelector } from 'react-redux';

// const UpdateForm = ({ post }) => {
//   const dispatch = useDispatch();
//   const { imagePaths } = useSelector((state) => state.post);
//   const [text, onChangeText] = useInput('');
  
//   const imageInput = useRef();
//   const onClickImageUpload = useCallback(() => {
//     imageInput.current.click();
//   }, [imageInput.current]);

//   const onChangeImages = useCallback(() => {
    
//   }, []);

//   const onSubmit = useCallback(() => {
//     if (!text || !text.trim()) {
//       return alert('게시글을 작성하세요.');
//     }
//     const formData = new FormData();
//     formData.append('text', text);
//     dispatch({
//       type: UPDATE_POST_REQUEST,
//       data: 
//     });
//   }, []);

//   return (
//     <Form encType="multipart/form-data" onFinish={onSubmit}>
//       <Input.TextArea value={text} onChange={onChangeText} />
//       <div>
//         <input type="file" name="image" multiple hidden ref={imageInput} onChange={onChangeImages} />
//         <Button onClick={onClickImageUpload}>이미지 업로드</Button>
//         <Button onClick>짹짹</Button>
//       </div>
//       <div>
//         { imagePaths.map((v) => ())}
//       </div>
//     </Form>
//   );
// };

// UpdateForm.propTypes = {
//   post: PropTypes.shape({
//     id: PropTypes.number,
//     content: PropTypes.string,
//     createdAt: PropTypes.string,
//     updatedAt: PropTypes.string,
//     UserId: PropTypes.number,
//     RetweetId: PropTypes.number,
//     User: PropTypes.shape({
//       id: PropTypes.number,
//       nickname: PropTypes.string,
//     }),
//     Images: PropTypes.shape({
//       id: PropTypes.number,
//       src: PropTypes.string,
//       createdAt: PropTypes.string,
//       updatedAt: PropTypes.string,
//     }),
//     Comments: PropTypes.shape({
//       id: PropTypes.number,
//       content: PropTypes.string,
//       createdAt: PropTypes.string,
//       updatedAt: PropTypes.string,
//       UserId: PropTypes.number,
//       PostId: PropTypes.number,
//       User: PropTypes.shape({
//         id: PropTypes.number,
//         nickname: PropTypes.string,
//       }),
//     }),
//     Likers: PropTypes.arrayOf({
//       id: PropTypes.number,
//     }),
//     Retweet: PropTypes.shape({
//       id: PropTypes.number,
//       content: PropTypes.string,
//       createdAt: PropTypes.string,
//       updatedAt: PropTypes.string,
//       UserId: PropTypes.number,
//       RetweetId: PropTypes.number,
//       User: PropTypes.shape({
//         id: PropTypes.number,
//         nickname: PropTypes.string,
//       }),
//       Images: PropTypes.shape({
//         id: PropTypes.number,
//         src: PropTypes.string,
//         createdAt: PropTypes.string,
//         updatedAt: PropTypes.string,
//       }),
//     }),
//   }).isRequired,
// };

// export default UpdateForm;
