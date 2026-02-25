import { MutableRefObject } from "react";
import { CanvasInstanceType, Circle, OnEndDrawingCallBackType, Point, Rectangle, SHAPE_VARIANT } from "./types";
import $ from 'jquery'

export function convertPointToViewPortScale() {
}
 
type PaintSettings = {
    strokeWidth: number;
    strokeColor: string;
    fillColor: string;
}

export const ShapeDrawer = class {
    canvasEl: HTMLCanvasElement;
    #context: CanvasRenderingContext2D;
    #startPoint: Point
    #endPoint: Point;
    #shape: SHAPE_VARIANT;
    isPainting: boolean;
    autoSizer: boolean;
    onEndDrawing: OnEndDrawingCallBackType //TODO: remove "any" type;
    paintSettings: PaintSettings;

    constructor(CanvasInstance: CanvasInstanceType) {
        this.canvasEl = CanvasInstance instanceof HTMLCanvasElement ? CanvasInstance : CanvasInstance.current;
        this.#context = this.canvasEl.getContext('2d')!;
        this.autoSizer = false;
        this.#startPoint = [0, 0];
        this.#endPoint = [0, 0];
        this.isPainting = false;
        // this.startListener();
        this.#shape = SHAPE_VARIANT.NONE;
        this.onEndDrawing = () => { };
        this.paintSettings = {
            strokeColor: 'blue',
            strokeWidth: 4,
            fillColor: 'transparent'
        }
    }

    getMousePos(evt) {
        let rect = this.canvasEl.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };

    startListener() {
        console.log(this.canvasEl)
        $(this.canvasEl).on('mousedown', e => {
            this.#startPoint = this.#endPoint = [e.offsetX, e.offsetY];
            this.isPainting = true;
            this.redraw();
            console.log('startPoint', {
                startPoint: this.#startPoint,
                width: this.canvasEl.width,
                height: this.canvasEl.height
            })

        });
        $(this.canvasEl).on('mousemove', e => {
            if (this.isPainting) {
                // console.log('mousemove');
                this.#endPoint = [e.offsetX, e.offsetY];
                this.redraw()
            }
        });
        $(this.canvasEl).on('mouseout', e => {
            if (this.isPainting) {
                this.isPainting = false;
                //this.#shape = SHAPE_VARIANT.NONE;
                this.redraw()
            }

        });
        $(this.canvasEl).on('mouseup', e => {
            if (this.isPainting) {
                this.isPainting = false;
                //  this.#shape = SHAPE_VARIANT.NONE;
                this.redraw()
            }
        });
    }



    enableAutoSizer() {
        this.autoSizer = true;
        const canvasEl = this.canvasEl;
        const setWidthAndHeight = () => {
            let { width, height } = this.canvasEl.getBoundingClientRect();
            canvasEl.width = width;
            canvasEl.height = height;
           // this.#context.scale(scale.x, scale.y);
        }
        setWidthAndHeight()
        window.addEventListener('resize', () => {
            setWidthAndHeight()
            console.log(this.#context.strokeStyle)
            this.redraw();
        }, true)
    }

    private redraw() {
        switch (this.#shape) {
            case SHAPE_VARIANT.CIRCLE:
                this.drawCircle();
                break;
            case SHAPE_VARIANT.RECTANGLE:
                this.drawRectangle();
                break;
            case SHAPE_VARIANT.PATH:
                this.drawPath();
                break;
        }
    }

    setPaintSettings(options: PaintSettings) {
        this.#context.fillStyle = options.fillColor;
        this.#context.strokeStyle = options.strokeColor
        this.#context.lineWidth = options.strokeWidth;
        this.paintSettings = options
    }

    /*----------------------CIRCLE--------------------------*/
    private drawCircle() {
        this.setPaintSettings(this.paintSettings)
        this.clear()
        let ctx = this.#context;
        ctx.beginPath();
        let startX = this.#startPoint[0],
            startY = this.#startPoint[1],
            endX = this.#endPoint[0],
            endY = this.#endPoint[1];

        let dx = endX - startX,
            dy = endY - startY,
            radius = Math.sqrt(dx * dx + dy * dy);

        let circle: Circle = {
            center: [startX, startY],
            radius,
            drawBounds: {
                width: this.canvasEl.offsetWidth,
                height: this.canvasEl.offsetHeight,
            }
        }
        ctx.arc(circle.center[0], circle.center[1], circle.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        if (!this.isPainting) {
            this.onEndDrawing(circle)
            // ctx.closePath();
            this.turnOffListeners();
        }
    }
    startCircle(options?: PaintSettings) {
        this.#shape = SHAPE_VARIANT.CIRCLE;
        this.startListener();
        options && this.setPaintSettings(options);

        return new Promise<Circle>((resolve) => {
            this.onEndDrawing = resolve;
        })
    }

    /*----------------------RECTANGLE--------------------------*/
    private drawRectangle() {

    }
    startRectangle(callback: OnEndDrawingCallBackType<Rectangle>) {
        this.onEndDrawing = callback;
        this.#shape = SHAPE_VARIANT.RECTANGLE;
        this.startListener()
    }


    /*----------------------PATH--------------------------*/
    private drawPath() {

    }
    startPath(callback: OnEndDrawingCallBackType) {
        this.onEndDrawing = callback;
        this.#shape = SHAPE_VARIANT.PATH;
        this.startListener()
    }



    clear() { //clear the whole canvas
        let { width, height } = this.canvasEl.getBoundingClientRect();

        this.#context.clearRect(0, 0, width, height);
    };

    private turnOffListeners() {
        //  this.canvasEl.replaceWith(this.canvasEl.cloneNode(true));
        $(this.canvasEl).off()
    }

    destroy() { //clear canvas and remove all event listeners ;
        this.clear();
        this.turnOffListeners()
    }

    get getContext() {
        return this.#context
    }
}
