import { useEffect, useRef, useState } from 'react'
import { useTheme } from '@mui/material';
import _ from 'lodash';
import konva from 'konva';
import { Circle, Line, Text } from 'react-konva';
import { KonvaEventObject, NodeConfig, Node } from 'konva/lib/Node';
import type {
    IShape,
    Point,
    Bbox,
    SHAPE_VARIANT,
    DirectionType
} from '../constants/types';
import { WithDraggable, constrictPointsInBbox, convertColorNameToHex } from '../constants/utils';

const transformProps = {
    resizeEnabled: false,
    rotateEnabled: false,
    borderEnabled: false,
}
const DraggableLine = WithDraggable(Line);
const DraggableCircle = WithDraggable(Circle);

type PolygonShape = IShape<SHAPE_VARIANT.POLYGON>

interface PropsType {
    polygon: PolygonShape;
    isSelected: boolean;
    drawingShapeId: string | undefined;
    onUpdateShape(shape: PolygonShape): void;
    onDrawEnd?: (shape: PolygonShape) => void;
    getScaledPointerPosition?: () => undefined | Point,
    bbox: Bbox,
    direction?: DirectionType | ''
}

export default function CustomPolygon(props: PropsType) {
    const {
        polygon,
        drawingShapeId,
        onDrawEnd,
        isSelected,
        onUpdateShape,
        getScaledPointerPosition,
        bbox,
        direction
    } = props
    const { palette } = useTheme()
    const [showText, setShowText] = useState(false)
    const startPointRef = useRef<Point>()
    const [dragging, setDragging] = useState(false)
    const [stage, setStage] = useState<konva.Stage | null>(null)

    const mmEvtName = `mousemove.${polygon.id}`
    const mupEvtName = `mouseup`
    const isInDrawingMode = drawingShapeId == polygon.id
    const [circleId, setCircleId] = useState<number | null>(null)

    const handleMouseUpStage = () => {
        startPointRef.current = undefined
        setStage(null);
        setDragging(false)
    }

    useEffect(() => {
        if (stage) {
            stage.on(mmEvtName, () => {
                if (startPointRef.current) {
                    handleDragMoveShape()
                    !dragging && setDragging(true)
                }
            });
            document.addEventListener(mupEvtName, handleMouseUpStage);
        }
        return () => {
            stage?.off?.(mmEvtName);
            document.removeEventListener(mupEvtName, handleMouseUpStage);
        }
    }, [stage])


    const handleClickOnShape = (e: KonvaEventObject<PointerEvent>) => {
        if (drawingShapeId)
            return
        startPointRef.current = getScaledPointerPosition?.();
        if (!stage)
            setStage(e.target.getStage())
    }

    const handleDragMoveShape = () => {
        let endPoint = getScaledPointerPosition?.(),
            startPoint = startPointRef.current;
        if (endPoint && startPoint) {
            let dx = endPoint.x - startPoint.x;
            let dy = endPoint.y - startPoint.y;

            let newPoints = polygon.data.points.map((item, index) => (index % 2 === 0) ? item + dx : item + dy);
            newPoints = constrictPointsInBbox(newPoints, bbox);

            onUpdateShape({
                ...polygon,
                data: {
                    ...polygon.data,
                    points: newPoints
                }
            })
        }
    }

    const handlePointDrag = (nodes: Node<NodeConfig>[]) => {
        let node = nodes[0];
        const { x, y, id: chunkIndex } = node.attrs;
        let fixedPoint = { x, y }
        const clonePolygon = _.cloneDeep(polygon)
        let { points } = clonePolygon.data
        let index = chunkIndex * 2;
        points[index] = fixedPoint.x;
        points[++index] = fixedPoint.y;
        onUpdateShape(clonePolygon)
    }


    return (
        <>
            <DraggableLine
                id={polygon.id}
                points={polygon.data.points}
                stroke={polygon.color}
                strokeWidth={8}
                closed={!isInDrawingMode}
                fill={convertColorNameToHex(polygon.color, palette)}
                isSelected={isSelected}
                onPointerDown={handleClickOnShape}
                transformProps={{ resizeEnabled: false, rotateEnabled: false }}
                draggable={false}
                direction={direction}
            />

            {
                /** These circles are for editing purpose and
                 *  appear when the polygon is in editing mode
                 */

                isSelected && !isInDrawingMode && !dragging &&
                _.chunk(polygon.data.points, 2)
                    .map((p, chunkIndex) => (
                        (circleId === null || circleId === chunkIndex) &&
                        <DraggableCircle
                            key={chunkIndex}
                            id={String(chunkIndex)}
                            x={p?.[0]}
                            y={p?.[1]}
                            radius={25}
                            stroke={chunkIndex === circleId ? palette.error.dark : palette.info.light}
                            strokeWidth={15}
                            fill={'white'}
                            onPointerEnter={e => {
                                e.target.to({
                                    scaleX: 1.2,
                                    scaleY: 1.2,
                                    duration: 0.1,
                                });
                            }}
                            onPointerLeave={e => {
                                e.target.to({
                                    scaleX: 1,
                                    scaleY: 1,
                                    duration: 0.1,
                                })
                            }}
                            transformProps={transformProps}
                            isSelected
                            //@ts-ignore
                            onDragMove={handlePointDrag}
                            onPointerDown={() => setCircleId(chunkIndex)}
                            onPointerUp={() => setCircleId(null)}
                            onDragEnd={() => setCircleId(null)}
                        />
                    ))
            }

            {
                /**
                 *   This circle is a point where 
                 *   the polygon drawing ends
                 *   when the user clicks on it
                 */

                isInDrawingMode &&
                <>
                    <Circle
                        id={`start-point`}
                        x={polygon.data.points[0]}
                        y={polygon.data.points[1]}
                        radius={25}
                        stroke={palette.error.dark}
                        strokeWidth={15}
                        fill={palette.primary.light}
                        onPointerDown={onDrawEnd?.bind(null, polygon)}
                        onMouseEnter={e => {
                            e.target.to({
                                scaleX: 1.5,
                                scaleY: 1.5,
                                duration: 0.2,
                            });
                            setShowText(true);
                        }}
                        onMouseLeave={e => {
                            e.target.to({
                                scaleX: 1,
                                scaleY: 1,
                                duration: 0.2,
                            })
                            setShowText(false);
                        }}
                    />
                    <Text
                        x={polygon.data.points[0] - 300}
                        y={polygon.data.points[1] - 120}
                        text={'برای اتمام رسم روی نقطه شروع کلیک کنید'}
                        fontSize={40}
                        fill={'white'}
                        opacity={showText ? 1 : 0}
                        fontFamily='IranSans'
                    />
                </>
            }
        </>
    )
}
