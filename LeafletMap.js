/**current maps */
var maps = [];
var markers = [];
var circles = [];
var polygons = [];
var polylines = [];
var polylineDecorators = [];
var popups = [];
var defaultLat = 39.925163;
var defaultLng = 32.836989;

//#region general map options
/**
 * Set map by id
 * @param {any} mapId
 * @param {any} latLng
 * @param {any} onClickFunc
 * @param {any} zoom
 * @param {any} maxZoom
 */
function mapSet(mapId, latLng = [lat = 39.925162, lon = 32.836989], onClickFunc = null, zoom = 13, maxZoom = 18) {
    var mapEl = L.map(mapId).setView(latLng, zoom);
    mapEl.mapId = mapId;

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: maxZoom,
        attribution: '',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(mapEl);

    if (onClickFunc !== null) {
        mapEl.on('click', function (e) {
            onClickFunc(e);
        });
    }

    maps.push(mapEl);

    return mapEl;
}

/**
 * Set selected map center.
 * @param {any} map
 * @param {any} lat
 * @param {any} lng
 */
function mapSetCenter(map, lat = defaultLat, lng = defaultLng, zoom = null) {
    if (zoom != null)
        map.panTo(new L.LatLng(lat, lng), zoom);
    else
        map.panTo(new L.LatLng(lat, lng));
}

/**
 * adds popup on selected map
 * @param {any} map
 * @param {any} popupId
 * @param {any} content
 * @param {any} lat
 * @param {any} lon
 */
function mapPopupAdd(map, popupId, content, lat = 39.925162, lon = 32.836989) {
    var popup = L.popup()
        .setLatLng([lat, lon])
        .setContent(content)
        .openOn(map);

    popup.id = popupId;
    popups.push(popup);
}
//#endregion

//#region marker options
/**
 * adds marker to the selected map
 * @param {any} map
 * @param {any} markerId
 * @param {any} latLng
 * @param {any} popUpHtml
 * @param {any} iconUrl
 * @param {any} tooltipHtml
 * @param {any} onClickFunc
 * @param {any} isDragMarker
 * @param {any} onDragFunc
 * @param {any} onDragEndFunc
 */
function mapMarkerAdd(map, markerId, latLng = [lat = 39.925162, lon = 32.836989], popUpHtml = null, iconUrl = null, tooltipHtml = null, onClickFunc = null, isDragMarker = false, onDragFunc = null, onDragEndFunc = null) {
    var options = {};

    var customIcon = null;
    if (iconUrl !== null) {
        customIcon = L.icon({
            iconUrl: iconUrl,
            popupAnchor: [12, 5]
        });

        options.icon = customIcon;
    }

    options.draggable = isDragMarker;

    var marker = L.marker(latLng, options).addTo(map);

    if (tooltipHtml !== null) {
        marker.bindTooltip(tooltipHtml, { permanent: true, sticky: true, opacity: 1 });
    }

    if (popUpHtml !== null)
        marker.bindPopup(popUpHtml).openPopup();

    if (onClickFunc !== null) {
        marker.on('click', onClickFunc);
    }


    if (onDragFunc !== null) {
        marker.on('drag', onDragFunc);
    }

    if (onDragEndFunc !== null)
        marker.on('dragend', onDragFunc);

    marker.on('mouseover', function (ev) {
        //ev.target.openPopup();
    });

    marker.id = markerId;
    marker.mapId = map.mapId;
    markers.push(marker);

    return marker;
}

/**
 * Deletes the marker given its markerId.
 * @param {any} map t
 * @param {any} markerId t
 */
function mapMarkerRemove(map, markerId = null) {
    if (map === null || map === undefined) {
        alert('The "map" parameter cannot be null.');
        return;
    }
    var targets = null;
    if (markerId === null || markerId === undefined) {
        targets = markers.filter(p => p.mapId === map.mapId);
    } else {
        targets = markers.filter(p => p.mapId === map.mapId && p.id === markerId);
    }

    for (var i = 0; i < targets.length; i++) {
        map.removeLayer(targets[i]);
        markers.pop(targets[i]);
    }
}

/**
 * Hide or show tooltip/tooltips
 * @param {any} mapId
 */
function mapMarkerTooltipToggle(mapId) {
    $("#" + mapId + ">.leaflet-pane.leaflet-map-pane>.leaflet-pane.leaflet-tooltip-pane>.leaflet-tooltip").toggleClass("hide");
}
//#endregion

