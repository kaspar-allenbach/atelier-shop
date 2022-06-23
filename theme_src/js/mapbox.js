

export default function mapBox() {

        mapboxgl.accessToken = 'pk.eyJ1Ijoia2FzcGFyYWxsZW5iYWNoIiwiYSI6ImNqeWVhbTl4dzEwYnkzY3A4ZGtpZXJnbngifQ.DSCAVTLLGkxBo-zzJk-AzA';
        var map = new mapboxgl.Map({
            container: 'mapBox',
            style: 'mapbox://styles/kasparallenbach/cjyfxq5h91dtx1cqcyrsizj8g',
            center: [7.447251, 46.957726],
            zoom: 4,
        });

        map.on('load', function () {
            map.resize();
        });

        map.on("render", function () {
            /* Image: An image is loaded and added to the map. */
            map.loadImage("/theme/img/map-pin.png", function (error, image) {
                if (error) throw error;
                map.addImage("custom-marker", image);
                /* Style layer: A style layer ties together the source and image and specifies how they are displayed on the map. */
                map.addLayer({
                    id: "markers",
                    type: "symbol",
                    /* Source: A data source specifies the geographic coordinate where the image marker gets placed. */
                    source: {
                        type: "geojson",
                        data: {
                            type: 'FeatureCollection',
                            features: [
                                {
                                    type: 'Feature',
                                    properties: {},
                                    geometry: {
                                        type: "Point",
                                        coordinates: [7.446, 46.9586]
                                    }
                                }
                            ]
                        }
                    },
                    layout: {
                        "icon-image": "custom-marker",
                    }
                });
            });
            map.resize();
        });
    }