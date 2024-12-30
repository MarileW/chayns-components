import React, { Component } from 'react';
import './ColorArea.scss';
import PropTypes from 'prop-types';
import { hsvToHexString } from '../../../utils/color';
import restrictInterval from '../../../utils/restrictInterval';

function preventDefault(e) {
    e.preventDefault();
}

export default class ColorArea extends Component {
    constructor(props) {
        super(props);
        this.state = { top: 0, left: 0 };
        this.canvas = React.createRef();
        this.area = React.createRef();
    }

    componentDidMount() {
        // draw canvas and set selector after first mount
        this.drawCanvas();
        this.setSelectorPosition();
        // prevent scrolling on touch devices
        this.area.current.addEventListener('touchstart', preventDefault);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { props, state } = this;
        return (
            ['color', 'height', 'width', 'onChange', 'onChangeEnd'].some(
                (k) => props[k] !== nextProps[k]
            ) ||
            state.top !== nextState.top ||
            state.left !== nextState.left
        );
    }

    componentDidUpdate(prevProps) {
        const { props } = this;
        if (
            ['color', 'height', 'width', 'onChange', 'onChangeEnd'].some(
                (k) => props[k] !== prevProps[k]
            )
        ) {
            // redraw canvas and reset selector when props changed
            this.drawCanvas();
            this.setSelectorPosition();
        }
    }

    setSelectorPosition = () => {
        const { color, height, width } = this.props;
        this.setState({
            top: (1 - color.v) * height,
            left: color.s * width,
        });
    };

    drawCanvas = () => {
        // draw the canvas
        const { color, height, width } = this.props;
        const hex = hsvToHexString(
            {
                h: color.h,
                s: 1,
                v: 1,
                a: null,
            },
            false
        );
        const ctx = this.canvas.current.getContext('2d');
        const gradient1 = ctx.createLinearGradient(0, 0, width - 1, 0);
        gradient1.addColorStop(0, '#fff');
        gradient1.addColorStop(1, hex);
        ctx.fillStyle = gradient1;
        ctx.fillRect(0, 0, width, height);
        const gradient2 = ctx.createLinearGradient(0, 0, 0, height - 1);
        gradient2.addColorStop(0, 'transparent');
        gradient2.addColorStop(1, '#000');
        ctx.fillStyle = gradient2;
        ctx.fillRect(0, 0, width, height);
    };

    getColor = (x, y) => {
        // get selected color from canvas
        const { color, height, width } = this.props;
        return {
            ...color,
            s: restrictInterval(x / (width - 1), 0, 1), // width and height need to be decremented because either you are not able to choose black
            v: restrictInterval(1 - y / (height - 1), 0, 1),
        };
    };

    down = (event) => {
        // prevent touch scroll
        event.preventDefault();
        // move the selector
        window.addEventListener('mousemove', this.move);
        window.addEventListener('touchmove', this.move);
        // end of moving
        window.addEventListener('mouseup', this.up);
        window.addEventListener('touchend', this.up);
        window.addEventListener('touchcancel', this.up);
        window.addEventListener('blur', this.up);
        document.addEventListener('mouseenter', this.mouseenter);
        // rect is used to get coordinates of area html element
        this.rect = event.target.getBoundingClientRect();
        // call onMove
        this.move(event);
    };

    move = (event) => {
        const { onChange } = this.props;
        const { rect } = this;
        let { top, left } = this.state;
        // set the user's coordinates
        if (event) {
            top =
                (event.changedTouches
                    ? event.changedTouches[0].clientY
                    : event.clientY) - rect.top;
            left =
                (event.changedTouches
                    ? event.changedTouches[0].clientX
                    : event.clientX) - rect.left;
        }
        // user leaves area
        if (rect) {
            if (top < 0) {
                top = 0;
            } else if (top >= rect.height) {
                top = rect.height - 1;
            }
            if (left < 0) {
                left = 0;
            } else if (left >= rect.width) {
                left = rect.width - 1;
            }
        }
        // move selector
        this.setState({ top, left });
        // call onChange
        if (onChange) {
            onChange(this.getColor(left, top));
        }
    };

    mouseenter = (event) => {
        // mouse enters window/webview/iframe
        if (event.buttons !== 1) {
            // left mouse click
            this.up();
        }
    };

    up = () => {
        const { onChangeEnd } = this.props;
        const { top, left } = this.state;
        // remove event listeners
        window.removeEventListener('mousemove', this.move);
        window.removeEventListener('touchmove', this.move);
        window.removeEventListener('mouseup', this.up);
        window.removeEventListener('touchend', this.up);
        window.removeEventListener('touchcancel', this.up);
        window.removeEventListener('blur', this.up);
        document.removeEventListener('mouseenter', this.mouseenter);
        // call onChangeEnd
        if (onChangeEnd) {
            onChangeEnd(this.getColor(left, top));
        }
    };

    render() {
        const { height, width } = this.props;
        const { top, left } = this.state;

        return (
            <div
                className="cc__colorArea"
                ref={this.area}
                onMouseDown={this.down}
                onTouchStart={this.down}
                style={{ height: `${height}px` }}
            >
                <canvas // TODO use div with gradient background instead of canvas
                    className="cc__colorArea__area"
                    ref={this.canvas}
                    height={height}
                    width={width}
                />
                <div
                    className="cc__colorArea__selector"
                    style={{ top, left }}
                />
            </div>
        );
    }
}

ColorArea.propTypes = {
    color: PropTypes.shape({
        h: PropTypes.number.isRequired,
        s: PropTypes.number.isRequired,
        v: PropTypes.number.isRequired,
    }).isRequired,
    height: PropTypes.number,
    width: PropTypes.number,
    onChange: PropTypes.func,
    onChangeEnd: PropTypes.func,
};

ColorArea.defaultProps = {
    height: 150,
    width: 300,
    onChange: null,
    onChangeEnd: null,
};

ColorArea.displayName = 'ColorArea';
