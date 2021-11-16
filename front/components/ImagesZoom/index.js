import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Slick from 'react-slick';

import { CloseBtn, Global, Header, ImgWrapper, Indicator, Overlay, SlickWrapper } from './styles';

const ImagesZoom = ({ images, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <Overlay>
      <Global />
      <Header>
        <h1>상세 이미지</h1>
        <CloseBtn onClick={onClose}>X</CloseBtn>
      </Header>

      <SlickWrapper>
        <Slick
          initialSlide={0}
          beforeChange={(_, newSlide) => setCurrentSlide(newSlide)}
          infinite
          arrows={false}
          slidesToShow={1}
          slidesToScroll={1}
        >
          { images.map((image) => (
            <ImgWrapper>
              <img src={`http://localhost:3065/${image.src}`} alt={image.src} />
            </ImgWrapper>
          ))}
        </Slick>

        <Indicator>
          <div>
            { currentSlide + 1 }
            { ' ' }
            /
            { ' ' }
            { images.length }
          </div>
        </Indicator>
      </SlickWrapper>
    </Overlay>
  );
};

ImagesZoom.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;
