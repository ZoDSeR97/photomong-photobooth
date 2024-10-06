import useImage from "use-image";
import { useState, useEffect, useRef } from "react";
import { Image as KonvaImage, Group, Rect, Transformer } from 'react-konva';
import { useHoverDirty, useLongPress } from 'react-use';
import cancelImage from "../assets/Sticker/items/cancel.png";

export const StickerItem = ({ image, onDelete, onDragEnd }) => {
    const imageRef = useRef(null);
    const isHovered = useHoverDirty(imageRef);
    const [stickerImage] = useImage(image.src);
    const [deleteImage] = useImage(cancelImage);
    const [showDeleteButton, setShowDeleteButton] = useState(false);    

    const trRef = useRef();    

    const onLongPress = () => {
        setShowDeleteButton(true);
    }

    image.resetButtonRef.current = () => {
        setShowDeleteButton(false);
    }

    const longPressEvent = useLongPress(onLongPress, {
        delay: 200
    });
    const [isDragging, setIsDragging] = useState(false);

    const stickerWidth = image.width;
    const stickerHeight = stickerImage ? (image.width * stickerImage.height) / stickerImage.width : 0;

    useEffect(() => {
        if (isHovered) {
            setShowDeleteButton(true);
        } else {
            setTimeout(() => {
                setShowDeleteButton(false);
            }, 2000);
        }
    }, [isHovered]);

    return (
        <Group
            draggable
            x={image.x}
            y={image.y}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(event) => {
                setIsDragging(false);
                onDragEnd(event);
            }}
        >
            <KonvaImage
                ref={imageRef}
                width={image.width}
                height={stickerHeight}
                image={stickerImage}
                {...longPressEvent}
                {...stickerImage}                
            />            
            {showDeleteButton && !isDragging && (
                <KonvaImage
                    onTouchStart={onDelete}
                    onClick={onDelete}
                    image={deleteImage}
                    width={25}
                    height={25}
                    offsetX={-stickerWidth / 2 - 50}
                />
            )}
        </Group>
    )
}