geotab.addin.gpsAddin = function (api, state) {
    'use strict';

    let gpsData = [];

    return {
        initialize: function (api, state, callback) {
            const refreshButton = document.getElementById('refresh-button');
            const errorMessage = document.getElementById('error-message');
            const gpsDataTableBody = document.getElementById('gps-data').querySelector('tbody');

            refreshButton.addEventListener('click', fetchData);
            fetchData();

            function fetchData() {
                errorMessage.textContent = ''; // Limpiar mensajes de error previos
                gpsDataTableBody.innerHTML = ''; // Limpiar la tabla

                api.call("Get", { typeName: "Device", resultsLimit: 1 })
                    .then(devices => {
                        if (!devices || devices.length === 0) {
                            throw new Error("No se encontraron vehículos.");
                        }
                        const deviceId = devices[0].id;
                        return api.call("Get", {
                            typeName: "LogRecord",
                            search: {
                                deviceSearch: { ids: [deviceId] },
                                sort: [{ field: "dateTime", direction: "DESC" }],
                                resultsLimit: 5
                            }
                        });
                    })
                    .then(logRecords => {
                        if (!logRecords || logRecords.length === 0) {
                            errorMessage.textContent = "No se encontraron registros GPS para este vehículo.";
                            return;
                        }

                        gpsData = logRecords.map(record => ({
                            dateTime: record.dateTime,
                            speed: record.speed * 3.6, // Convertir de m/s a km/h
                            heading: record.heading
                        }));

                        gpsData.forEach(record => {
                            const row = gpsDataTableBody.insertRow();
                            row.insertCell().textContent = record.dateTime;
                            row.insertCell().textContent = record.speed.toFixed(2);
                            row.insertCell().textContent = record.heading;
                        });
                        callback();
                    })
                    .catch(error => {
                        errorMessage.textContent = `Error: ${error.message}`;
                        console.error("Error fetching GPS data:", error);
                        callback();
                    });
            }
        }
    };
};