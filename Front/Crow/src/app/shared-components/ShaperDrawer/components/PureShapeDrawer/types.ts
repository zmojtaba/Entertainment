import { MutableRefObject } from "react";

export type CanvasInstanceType = MutableRefObject<HTMLCanvasElement> | HTMLCanvasElement
export type Point = [number, number];
export enum SHAPE_VARIANT {
    CIRCLE,
    RECTANGLE,
    PATH,
    NONE,
};
export type Circle = {
    center: Point;
    radius: number;
    drawBounds: {
        width: number;
        height: number;
    }
}
export type Rectangle = {
    start_point: Point;
    width: number;
    height: number;
    drawBounds: {
        width: number;
        height: number;
    }
}
export type Shape = Circle | Rectangle

export type OnEndDrawingCallBackType<shp extends Shape = any> = (shape: shp) => void