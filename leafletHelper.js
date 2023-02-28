const leafletHelper = {
    /**
     * options:{
     * mapId:string,
     * latLng:[lat:number,lon:number],
     * onClickFunc:()=>{},
     * onMouseMove:()=>{},
     * zoom:int,
     * maxZoom:int
     * }
     * */
    map: {
        maps: {},
        init: (options) => {
            if (!options.zoom) {
                options.zoom = 13;
            }
            if (!options.maxZoom) {
                options.maxZoom = 18;
            }

            var mapEl = L.map(options.mapId).setView(options.latLng, options.zoom);
            mapEl.mapId = options.mapId;

            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
                maxZoom: options.maxZoom,
                attribution: '',
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1
            }).addTo(mapEl);

            if (options.onClick)
                mapEl.on('click', options.onClick);

            if (options.onMouseMove)
                mapEl.on('mousemove', options.onMouseMove);

            leafletHelper.map.maps[options.mapId] = mapEl;
            return mapEl;
        },
        setCenter: (options) => {
            setTimeout(() => { options.map.panTo(options.latLng); }, 1);
        }
    },
    popup: {
        add: (options) => {
            if (!options.map.popups)
                options.map.popups = {};

            var popup = L.popup()
                .setLatLng([options.lat, options.lng])
                .setContent(options.content)
                .openOn(options.map);

            options.map.popups[options.id] = popup;
            return popup;
        }
    },
    marker: {
        /**
         * options:{
         * map:object,
         * id:string,
         * latLng:[lat:number,lon:number],
         * popUpHtml:string
         * 
         * 
         * }
         * */
        add: (options) => {
            if (!options.map.markers)
                options.map.markers = {};

            if (options.map.markers[options.id])
                throw new Error(`Marker Id:${options.id} is already exist!`);

            if (!options.markerOptions)
                options.markerOptions = {};

            var marker = L.marker(options.latLng, options.markerOptions).addTo(options.map);
            marker.markerClass = options.markerClass;

            if (options.popUpHtml)
                marker.bindPopup(options.popUpHtml).openPopup();

            if (options.tooltip !== null) {
                var opacity = options.tooltip.opacity ? options.tooltip.opacity : 1;
                var sticky = options.tooltip.sticky ? options.tooltip.sticky : true;
                var permanent = options.tooltip.permanent ? options.tooltip.permanent : true;
                marker.bindTooltip(options.tooltip.html, { permanent: permanent, sticky: sticky, opacity: opacity });
            }

            if (options.onClick)
                marker.on('click', options.onClick);

            if (options.onDrag)
                marker.on('drag', options.onDrag);

            if (options.onDragEnd)
                marker.on('dragend', options.onDragEnd);

            if (options.onMouseover)
                marker.on('mouseover', options.onMouseover);

            options.map.markers[options.id] = marker;
            return marker;
        },
        /**
         * options:{
         * map:object,
         * id:string
         * }
         * */
        delete: (map, id) => {
            var marker = map.markers[id];
            if (!marker)
                throw new Error(`Marker Id:${id} is not found!`);

            map.removeLayer(marker);
            delete map.markers[id];
        },
        tooltipVisible: (mapId, visible) => {
            document.querySelectorAll("#" + mapId + ">.leaflet-pane.leaflet-map-pane>.leaflet-pane.leaflet-tooltip-pane>.leaflet-tooltip").forEach(tooltip => {
                tooltip.style.display = visible ? "block" : "none";
            })
        }
    },
    circle: {
        add: (options) => {
            if (!options.map.circlies)
                options.map.circlies = {};

            if (options.map.circlies[options.id])
                throw new Error(`Marker Id:${options.id} is already exist!`);

            if (!options.circleOptions)
                options.circleOptions = {};

            if (!options.circleOptions.color)
                options.circleOptions.color = "red";

            if (!options.circleOptions.fillColor)
                options.circleOptions.fillColor = "#f03";

            if (!options.circleOptions.opacity)
                options.circleOptions.opacity = 0.75;


            var circle = L.circle(options.latLng, options.circleOptions).addTo(options.map);

            if (options.popUp)
                circle.bindPopup(options.popUp).openPopup();


            options.map.circlies[options.id] = circle;
            return circle;
        },
        delete: (map, id) => {
            var circle = map.circlies[id];
            if (!circle)
                throw new Error(`Circle Id:${id} is not found!`);

            map.removeLayer(circle);
            delete map.circlies[id];
        }
    },
    polygon: {
        add: (options) => {
            if (!options.map.polygons)
                options.map.polygons = {};

            if (options.map.polygons[options.id])
                throw new Error(`Polygon Id:${options.id} is already exist!`);

            if (!options.polygonOptions)
                options.polygonOptions = {};

            if (!options.polygonOptions.color)
                options.polygonOptions.color = "red";

            var polygon = L.polygon(options.coordinates, options.polygonOptions).addTo(options.map);

            if (options.popUp)
                polygon.bindPopup(options.popUp).openPopup();

            options.map.polygons[options.id] = polygon;
            return polygon;
        },
        delete: (map, id) => {
            var polygon = map.polygons[id];
            if (!polygon)
                throw new Error(`Polygon Id:${id} is not found!`);

            map.removeLayer(polygon);
            delete map.polygons[id];
        }
    },
    polyline: {
        add: (options) => {
            if (!options.map.polylines)
                options.map.polylines = {};

            if (!options.map.polylineDecorators)
                options.map.polylineDecorators = {};

            if (options.map.polylines[options.id])
                throw new Error(`Polyline Id:${options.id} is already exist!`);

            if (!options.polylineOptions)
                options.polylineOptions = {};

            if (!options.polylineOptions.colorLine)
                options.polylineOptions.colorLine = "black";

            if (!options.polylineOptions.arrowColor)
                options.polylineOptions.arrowColor = "red";

            var polylineDecorator = L.polylineDecorator(options.coordinates, {
                patterns: [
                    {
                        offset: '25%',
                        offset: '5%',
                        repeat: 50,
                        symbol: L.Symbol.arrowHead({
                            pixelSize: 10,
                            polygon: false,
                            pathOptions: {
                                stroke: true,
                                color: options.polylineOptions.arrowColor,
                                fillOpacity: 1,
                                weight: 2
                            }
                        })
                    }
                ]
            }).addTo(options.map);
            options.map.polylineDecorators[options.id] = polylineDecorator;

            var polyline = L.polyline(options.coordinates).addTo(options.map);
            polyline.setStyle({
                color: options.polylineOptions.colorLine
            });
            options.map.polylines[options.id] = polyline;
            
            return polyline;
        },
        delete: (map, id) => {
            var polyline = map.polylines[id];
            if (!polyline)
                throw new Error(`Polyline Id:${id} is not found!`);

            map.removeLayer(polyline);
            delete map.polylines[id];

            var polylineDecorator = map.polylineDecorators[id];
            if (!polylineDecorator)
                throw new Error(`PolylineDecorator Id:${id} is not found!`);

            map.removeLayer(polylineDecorator);
            delete map.polylineDecorators[id];
        }
    }
}