import classes from './styles.module.scss'
import {
  MutableRefObject, createContext, useContext,
  useEffect, useMemo, useRef, useState
} from 'react'
import { clsx } from 'clsx'
import { v4 as uuid } from 'uuid'
import konva from 'konva';
import _ from 'lodash';
import { Stage, Layer, Circle, Rect } from 'react-konva';
import { Button, ButtonGroup, useTheme } from '@mui/material';
import NormalizePolygonButton from './components/NormalizePolygonButton';
import {
  createCircle,
  createRect, drawPolygon,
  initPoint, COLORS, SHAPE_LIST,
  convertColorNameToHex,
  calcArea,
  constrictPointsInBbox,
  isPointInBbox,
  getRectPoints,
  WithDraggable
} from './constants/utils';
import {
  SHAPE_VARIANT,
  type ContextType, OnUpdateShapeCallback, Dimension,
  IShape, GroupedShapes, ShapesData, ColorType, OnDeleteShapeCallback,
} from './constants/types';
import SquareRoundedIcon from '@mui/icons-material/SquareRounded';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CustomPolygon from './components/CustomPolygon';
import PanToolOutlinedIcon from '@mui/icons-material/PanToolOutlined';

const DraggableCircle = WithDraggable(Circle);
const DraggableRect = WithDraggable(Rect);
const ShapeContext = createContext({} as ContextType)

interface PropsType {
  stageRef?: MutableRefObject<konva.Stage | undefined>;
  width: number;
  height: number;
  shapes: IShape[];
  imgURI?: string; //can be dataURI or img link;
  onUpdateShape: OnUpdateShapeCallback;
  onDrawEnd: OnUpdateShapeCallback;
  onDeleteShape?: OnDeleteShapeCallback;
  validShapes?: SHAPE_VARIANT[],
  rotateEnabled?: boolean;
  drawingPadding?: number;
  ondblClickShape?: (shape: IShape) => void;
  showSegment?: boolean;
}

