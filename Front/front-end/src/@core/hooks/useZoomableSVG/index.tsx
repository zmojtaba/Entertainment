import { useState, useEffect, MutableRefObject, useMemo } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import * as d3 from 'd3';
export { default as ZoomControllers } from './ZoomControllers'

type ZoomIn = (K?: number) => void;
type ZoomOut = (K?: number) => void;
type ResetZoom = () => void;
type ZoomSVGApi = {
    zoomIn: ZoomIn,
    zoomOut: ZoomOut,
    resetZoom: ResetZoom
};
export type D3Event<T extends Event, E extends Element> = T & { currentTarget: E }
type SvgInstanceType = MutableRefObject<SVGSVGElement | null> | SVGSVGElement | null

export default function useZoomableSVG(svgInstance: SvgInstanceType, scale: [number, number] = [-1, 7], resetZoomDuration = 800): ZoomSVGApi {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const svgElement = svgInstance instanceof SVGElement ? svgInstance : svgInstance !== null ? svgInstance.current : null
    const zoom = useMemo(() => d3.zoom<SVGSVGElement, unknown>().scaleExtent(scale), [dimensions, scale])

    useEffect(() => {
        if (svgElement) {
            const resizeObserver = new ResizeObserver(entries => {
                entries.forEach(entry => {
                    setDimensions(entry.contentRect);
                });
            });
            resizeObserver.observe(svgElement);
            return () => resizeObserver.unobserve(svgElement);
        }
    }, [svgElement]);


    const zoomIn: ZoomIn = (k = 2) => {
        svgElement && d3.select(svgElement)
            .transition()
            .call(zoom.scaleBy, k);
    }

    const zoomOut: ZoomOut = (k = .5) => {
        svgElement && d3.select(svgElement)
            .transition()
            .call(zoom.scaleBy, k)
    }

    const resetZoom: ResetZoom = () => {
        svgElement && d3.select(svgElement)
            .transition()
            .duration(resetZoomDuration)
            .call(zoom.transform, d3.zoomIdentity)
    }

    useEffect(() => {
        if (!svgElement)
            return
        const svg = d3.select(svgElement);
        const g = svg.select("g#container");
        //add listeners to zoom control buttons
        d3.select("#svg-zoomIn").on("click", () => zoomIn())
        d3.select("#svg-zoomOut").on("click", () => zoomOut())
        d3.select("#svg-resetZoom").on("click", resetZoom)

        function onZoom(e: d3.D3ZoomEvent<SVGSVGElement, unknown>) {
            g.attr('transform', e.transform.toString())
        }
        zoom.on("zoom", onZoom);
        svg.call(zoom)

    }, [dimensions, zoom, svgElement])

    return { zoomIn, zoomOut, resetZoom };
};
