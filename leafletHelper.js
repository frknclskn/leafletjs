const leafletHelper = {
    maps: {}
    ,
    /**
     * options:{
     * mapId:string,
     * latLng:[lat:number,lon:number],
     * onClickFunc:()=>{},
     * zoom:int,
     * maxZoom:int
     * }
     * */
    mapSet: (options) => {
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

        if (options.onClickFunc !== null) {
            mapEl.on('click', function (e) {
                options.onClickFunc(e);
            });
        }

        leafletHelper.maps[options.mapId] = mapEl;
        return mapEl;
    },
    mapSetCenter: (map, lat = defaultLat, lng = defaultLng, zoom = null) => {
        if (zoom != null)
            map.panTo(new L.LatLng(lat, lng), zoom);
        else
            map.panTo(new L.LatLng(lat, lng));
    },
    marker: {
        /**
         * options:{
         * map:object,
         * markerId:string,
         * latLng:[lat:number,lon:number]
         * 
         * 
         * }
         * */
        add: (options) => {
            var marker = L.marker(options.latLng, null).addTo(options.map);
            marker.id = options.markerId;
            marker.markerClass = options.markerClass;

            if (!options.map.markers) {
                options.map.markers = {};
            }

            if (options.map.markers[options.markerId]) {
                throw new Error(`Marker Id:${options.markerId} is already exist!`);
            }

            options.map.markers[options.markerId] = marker;

            return marker;
        },
        /**
         * options:{
         * map:object,
         * markerId:string
         * }
         * */
        delete: (options) => {
            var marker = options.map.markers[options.markerId];
            if (!marker) {
                throw new Error(`Marker Id:${options.markerId} is not found!`);
            }
            options.map.removeLayer(options.map.markers[options.markerId]);
            delete options.map.markers[options.markerId];
        }
    }
}