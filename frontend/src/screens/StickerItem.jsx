import useImage from "use-image";
import React, { useState, useEffect, useRef } from "react";
import { Image as KonvaImage, Group, Rect, Transformer, Layer, Shape } from 'react-konva';
import { useHoverDirty, useLongPress } from 'react-use';
import cancelImage from "../assets/Sticker/items/cancel.png";
import scaleImage from "../assets/Sticker/items/scale.png";
import Konva from "konva";

export const StickerItem = ({
    isStickerDrag,
    setStickerDrag,
    shapeProps, isSelected, onChange, onSelect, image, onDelete, onDragEnd, onResize, onTransform }) => {
    const imageRef = useRef(null);
    const isHovered = useHoverDirty(imageRef);
    const [stickerImage] = useImage(image.src);
    const [deleteImage] = useImage(cancelImage);
    const [resizeImgae, resizeImageStatus] = useImage(scaleImage);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    // const shapeRef = useRef();    
    const [showResize, setShowResize] = useState(false)
    const trRef = useRef();

    useEffect(() => {
        if (!resizeImgae) return
        // if (!isHovered)return
        if (isSelected) {
            // we need to attach transformer manually
            // setStickerMoving(true)
            const tr = trRef.current;
            tr.nodes([imageRef.current]);
            var bot = tr.findOne(".bottom-left");
            const iconCanvas = document.createElement("canvas");
            iconCanvas.width = bot.width();
            iconCanvas.height = bot.height();
            const ctx = iconCanvas.getContext("2d");
            ctx.fillStyle = "transparent";
            ctx.fillRect(0, 0, iconCanvas.width, iconCanvas.height);
            ctx.drawImage(resizeImgae, 0, 0, iconCanvas.width, iconCanvas.height);
            tr.update = function () {
                Konva.Transformer.prototype.update.call(tr);
                var bot = this.findOne(".bottom-left");
                // disaable fill
                bot.fill(null);
                // enable icon
                bot.fillPatternImage(iconCanvas);
            };

            tr.update();
            tr.getLayer().batchDraw();
        }
    }, [isSelected, resizeImgae]);
    const onLongPress = () => {
        setShowDeleteButton(true);
    }

    image.resetButtonRef.current = () => {
        setShowDeleteButton(false);

    }

    const longPressEvent = useLongPress(onLongPress, {

        delay: 200
    });


    const stickerWidth = image.width;
    const stickerHeight = stickerImage ? (image.width * stickerImage.height) / stickerImage.width : 0;
    const aspectRatio = stickerWidth / stickerHeight;
    useEffect(() => {
        if (isHovered) {
            setTimeout(() => {
                setShowDeleteButton(true);
            }, 100000);
            // setShowDeleteButton(true);
        } else {
            setTimeout(() => {
                setShowDeleteButton(false);
            }, 2000);
        }
    }, [isHovered]);

    const anchorStyleFunc = (anchor) => {
        if (anchor.hasName('bottom-left')) {
            return {
                fillPatternImage: image,
                fillPatternOffset: { x: -15, y: -15 },
                width: 30,
                height: 30,
            };
        }
        return {};
    };
    return (
        <Group

            // ref={shapeRef}
            // onClick={onSelect}
            onTap={onSelect}
            draggable
            x={image.x}
            y={image.y}
            onTransform={(newWidth) => {
            }}
            onDragStart={() => {
                setIsDragging(true)
                setStickerDrag(true)
            }}
            width={image.width}
            onMouseEnter={() => { }}

            onDragEnd={(event) => {
                setStickerDrag(false)
                setShowDeleteButton(false)
                //  onChange({
                //     ...shapeProps,
                //     x: event.target.x(),
                //     y: event.target.y(),
                //   });
                setIsDragging(false);
                onDragEnd(event);

            }}

            onTransformEnd={(e) => {

                // transformer is changing scale of the node
                // and NOT its width or height
                // but in the store we have only width and height
                // to match the data better we will reset scale on transform end
                const node = imageRef.current;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();

                // we will reset it back
                node.scaleX(1);
                node.scaleY(1);
                onChange({
                    ...image,
                    x: node.x(),
                    y: node.y(),
                    // set minimal value
                    width: Math.max(5, node.width() * scaleX),
                    height: Math.max(node.height() * scaleY),
                });
            }}
        >

            <KonvaImage

                ref={imageRef}
                // ref={shapeRef}
                width={image.width}
                height={stickerHeight}
                image={stickerImage}
                {...longPressEvent}
                {...stickerImage}
                onClick={onSelect}
                onMouseLeave={() => { setShowDeleteButton(false) }}
                onMouseEnter={() => { setShowDeleteButton(true) }}
            />

            {/* {showDeleteButton && !isDragging && ( */}
            {isSelected && <KonvaImage

                onTouchStart={onDelete}
                onClick={onDelete}
                image={deleteImage}
                width={25}
                height={25}
                offsetY={stickerHeight / 2 - 25 - 16.5}
                offsetX={-stickerWidth / 2 - 50 + 16.5}
            />}


            {isSelected && <Transformer

                rotateEnabled={false}
                keepRatio={true}
                onMouseOut={() => {
                    setStickerDrag(false);
                }}


                ref={trRef}
                enabledAnchors={['bottom-left']}
                anchorSize={25}
                borderDash={[6, 6]}
                flipEnabled={false}
                onDragEnd={() => {
                    setStickerDrag(false)
                }}
                anchorStyleFunc={anchorStyleFunc}
                boundBoxFunc={(oldBox, newBox) => {
                    setStickerDrag(true);

                    // limit resize
                    if (Math.abs(newBox.width) < 25 || Math.abs(newBox.height) < 25) {
                        // setStickerDrag(false);
                        // requestAnimationFrame(() => setStickerDrag(false));
                        return oldBox;
                    }
                    if (newBox) {
                        onTransform(oldBox.x, oldBox.y, newBox.width, newBox.height)
                    }
                    // setStickerDrag(false);
                    // requestAnimationFrame(() => setStickerDrag(false));
                    // onTransform(newBox)
                    return newBox;
                }}
            />}
            {/* )} */}
        </Group>
    )
}