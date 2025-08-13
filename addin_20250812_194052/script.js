geotab.addin.miAddin = function (api, state) {
    return {
        initialize: function (api, state, callback) {
            let map;
            api.call("Get", { typeName: "Device", resultsLimit: 1 })
            .then(function (devices) {
                if (devices && devices.length > 0) {
                    const firstVehicleId = devices[0].id;

                    api.call("Get", {
                        typeName: "LogRecord",
                        search: { deviceSearch: { id: firstVehicleId } },
                        resultsLimit: 1
                    })
                    .then(function (logRecords) {
                        if (logRecords && logRecords.length > 0) {
                            const firstLocation = logRecords[0];
                            initializeMap(firstLocation);
                            document.getElementById('centerMapButton').addEventListener('click', function () {
                                centerMapOnVehicle(firstLocation);
                            });
                        }
                        callback(); // Finaliza correctamente.
                    })
                    .catch(function (logError) {
                        console.error("Error al obtener LogRecords:", logError);
                        callback(); // Finaliza aunque haya error.
                    });
                } else {
                    callback(); // No hay vehículos, pero debemos finalizar.
                }
            })
            .catch(function (deviceError) {
                console.error("Error al obtener el vehículo:", deviceError);
                callback(); // Finaliza aunque haya error.
            });

            function initializeMap(location) {
                // Inicializa el mapa en la ubicación del primer vehículo.
                const mapContainer = document.getElementById("mapContainer");
                map = new Map(); // Asumimos que existe una función Map para instanciar el mapa.
                map.setView([location.latitude, location.longitude], 14);
            }

            function centerMapOnVehicle(location) {
                // Centra el mapa en la ubicación del vehículo.
                if (map) {
                    map.setView([location.latitude, location.longitude], 14);
                }
            }
        }
    };
};