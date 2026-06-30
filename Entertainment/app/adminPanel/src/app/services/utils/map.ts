//@ts-ignore
import L from "leaflet"
import _ from "lodash"
//@ts-ignore
export const refreshMapBounds = (map, rawPoints) => {
  let points = _.filter(rawPoints, (point) => {
    return !_.isNaN(parseFloat(point.lat)) && !_.isNaN(parseFloat(point.lng))
  })
  try {
    if (!points || !points.length) {
      map.setView({ lat: 34, lng: 54 }, 4)
    }
    else {
      map.flyToBounds(new L.LatLngBounds(points), {
        duration: 2,
        maxZoom: 10
      })
    }
  }
  catch (e) {
  }
}
