import React, { CSSProperties, FC, useCallback, useEffect, useMemo, useState } from 'react';
import { splitRgb } from '../../../utils/color';
import ColorArea from './color-area/ColorArea';
import ColorInput from './color-input/ColorInput';
import ColorPresets from './color-presets/ColorPresets';
import ColorSettings from './color-settings/ColorSettings';
import { StyledColorPickerContent } from './ColorPickerContent.styles';

export type ColorPickerContentProps = {
    onChange: (color: CSSProperties['color']) => void;
    color: CSSProperties['color'];
    internalColor: CSSProperties['color'];
    shouldShowColorPrefix?: boolean;
};

const ColorPickerContent: FC<ColorPickerContentProps> = ({
    color,
    internalColor,
    onChange,
    shouldShowColorPrefix,
}) => {
    const [hueColor, setHueColor] = useState<CSSProperties['color']>();
    const [selectedColor, setSelectedColor] = useState<CSSProperties['color']>(color);
    const [opacity, setOpacity] = useState<number>(1);
    const [externalColor, setExternalColor] = useState<CSSProperties['color']>();

    useEffect(() => {
        if (color) {
            setExternalColor(color);
        }
    }, [color]);

    useEffect(() => {
        if (color) {
            const rgba = splitRgb(color);

            if (rgba && rgba.a) {
                setOpacity(rgba.a);
            }
        }
    }, [color]);

    const handleHueColorChange = useCallback((selectedHueColor: CSSProperties['color']) => {
        setHueColor(selectedHueColor);
    }, []);

    const handleColorChange = useCallback((newColor: CSSProperties['color']) => {
        setSelectedColor(newColor);
    }, []);

    const handleOpacityChange = useCallback((opacityColor: CSSProperties['color']) => {
        const rgba = splitRgb(opacityColor);

        if (rgba && rgba.a) {
            setOpacity(rgba.a);
        }
    }, []);

    const handlePresentSelect = useCallback((selectedPresentColor: CSSProperties['color']) => {
        const rgb = splitRgb(selectedPresentColor);

        if (rgb) {
            setExternalColor(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1})`);
        }
    }, []);

    const handleInputChange = useCallback((selectedInputColor: CSSProperties['color']) => {
        const rgb = splitRgb(selectedInputColor);

        if (rgb) {
            setExternalColor(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a ?? 1})`);
        }
    }, []);

    useEffect(() => {
        const rgb = splitRgb(selectedColor);

        if (rgb) {
            onChange(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`);
        }
    }, [onChange, opacity, selectedColor]);

    return useMemo(
        () => (
            <StyledColorPickerContent>
                <ColorArea onChange={handleColorChange} color={internalColor} hueColor={hueColor} />
                <ColorSettings
                    externalColor={externalColor}
                    internalColor={internalColor}
                    selectedColor={selectedColor}
                    onHueColorChange={handleHueColorChange}
                    onOpacityChange={handleOpacityChange}
                />
                {shouldShowColorPrefix && <ColorPresets onClick={handlePresentSelect} />}
                <ColorInput color={selectedColor} onChange={handleInputChange} />
            </StyledColorPickerContent>
        ),
        [
            externalColor,
            handleColorChange,
            handleHueColorChange,
            handleInputChange,
            handleOpacityChange,
            handlePresentSelect,
            hueColor,
            internalColor,
            selectedColor,
            shouldShowColorPrefix,
        ]
    );
};

ColorPickerContent.displayName = 'ColorPickerContent';

export default ColorPickerContent;
