import { useState } from 'react'
import { Button, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import * as turf from 'turf';
import _ from 'lodash';
import { IShape, SHAPE_VARIANT } from '../constants/types'
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';

interface PropsType {
    editingShape: IShape | undefined;
    onShapeNormalized: (nShape: IShape) => void;
}

export default function NormalizePolygonButton(props: PropsType) {
    const { editingShape } = props;
    const [processing, setProcessing] = useState(false);
    const isPolygon = editingShape && editingShape.data.type === SHAPE_VARIANT.POLYGON

    const handleNormalizePolygon = async () => {
        if (!processing && editingShape && editingShape.data.type === SHAPE_VARIANT.POLYGON) {
            let points: GeoJSON.Feature<GeoJSON.Point>[] = [];
            setProcessing(true);
            _.chunk(editingShape.data.points, 2).forEach(p => {
                points.push(turf.point([p[0], p[1]]))
            })
            const hall = turf.convex(turf.featureCollection(points))
            let normPoints = _.flatten(hall.geometry.coordinates?.[0]);
            await window.wait(1000);
            if (normPoints.length) {
                let normShape = {
                    ...editingShape,
                    data: {
                        ...editingShape.data,
                        points: normPoints,
                    }
                }
                if (!_.isEqual(normShape, editingShape))
                    props.onShapeNormalized(normShape)
            } else {
                toast.warning('خطا در نرمالسازی شکل')
            }
            setProcessing(false);
        }
    }

    return (
        isPolygon ?
            <Button
                onClick={handleNormalizePolygon}
                sx={{ bgcolor: t => t.palette.success.light }}
                title='نرمالسازی شکل'
            >
                {processing ? <CircularProgress size={22} /> : <AutoFixNormalIcon />}
            </Button>
            :
            null
    )
}
