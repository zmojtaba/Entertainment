import {
    CSSProperties,
    PropsWithChildren,
    memo,
    useEffect,
    useRef
} from 'react'
import './index.css'
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

interface PropsType {
    style?: CSSProperties,
    onViewChange?(isModal: boolean): void;
    disabled?: boolean
}

export default memo(function LargeView(props: PropsWithChildren<PropsType>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { children, disabled, onViewChange } = props;
    const draggableRef = useRef<Draggable>()


    useEffect(() => {
        if (containerRef.current) {
            let dropAreaEl = containerRef.current;
            let dragEl = dropAreaEl.children[0] as HTMLElement;
            let handlerEl = dropAreaEl.querySelector('.large-view-drag-handler');

            if (!draggableRef.current && handlerEl)
                draggableRef.current = Draggable.create(handlerEl, {
                    type: "x,y",
                    minimumMovement: 20,
                    onDrag() {
                        if (Draggable.hitTest(dropAreaEl, dragEl, '60%'))
                            dropAreaEl.classList.add('drop-over')
                        else
                            dropAreaEl.classList.remove('drop-over')
                        gsap.set(dragEl, {
                            x: this.x,
                            y: this.y
                        });
                        gsap.set(handlerEl, {
                            x: this.startX,
                            y: this.startY
                        })
                    },
                    onPressInit() {
                        dragEl?.classList.add('start-drag');
                    },
                    onRelease() {
                        dragEl?.classList.remove('start-drag')
                    },
                    onDragEnd() {
                        const isModal = dragEl.classList.contains('modal');
                        if (!isModal) {
                            if (!Draggable.hitTest(dropAreaEl, dragEl, '60%')) {
                                dragEl.classList.add('modal');
                                onViewChange?.(true)
                            }
                            gsap.to([dragEl, handlerEl], {
                                x: 0,
                                y: 0,
                                duration: .2
                            })

                        } else {
                            if (Draggable.hitTest(dropAreaEl, dragEl, '60%')) {
                                dragEl.classList.remove('modal');
                                onViewChange?.(false)
                            }
                            gsap.to([dragEl, handlerEl], {
                                x: 0,
                                y: 0,
                                duration: .5
                            })
                        }
                        dragEl.classList.remove('start-drag');
                        dropAreaEl.classList.remove('drop-over')
                    }
                })[0]

            if (disabled) {
                handlerEl?.classList.add('disabled');
                draggableRef.current?.disable()
            }
            else {
                draggableRef.current?.enable()
                handlerEl?.classList.remove('disabled');
            }
        }

    }, [disabled])


    return (
        <div
            ref={containerRef}
            className='large-view-container'
            style={{
                width: '100%',
                height: '100%',
                ...props.style
            }}
        >
            {children}
        </div>
    )
})


export const isInsideElement = (element: HTMLElement, point: { x: number, y: number }) => {
    const rect = element.getBoundingClientRect();
    const { x, y } = point
    return rect.x <= x && x <= rect.x + rect.width &&
        rect.y <= y && y <= rect.y + rect.height;
}
