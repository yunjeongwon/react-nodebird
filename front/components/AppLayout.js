import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Col, Input, Menu, Row } from 'antd';
import styled, { createGlobalStyle } from 'styled-components';
import { useSelector } from 'react-redux';
import Router from 'next/router';

import UserProfile from './UserProfile';
import LoginForm from './LoginForm';
import useInput from '../hooks/useInput';

const Global = createGlobalStyle`
  .ant-row {
    margin-right: 0 !important;
    margin-left: 0 !important;
  }

  .ant-col:first-child {
    padding-left: 0 !important;
  }

  .ant-col:last-child {
    padding-right: 0 !important;
  }
`;

const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;

// eslint-disable-next-line react/prop-types
const AppLayout = ({ children }) => {
  const { me } = useSelector((state) => state.user);
  const [searchInput, onChangeSearchInput] = useInput('');

  const onSearch = useCallback(() => {
    Router.push(`/hashtag/${searchInput}`);
  }, [searchInput]);

  return (
    <div>
      <Global />
      <Menu mode="horizontal">
        <Menu.Item key="home">
          <Link href="/"><a>Nodebird</a></Link>
        </Menu.Item>
        <Menu.Item key="profile">
          <Link href="/profile"><a>Profile</a></Link>
        </Menu.Item>
        <Menu.Item key="search">
          <SearchInput
            enterButton
            value={searchInput}
            onChange={onChangeSearchInput}
            onSearch={onSearch}
          />
        </Menu.Item>
      </Menu>
      <Row gutter={8}>
        <Col xs={24} md={6}>
          { me ? <UserProfile /> : <LoginForm /> }
        </Col>
        <Col xs={24} md={12}>
          { children }
        </Col>
        <Col xs={24} md={6}>
          <a href="https://yunjeongwon.github.io/" target="_blank" rel="noreferrer noopener">made by yunjeongwon</a>
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTyeps = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
