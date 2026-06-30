import Konva from 'konva'
import { Bbox, Dimension, ICircle, IPolygon, IRect, IShape, Point, SHAPE_VARIANT } from "./types";
import konva from 'konva';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import Crop54Icon from '@mui/icons-material/Crop54';
import PolylineOutlinedIcon from '@mui/icons-material/PolylineOutlined';
import _ from 'lodash'
import { Palette } from "@mui/material";
import { alpha } from "@mui/system";
export * from './withDraggable'

export let initPoint = {
    x: 0,
    y: 0
}

export const COLORS = ['red', 'green', 'yellow'] as const;

export const SHAPE_LIST = [
    {
        type: SHAPE_VARIANT.CIRCLE,
        icon: <PanoramaFishEyeIcon />,
        title: 'دایره',
    },
    {
        type: SHAPE_VARIANT.RECTANGLE,
        icon: <Crop54Icon />,
        title: 'مستطیل'
    },
    {
        type: SHAPE_VARIANT.POLYGON,
        icon: <PolylineOutlinedIcon />,
        title: 'چند ضلعی'
    }
];

export const createCircle = (data: { start: Point, end: Point }): ICircle => {
    const { start, end } = data;
    let a = Math.abs(end.x - start.x),
        b = Math.abs(end.y - start.y),
        hypotenuse = Math.sqrt(a * a + b * b);

    return {
        type: SHAPE_VARIANT.CIRCLE,
        ...start,
        radius: hypotenuse
    }
}

export const createRect = (data: { start: Point, end: Point }): IRect => {
    const { start, end } = data
    let w = end.x - start.x,
        h = end.y - start.y,
        offsetX = (w < 0) ? w : 0,
        offsetY = (h < 0) ? h : 0,
        width = Math.abs(w),
        height = Math.abs(h),
        x = start.x + offsetX,
        y = start.y + offsetY;

    return {
        type: SHAPE_VARIANT.RECTANGLE,
        x,
        y,
        width,
        height,
    }
}

export const drawPolygon = (data: { points: number[], point: Point, moving: boolean }): IPolygon => {
    const { point, moving, points } = data;
    if (moving) {
        points.length > 3 ?
            points.splice(-2, 2, point.x, point.y)
            :
            points.splice(2, 0, point.x, point.y)
    } else
        points.push(point.x, point.y);

    return {
        points,
        type: SHAPE_VARIANT.POLYGON
    }
}

export const getBtnVariant = (activeShape: SHAPE_VARIANT, shape: SHAPE_VARIANT) => {
    return activeShape !== shape ? 'contained' : 'outlined'
}

export const convertPointDimension = (point: Point, from: Dimension, to: Dimension) => {
    let x = (point.x * to.width) / from.width;
    let y = (point.y * to.height) / from.height;
    return { x, y }
}

export const tweenDelete = (params: { stage: konva.Stage, id: string }) => {
    const { stage, id } = params
    return new Promise((resolve, reject) => {
        const node = stage.find(`#${id}`)[0];
        if (node) {
            new Konva.Tween({
                node,
                duration: 1,
                scaleX: 0,
                scaleY: 0,
                onFinish: resolve,
                easing: Konva.Easings.EaseIn,
            }).play();
        } else reject('can not find node')
    })
}

export const convertColorNameToHex = (name: string, palette: Palette) => {
    let hex = ''
    switch (name) {
        case 'red':
            hex = palette.error.light;
            break;
        case 'yellow':
            hex = palette.warning.light;
            break;
        case 'green':
            hex = palette.success.light;
            break;
        default:
            hex = palette.divider;
    }
    return alpha(hex, .08)
}

export const getRectPoints = (rec: IShape<SHAPE_VARIANT.RECTANGLE>) => {
    let { width, height, x, y } = rec.data;
    let p1 = [x, y],
        p2 = [x + width, y],
        p3 = [x + width, y + height],
        p4 = [x, y + height];
    return [p1, p2, p3, p4];
}

export const isPointInBbox = (rect: Bbox, point: Point, bbox_padding = 10) => {
    const _point = { ...point }
    const minX = rect.x + bbox_padding,
        maxX = rect.x + rect.width - bbox_padding,
        minY = rect.y + bbox_padding,
        maxY = rect.y + rect.height - bbox_padding;

    const inside =
        point.x >= minX &&
        point.x <= maxX &&
        point.y <= maxY &&
        point.y >= minY;

    _point.x = point.x < minX ? minX : point.x > maxX ? maxX : point.x;
    _point.y = point.y < minX ? minY : point.y > maxY ? maxY : point.y;

    return {
        fixedPoint: [_point.x, _point.y],
        inside
    }
}

export const constrictPointsInBbox = (points: number[], bbox: Bbox, bbox_padding = 10) => {
    return _(points).chunk(2).flatMap((point) => isPointInBbox(bbox, { x: point[0], y: point[1] }, bbox_padding).fixedPoint).value();
}

export function calcArea(polygon: Array<Array<number>>) {
    let total = 0;
    for (let i = 0; i < polygon.length; i++) {
        const addX = polygon[i][0];
        const addY = polygon[i === polygon.length - 1 ? 0 : i + 1][1];
        const subX = polygon[i === polygon.length - 1 ? 0 : i + 1][0];
        const subY = polygon[i][1];
        total += (addX * addY * 0.5) - (subX * subY * 0.5);
    }

    return Math.abs(total);
}

export const getCenterCoords = (points: number[][]) => {
    const x = points.reduce((sum, point) => sum += point[0], 0) / points.length;
    const y = points.reduce((sum, point) => sum += point[1], 0) / points.length;
    
    return { x, y };
}
