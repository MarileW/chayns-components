import { MediaType, openMedia, OpenMediaItem } from 'chayns-api';
import React, { CSSProperties, MouseEventHandler, useCallback } from 'react';
import GroupedImage from '../../../../grouped-image/GroupedImage';

type ListItemImageProps = {
    careOfLocationId?: number;
    cornerImage?: string;
    imageBackground?: CSSProperties['background'];
    images: string[];
    shouldHideBackground: boolean;
    shouldShowRoundImage: boolean;
    shouldOpenImageOnClick: boolean;
};

const ListItemImage: React.FC<ListItemImageProps> = ({
    careOfLocationId,
    cornerImage,
    imageBackground,
    images,
    shouldHideBackground,
    shouldShowRoundImage,
    shouldOpenImageOnClick,
}) => {
    const handleImageClick = useCallback<MouseEventHandler<HTMLDivElement>>(
        (event) => {
            if (!shouldOpenImageOnClick) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            const items: OpenMediaItem[] = images.map((image) => ({
                url: image,
                mediaType: MediaType.IMAGE,
            }));

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            void openMedia({ items, startIndex: 0 });
        },
        [images, shouldOpenImageOnClick],
    );

    if (images && images[0]) {
        const careOfImage = careOfLocationId
            ? `https://sub60.tobit.com/l/${careOfLocationId}?size=128`
            : undefined;

        return (
            <GroupedImage
                cornerImage={cornerImage ?? careOfImage}
                imageBackground={imageBackground}
                images={images}
                onClick={handleImageClick}
                shouldPreventBackground={shouldHideBackground}
                shouldShowRoundImage={shouldShowRoundImage}
            />
        );
    }

    return null;
};

ListItemImage.displayName = 'ListItemImage';

export default ListItemImage;