//#region circle options
function mapCircleAdd(map, circleId, latLng = [lat = 39.925162, lon = 32.836989], popUp = null, borderColor = "red", color = "f03", radius = 500, opacity = 0.75) {
    var options = {
        color: borderColor,
        fillColor: color,
        fillOpacity: opacity,
        radius: radius,
        draggable: true
    };

    var circle = L.circle(latLng, options).addTo(map);

    if (popUp !== null)
        circle.bindPopup(popUp).openPopup();

    circle.id = circleId;
    circle.mapId = map.mapId;
    circles.push(circle);
}

/**
 * Deletes the circle given its circleId.
 * @param {any} map t
 * @param {any} circleId t
 */
function mapCircleRemove(map, circleId = null) {
    if (map === null || map === undefined) {
        alert('The "map" parameter cannot be null.');
        return;
    }
    var targets = null;
    if (circleId === null || circleId === undefined) {
        targets = circles.filter(p => p.mapId === map.mapId);
    } else {
        targets = circles.filter(p => p.mapId === map.mapId && p.id === circleId);
    }

    for (var i = 0; i < targets.length; i++) {
        map.removeLayer(targets[i]);
        circles.pop(targets[i]);
    }
}
//#endregion

//#region polygon options
function mapPolygonAdd(map, polygonId, popUp, coordinates = [[39.925162, 32.836989], [39.925222, 32.836022], [39.923162, 32.836908]], color = 'blue') {
    var options = {
        color: color
    };
    var polygon = L.polygon(coordinates, options).addTo(map);
    polygon.id = polygonId;
    polygon.mapId = map.mapId;

    if (popUp !== null)
        polygon.bindPopup(popUp).openPopup();

    polygons.push(polygon);
}

function mapPolygonRemove(map, polygonId = null) {
    var targets = null;

    if (polygonId !== null && polygonId !== undefined)
        targets = polygons.filter(p => p.mapId === map.mapId && p.id === polygonId);
    else
        targets = polygons.filter(p => p.mapId === map.mapId);

    for (var i = 0; i < targets.length; i++) {
        map.removeLayer(targets[i]);
        polygons.pop(targets[i]);
    }
}
//#endregion

//#region polyline options
/**
 * adds polylines on selected map
 * @param {any} map
 * @param {any} polylineId
 * @param {any} coordinates
 * @param {any} colorLine
 */
function mapPolylineAdd(map, polylineId, coordinates = [[40.029178, 32.998415], [40.022148, 32.981515], [40.021551, 32.916359]], colorLine = 'black', arrowColor = 'red') {
    mapSetCenter(map, coordinates[0][0], coordinates[0][1]);
    //Arrows
    var polylineDecorator = L.polylineDecorator(coordinates, {
        patterns: [
            {
                offset: '25%',//noktanın oluşacağı yeri verir.
                offset: '5%',
                repeat: 50,
                symbol: L.Symbol.arrowHead({
                    pixelSize: 10,
                    polygon: false,
                    pathOptions: {
                        stroke: true,
                        color: arrowColor,
                        fillOpacity: 1,
                        weight: 2
                    }
                })
            }
        ]
    }).addTo(map);
    polylineDecorator.id = polylineId;
    polylineDecorator.mapId = map.mapId;
    polylineDecorators.push(polylineDecorator);

    //Polyline
    var polyline = L.polyline(coordinates).addTo(map);
    polyline.setStyle({
        color: colorLine
    });
    polyline.id = polylineId;
    polyline.mapId = map.mapId;

    polylines.push(polyline);
}

/**
 * deletes polyline/polylines on selected map
 * @param {any} map
 * @param {any} polylineId
 */
function mapPolylineRemove(map, polylineId = null) {
    var targets = null;
    var targetDecorators = null;

    if (polylineId !== null && polylineId !== undefined) {
        targets = polylines.filter(p => p.mapId === map.mapId && p.id === polylineId);
        targetDecorators = polylineDecorators.filter(p => p.mapId === map.mapId && p.id === polylineId);
    }
    else {
        targets = polylines.filter(p => p.mapId === map.mapId);
        targetDecorators = polylineDecorators.filter(p => p.mapId === map.mapId);
    }

    for (var i = 0; i < targets.length; i++) {
        //remove polylines
        map.removeLayer(targets[i]);
        polylines.pop(targets[i]);
        //remove arrows
        map.removeLayer(targetDecorators[i]);
        polylineDecorators.pop(targetDecorators[i]);
    }
}
//#endregion