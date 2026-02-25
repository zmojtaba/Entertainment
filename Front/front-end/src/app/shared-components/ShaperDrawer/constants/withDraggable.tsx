import { ComponentType, useEffect, useRef, useState } from "react";
import Konva from 'konva'
import { Transformer } from "react-konva";
import { useShapeContext } from "..";
import konva from 'konva';
import _ from 'lodash'
import { KonvaEventObject, NodeConfig, Node } from 'konva/lib/Node';
import { calcArea, getCenterCoords, getRectPoints } from "./utils";

function getCorner(pivotX, pivotY, diffX, diffY, angle) {
    const distance = Math.sqrt(diffX * diffX + diffY * diffY);

    /// find angle from pivot to corner
    angle += Math.atan2(diffY, diffX);

    /// get new x and y and round it off to integer
    const x = pivotX + distance * Math.cos(angle);
    const y = pivotY + distance * Math.sin(angle);

    return { x: x, y: y };
}
function getClientRect(rotatedBox) {
    const { x, y, width, height } = rotatedBox;
    const rad = rotatedBox.rotation;

    const p1 = getCorner(x, y, 0, 0, rad);
    const p2 = getCorner(x, y, width, 0, rad);
    const p3 = getCorner(x, y, width, height, rad);
    const p4 = getCorner(x, y, 0, height, rad);

    const minX = Math.min(p1.x, p2.x, p3.x, p4.x);
    const minY = Math.min(p1.y, p2.y, p3.y, p4.y);
    const maxX = Math.max(p1.x, p2.x, p3.x, p4.x);
    const maxY = Math.max(p1.y, p2.y, p3.y, p4.y);

    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
    };
}

function getTotalBox(boxes) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    boxes.forEach((box) => {
        minX = Math.min(minX, box.x);
        minY = Math.min(minY, box.y);
        maxX = Math.max(maxX, box.x + box.width);
        maxY = Math.max(maxY, box.y + box.height);
    });
    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
    };
}

interface TransformProps {
    transformProps?: Konva.TransformerConfig;
    isSelected: boolean;
    onDragMove?(nodes: Node<NodeConfig>[]): void;
}

//add mouse drag cursor and transformable to component
export const WithDraggable = <T,>(WrappedComponent: ComponentType<T>) => (props: TransformProps & T) => {
    const trsRef = useRef<Konva.Transformer>(null);
    const shapeRef = useRef<konva.Shape>();
    const { dimension, rotateEnabled, drawingPadding } = useShapeContext();
    const { transformProps, isSelected, onDragMove, ...wrappedComponentProps } = props;
    const scaledPaddingRef = useRef(1);

    useEffect(() => {
        if (trsRef.current && shapeRef.current) {
            trsRef.current.setNodes([shapeRef.current]);
            trsRef.current.getLayer()?.batchDraw();
            scaledPaddingRef.current = (shapeRef.current?.getAbsoluteScale()?.x ?? 1) * drawingPadding
        }
    }, [isSelected]);

    //let implement shape direction arrow
    useEffect(() => {
        let node = shapeRef.current;
        let arrowNode: Konva.Arrow;
        let direction = node?.attrs?.direction
        if (node && direction && !(node instanceof Konva.Circle)) { //currently not implemented for circles
            let layer = node.getStage()?.getLayers()?.[0]
            let color = node.attrs.stroke ?? 'yellow';
            let points = node instanceof Konva.Line ? _.chunk<number>(node.attrs.points, 2) : getRectPoints({ data: node?.attrs } as any);
            let area = calcArea(points);
            let center = getCenterCoords(points)
            let power = Math.round(Math.sqrt(area / 40));
            let dir_points = {
                top: [0, -power],
                bottom: [0, power],
                right: [power, 0],
                left: [-power, 0],
            }

            if (dir_points[direction] && layer) {
                arrowNode = new Konva.Arrow({
                    x: center.x,
                    y: center.y,
                    points: [0, 0, ...dir_points[direction]],
                    pointerLength: 40,
                    pointerWidth: 20,
                    fill: color,
                    stroke: color,
                    strokeWidth: 12,
                });
                layer.add(arrowNode);
            }
        }

        return () => {
            arrowNode && arrowNode.destroy();
        }
    })


    const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
        let nodes: any[] = []
        const tr = trsRef.current;
        if (tr) {
            const boxes = tr.nodes().map((node) => node.getClientRect());
            const box = getTotalBox(boxes);
            tr.nodes().forEach((shape) => {
                const absPos = shape.getAbsolutePosition();
                const scale = shape.getAbsoluteScale()!,
                    boxWidth = shape.width() * scale?.x,
                    boxHeight = shape.height() * scale?.y;

                // where are shapes inside bounding box of all shapes?
                const offsetX = box.x - absPos.x;
                const offsetY = box.y - absPos.y;

                // we total box goes outside of viewport, we need to move absolute position of shape
                const newAbsPos = { ...absPos };
                if (absPos.x < scaledPaddingRef.current) {
                    newAbsPos.x = scaledPaddingRef.current;
                }
                if (absPos.y < scaledPaddingRef.current) {
                    newAbsPos.y = scaledPaddingRef.current;
                }
                if (absPos.x + boxWidth > dimension.width - scaledPaddingRef.current) {
                    newAbsPos.x = dimension.width - boxWidth - scaledPaddingRef.current;
                }
                if (absPos.y + boxHeight > dimension.height - scaledPaddingRef.current) {
                    newAbsPos.y = dimension.height - boxHeight - scaledPaddingRef.current;
                }
                shape.setAbsolutePosition(newAbsPos);
                nodes.push(shape)
            });
        }

        onDragMove?.(nodes)
    }

    return (
        <>
            <WrappedComponent
                ref={shapeRef}
                draggable={isSelected}
                onMouseDown={e => {
                    // style stage container:
                    const container = e.target?.getStage().container();
                    if (container)
                        container.style.cursor = "grabbing";
                }}
                onMouseUp={e => {
                    const container = e.target?.getStage()?.container();
                    if (container && isSelected)
                        container.style.cursor = "grab";
                }}
                onMouseEnter={e => {
                    // style stage container:
                    const container = e.target?.getStage()?.container();
                    if (container && isSelected)
                        container.style.cursor = "grab";
                }}
                onMouseLeave={e => {
                    const container = e?.target?.getStage()?.container();
                    if (container && isSelected)
                        container.style.cursor = "default";
                }}
                shadowColor="black"
                shadowBlur={50}
                shadowOpacity={isSelected ? 1 : 0}
                shadowOffsetX={20}
                shadowOffsetY={20}
                {...(wrappedComponentProps as T)}

            />
            {isSelected &&
                <Transformer
                    ref={trsRef}
                    flipEnabled={false}
                    boundBoxFunc={(oldBox, newBox) => {
                        const box = getClientRect(newBox);
                        const isOut =
                            box.x < scaledPaddingRef.current ||
                            box.y < scaledPaddingRef.current ||
                            box.x + box.width > dimension.width - scaledPaddingRef.current ||
                            box.y + box.height > dimension.height - scaledPaddingRef.current;

                        // if new bounding box is out of visible viewport, let's just skip transforming
                        // this logic can be improved by still allow some transforming if we have small available space
                        if (isOut) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                    rotateAnchorOffset={30}
                    onDragMove={handleDragMove}
                    rotateEnabled={rotateEnabled}
                    {...transformProps}
                />}
        </>
    )
}
