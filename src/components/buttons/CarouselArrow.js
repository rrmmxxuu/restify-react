import {LeftOutlined, RightOutlined} from '@ant-design/icons';

import './carousel-arrow.css'

export const CarouselPrevArrow = (props) => {
    const {onClick} = props;
    return (
        <div
            className="carousel-arrow carousel-arrow-prev"
            onClick={onClick}
        >
            <LeftOutlined/>
        </div>
    );
};

export const CarouselNextArrow = (props) => {
    const {onClick} = props;
    return (
        <div
            className="carousel-arrow carousel-arrow-next"
            onClick={onClick}
        >
            <RightOutlined/>
        </div>
    );
};
