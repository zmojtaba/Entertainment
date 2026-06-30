import konva from 'konva';

export interface Dimension {
    width: number;
    height: number;
}

export type Point = {
    x: number,
    y: number
};

export enum SHAPE_VARIANT {
    CIRCLE = 'CIRCLE',
    RECTANGLE = 'RECTANGLE',
    POLYGON = 'POLYGON',
    PATH = 'PATH',
    NONE = 'NONE',
};
export type ColorType = 'red' | 'green' | 'yellow'

export interface ICircle {
    x: number;
    y: number;
    radius: number;
    type: SHAPE_VARIANT.CIRCLE
}

export interface IRect {
    x: number;
    y: number;
    width: number;
    height: number;
    type: SHAPE_VARIANT.RECTANGLE
}

export type Bbox = Omit<IRect, 'type'>;

export interface IPolygon {
    points: number[]
    type: SHAPE_VARIANT.POLYGON
}

export type DirectionType = 'top' | 'bottom' | 'left' | 'right'

export type ShapesData<variant extends SHAPE_VARIANT = SHAPE_VARIANT> = (
    variant extends SHAPE_VARIANT.RECTANGLE ? IRect :
    variant extends SHAPE_VARIANT.CIRCLE ? ICircle :
    variant extends SHAPE_VARIANT.POLYGON ? IPolygon : IPolygon
);

export interface IShape<variant extends SHAPE_VARIANT = SHAPE_VARIANT> {
    id: string;
    type: variant;
    color: ColorType;
    data: ShapesData<variant>,
    direction?: DirectionType
}

export type ShapeChangeEvent = {
    shape: IShape,
    drawBounds: Dimension;
    imgDimension?: Dimension;
}

export type OnUpdateShapeCallback = (event: ShapeChangeEvent) => void;
export type OnDeleteShapeCallback = (shape: IShape, stage: konva.Stage) => void;

export type GroupedShapes = {
    [SHAPE_VARIANT.CIRCLE]: IShape<SHAPE_VARIANT.CIRCLE>[];
    [SHAPE_VARIANT.RECTANGLE]: IShape<SHAPE_VARIANT.RECTANGLE>[];
    [SHAPE_VARIANT.POLYGON]: IShape<SHAPE_VARIANT.POLYGON>[];
}

export interface ContextType {
    dimension: Dimension;
    rotateEnabled: boolean;
    imgDimension: Dimension | undefined;
    drawingPadding: number
}