function ShapeDrawer(props: PropsType) {
  const {
    width = 600,
    height = 400,
    validShapes = [SHAPE_VARIANT.CIRCLE, SHAPE_VARIANT.RECTANGLE],
    rotateEnabled = false,
    drawingPadding = 1,
    imgURI,
    shapes,
    onDeleteShape,
    showSegment
  } = props;

  const { palette } = useTheme();
  const layerRef = useRef<konva.Layer>(null);
  const stageRef = useRef<konva.Stage>(null);
  const [loadingImg, setLoadingImg] = useState(false);
  const [imgDimension, setImgDimension] = useState<Dimension>();
  const [editingShape, setEditingShape] = useState<IShape>();
  const [shapeVariant, setShapeVariant] = useState<SHAPE_VARIANT>(SHAPE_VARIANT.NONE);
  const [drawingShape, setDrawingShape] = useState<IShape>();
  const isDrawingRef = useRef(false);
  const startPointRef = useRef(initPoint);
  const endPointRef = useRef(initPoint);
  const [color, setColor] = useState<ColorType>('red');
  const loadingTextRef = useRef<konva.Text>()
  const bgImgRef = useRef<konva.Image>();
  const showLayer = (imgURI && imgDimension && !loadingImg) || !imgURI;
  const goOutBTNs = shapeVariant !== SHAPE_VARIANT.NONE || Boolean(editingShape);
  const bbox = {
    ... (imgDimension ? imgDimension : { width, height }),
    x: 0,
    y: 0
  }

  const dblClickedRef = useRef(false);

  const groupedShapes = useMemo(() => {
    console.log("Shape", shapes)
    return _.groupBy((shapeVariant !== SHAPE_VARIANT.NONE ? [] : shapes)
      .concat(drawingShape ? [drawingShape] : []), s => s.type) as GroupedShapes
  }, [shapes, drawingShape, shapeVariant]);

  //register stageRef
  useEffect(() => {
    if (props.stageRef && stageRef.current)
      props.stageRef.current = stageRef.current

  }, [props.stageRef]);

  //load image
  useEffect(() => {
    bgImgRef.current?.destroy();
    loadingTextRef.current?.destroy();

    const layer = layerRef.current
    if (imgURI && layer) {
      var text = new konva.Text({
        x: width / 2 - 100,
        text: 'بارگذاری عکس...',
        fontSize: 27,
        fontFamily: 'Calibri',
        fill: palette.info.light,
      });
      loadingTextRef.current = text

      text.y(height / 2 - text.height());
      text.zIndex(800)
      layer.add(text);
      layer.draw();

      setLoadingImg(true);
      konva.Image.fromURL(imgURI, async (konvaImgLayer) => {
        let imgDimension = {
          width: konvaImgLayer.attrs.image.width,
          height: konvaImgLayer.attrs.image.height
        }
        konvaImgLayer.setAttrs({
          name: 'root',
          x: 0,
          y: 0,
          ...imgDimension
        })
        bgImgRef.current = konvaImgLayer
        await window.wait(600)
        layer.add(konvaImgLayer);
        layer.draw();
        text.destroy();
        setLoadingImg(false);
        setImgDimension(imgDimension);
      }, (error) => {
        // setLoadingImg(false);
        text.text('خطا در بارگذاری عکس!').fill(palette.error.main)
      })
    }
  }, [imgURI]);


  useEffect(() => {
    if (imgDimension)
      stageRef.current?.scale({
        x: width / imgDimension?.width,
        y: height / imgDimension?.height
      })
  }, [width, height, imgDimension])


  const updateShape = (shape: IShape) => {
    props?.onUpdateShape?.({
      shape: shape,
      drawBounds: { width, height },
      ...(imgURI && imgDimension ? { imgDimension } : {})
    })
    setEditingShape(shape)
  }

  const handleTransformEnd = (e: konva.KonvaEventObject<Event>, shape: IShape) => {
    const node = e.target,
      scaleX = node.scaleX(),
      scaleY = node.scaleY();

    //reset scale
    node.scaleX(1)
    node.scaleY(1)

    switch (shape.data.type) {
      case SHAPE_VARIANT.CIRCLE:
        updateShape({
          ...shape,
          data: {
            ...shape.data,
            x: node.x(),
            y: node.y(),
            radius: node.attrs.radius * scaleX
          }
        })
        break;
      case SHAPE_VARIANT.RECTANGLE:
        updateShape({
          ...shape,
          data: {
            ...shape.data,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(6, node.height() * scaleY)
          }
        })
        break;
      case SHAPE_VARIANT.POLYGON:
        break;
    }
  }

  const handleDragEnd = (e: konva.KonvaEventObject<DragEvent>, shape: IShape) => {
    const { x, y } = e.target.attrs;

    switch (shape.data.type) {
      case SHAPE_VARIANT.CIRCLE:
        updateShape({ ...shape, data: { ...shape.data, x, y } })
        break;
      case SHAPE_VARIANT.RECTANGLE:
        updateShape({ ...shape, data: { ...shape.data, x, y } })
        break;
      case SHAPE_VARIANT.POLYGON:
        updateShape(shape)
        break;
    }
    // e.target.moveToTop()
  }

  const getScaledPointerPosition = () => {
    let point = stageRef.current?.getPointerPosition();
    let scale = stageRef.current?.scale();
    scale = {
      x: scale?.x ?? 1,
      y: scale?.y ?? 1
    };
    if (point) {
      point = {
        x: Math.abs(point.x / scale.x),
        y: Math.abs(point.y / scale.y)
      }
      let fixedPoint = isPointInBbox(bbox, point, drawingPadding).fixedPoint
      return {
        x: fixedPoint[0],
        y: fixedPoint[1]
      }

    } else
      return undefined
  }

  const handleSelectShapeVariant = (shapeVariant: SHAPE_VARIANT) => {
    setShapeVariant(shapeVariant);
    setEditingShape(undefined);
    setDrawingShape(undefined);
    endPointRef.current = initPoint
    startPointRef.current = initPoint;
    isDrawingRef.current = false;
    const container = stageRef.current?.container();
    if (container)
      container.style.cursor = "crosshair";
  };

  const cancelDrawing = () => {
    setDrawingShape(undefined);
    setShapeVariant(SHAPE_VARIANT.NONE);
    endPointRef.current = initPoint
    startPointRef.current = initPoint;
    isDrawingRef.current = false;
    const container = stageRef.current?.container();
    if (container)
      container.style.cursor = "default";
  }

  //press escape cancel drawing
  useEffect(() => {
    stageRef?.current?.on('keydown', cancelDrawing);

  }, []);

  function drawShape(moving: boolean = false) {
    const id = drawingShape ? drawingShape.id : uuid();
    let data: ShapesData | null = null,
      start = startPointRef.current,
      end = endPointRef.current;

    switch (shapeVariant) {
      case SHAPE_VARIANT.CIRCLE:
        data = createCircle({ start, end })
        break;
      case SHAPE_VARIANT.RECTANGLE:
        data = createRect({ start, end })
        break;
      case SHAPE_VARIANT.POLYGON:
        let points = [...drawingShape && 'points' in drawingShape?.data ? drawingShape.data.points : []];
        points = constrictPointsInBbox(points, bbox,5)
        data = drawPolygon({
          points,
          point: moving ? endPointRef.current : startPointRef.current,
          moving
        })
        break;
    }

    if (data) {
      let shape: IShape = {
        ...drawingShape,
        id,
        type: shapeVariant,
        color,
        data
      }

      setDrawingShape(shape)
      setEditingShape(undefined)
    }
  }

  const findDrillShape = () => {
    const _shapes = _.cloneDeep(shapes);
    let foundedShape: any = undefined;
    let foundedNode: any = undefined;
    let minArea = Number.POSITIVE_INFINITY;

    (stageRef.current?.getAllIntersections(stageRef.current.getPointerPosition()) as konva.Shape[])
      .forEach(node => {
        if (!(node instanceof konva.Image)) {
          let shape = _shapes.find(sh => sh.id === node.attrs.id);
          if (shape) {
            let area = 0;
            if (shape.data.type == SHAPE_VARIANT.POLYGON) {
              let points = _.chunk(shape.data.points, 2)
              area = calcArea(points)
            }
            else if (shape.data.type === SHAPE_VARIANT.RECTANGLE) {
              area = calcArea(getRectPoints(shape as IShape<SHAPE_VARIANT.RECTANGLE>))
            }
            if (area <= minArea) {
              minArea = area
              foundedShape = shape;
              foundedNode = node;
            }
          }
          let zIndex = node.attrs.zIndex ?? node.zIndex()
          node.zIndex(zIndex)
        }
      })
    return {
      foundedNode,
      foundedShape
    }
  }

  const onSelectShape = (evt) => {
    evt.cancelBubble = true;
    const { foundedNode, foundedShape } = findDrillShape()
    if (foundedShape && foundedNode) {
      let zIndex = foundedNode.zIndex()
      foundedNode._setAttr('zIndex', zIndex)
      foundedNode.zIndex(1000)
      setEditingShape(foundedShape);
      setColor(foundedShape.color);
    }
  }

  const handleDBLClickStage = (event: konva.KonvaEventObject<MouseEvent>) => {
    if (props.ondblClickShape) {
      event.cancelBubble = true;
      const { foundedShape } = findDrillShape();
      setEditingShape(undefined);
      if (foundedShape)
        props.ondblClickShape(foundedShape)
    }
  }

  const onClickStage = (e: konva.KonvaEventObject<MouseEvent>) => {
    let clickedOnEmpty = e.target?.attrs?.name === 'root';
    if (editingShape && clickedOnEmpty) {
      setEditingShape(undefined)
    }
    else if (shapeVariant !== SHAPE_VARIANT.NONE) { //is in drawing mode
      const point = getScaledPointerPosition();
      if (point) {
        startPointRef.current = point;
        isDrawingRef.current = true;
      }
    } else {
      onSelectShape(e);
    }
  }

  const onMouseMove = () => {
    if (isDrawingRef.current) {
      const point = getScaledPointerPosition();
      if (point) {
        endPointRef.current = point
        drawShape(true)
      }
    }
  }

  const onMouseUp = () => {
    if (drawingShape && shapeVariant !== SHAPE_VARIANT.POLYGON) {
      props?.onDrawEnd?.({
        shape: drawingShape,
        drawBounds: { width, height },
        ...(imgURI && imgDimension ? { imgDimension } : {})
      })
      cancelDrawing()
    } else if (shapeVariant === SHAPE_VARIANT.POLYGON) {
      drawShape(false)
    }
  }

  const handleSelectColor = (color: ColorType) => {
    if (editingShape) {
      let originShape = shapes.find(sh => sh.id === editingShape.id)
      setEditingShape({ ...editingShape, color })
      originShape && updateShape({ ...originShape, color })
    }
    setColor(color);
  }

  const handleDeleteShape = () => {
    if (editingShape)
      onDeleteShape?.(editingShape, stageRef.current!)
    setEditingShape(undefined)
  }

  const handleEndDrawingPolygon = (polygon: IShape<SHAPE_VARIANT.POLYGON>) => {
    let { points } = polygon.data;
    points.splice(-2, 2); // remove indicator point(moving point )
    if (points.length >= 6) //at least 6 points 
      props?.onDrawEnd?.({
        shape: polygon,
        drawBounds: { width, height },
        ...(imgURI && imgDimension ? { imgDimension } : {})
      })
    cancelDrawing();//@ts-ignore
  }

  const contextValues: ContextType = useMemo(() => (
    {
      dimension: {
        width: width,
        height,
      },
      imgDimension,
      rotateEnabled: rotateEnabled!,
      drawingPadding: drawingPadding!
    }), [width, height, rotateEnabled, imgDimension, drawingPadding])


  return (
    <div className={classes.container} id="shaper-drawer-container" >
      <ShapeContext.Provider value={contextValues} >
        {
          showSegment &&
          <>
            <div className={clsx(classes.toolBox, { [classes.goOut]: goOutBTNs })} >
              <ButtonGroup
                orientation='vertical'
                size='small'
                color='secondary'
                variant='contained'
                hidden={loadingImg || Boolean(editingShape)}
              >
                {SHAPE_LIST.map(item => (
                  validShapes?.includes(item.type) &&
                  <Button
                    key={item.type}
                    onClick={() => handleSelectShapeVariant(item.type)}
                    color={item.type === shapeVariant ? 'info' : 'secondary'}
                    title={item.title}
                  // disabled={shapeVariant !== item.type}
                  >
                    {item.icon}
                  </Button>
                ))}

                {shapeVariant !== SHAPE_VARIANT.NONE &&
                  <Button
                    onClick={cancelDrawing}
                    variant='contained'
                    color={'warning'}
                    title='توقف رسم'
                  >
                    <PanToolOutlinedIcon />
                  </Button>}
              </ButtonGroup>

              <ButtonGroup size='small' variant='contained' orientation='vertical'>
                {onDeleteShape && editingShape &&
                  <Button
                    onClick={handleDeleteShape}
                    size='small'
                    color='error'
                  >
                    <DeleteForeverIcon />
                  </Button>}

                <NormalizePolygonButton
                  editingShape={editingShape}
                  onShapeNormalized={updateShape}
                />
              </ButtonGroup>
            </div>

            <div className={clsx(classes.toolBox, classes.right, { [classes.goOut]: goOutBTNs })} >
              <ButtonGroup orientation='vertical' size='small'
                variant='contained'
                className={classes.colors}
              >
                {COLORS.map(c => (
                  <Button key={c} onClick={() => handleSelectColor(c)} color={color === c ? 'info' : 'secondary'}>
                    <SquareRoundedIcon sx={{ color: c }} />
                  </Button>
                ))}
              </ButtonGroup>
            </div>
          </>
        }
        <Stage
          width={width}
          height={height}
          ref={stageRef}
          onDblClick={handleDBLClickStage}
          onMouseDown={onClickStage}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          name='root'
        >
          <Layer ref={layerRef} >
            {showLayer &&
              <>
                {groupedShapes?.CIRCLE?.map(c => (
                  <DraggableCircle
                    key={c.id}
                    id={c.id}
                    x={c.data.x}
                    y={c.data.y}
                    radius={c.data.radius}
                    stroke={c.color}
                    fill={convertColorNameToHex(c.color, palette)}
                    strokeWidth={8}
                    centeredScaling
                    transformProps={{
                      keepRatio: true,
                      enabledAnchors: [
                        'top-left',
                        'top-right',
                        'bottom-left',
                        'bottom-right',
                      ]
                    }}
                    // onPointerDown={e => onSelectShape(e, c)}
                    onTransformEnd={e => handleTransformEnd(e, c)}
                    onDragEnd={e => handleDragEnd(e, c)}
                    isSelected={c.id === editingShape?.id}

                  />))
                }

                {groupedShapes?.RECTANGLE?.map(rec => (
                  <DraggableRect
                    key={rec.id}
                    id={rec.id}
                    x={rec.data.x}
                    y={rec.data.y}
                    width={rec.data.width}
                    height={rec.data.height}
                    stroke={rec.color}
                    direction={rec?.direction ?? ''}
                    fill={convertColorNameToHex(rec.color, palette)}
                    strokeWidth={8}
                    // onPointerDown={e => onSelectShape(e, rec)}
                    onTransformEnd={e => handleTransformEnd(e, rec)}
                    onDragEnd={e => handleDragEnd(e, rec)}
                    isSelected={rec.id === editingShape?.id}
                  />))
                }

                {
                  showSegment &&
                  groupedShapes?.POLYGON?.map(pol => (
                    <CustomPolygon
                      key={pol.id}
                      polygon={pol}
                      drawingShapeId={drawingShape?.id}
                      isSelected={editingShape?.id === pol.id}
                      onUpdateShape={updateShape}
                      onDrawEnd={handleEndDrawingPolygon}
                      getScaledPointerPosition={getScaledPointerPosition}
                      bbox={bbox}
                      direction={pol?.direction ?? ''}
                    />
                  ))
                }
              </>
            }
          </Layer>
        </Stage>
      </ShapeContext.Provider >
    </div >
  )
}

export const useShapeContext = () => useContext(ShapeContext)
export default ShapeDrawer