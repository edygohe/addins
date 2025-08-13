geotab.addin.gpsRecordsAddIn = function (api, state) {
    return {
        initialize: function (api, state, callback) {
            // Llamamos a la API para obtener el primer vehículo de la flota
            api.call("Get", {
                typeName: "Device",
                resultsLimit: 1
            })
            .then(function (devices) {
                if (devices.length > 0) {
                    const deviceId = devices[0].id;
                    // Ahora que tenemos el deviceId, solicitamos los registros de GPS
                    return api.call("Get", {
                        typeName: "LogRecord",
                        search: {
                            deviceSearch: { id: deviceId }
                        },
                        resultsLimit: 5,
                        orderBy: [
                            { field: "dateTime", order: "DESC" }
                        ]
                    });
                } else {
                    throw new Error("No se encontraron dispositivos en la flota.");
                }
            })
            .then(function (logRecords) {
                // Llenamos la tabla con los registros recibidos
                const tbody = document.getElementById("gpsRecordsBody");
                logRecords.forEach(function (record) {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${new Date(record.dateTime).toLocaleString()}</td>
                        <td>${record.speed}</td>
                        <td>${record.heading}</td>
                    `;
                    tbody.appendChild(row);
                });
                callback(); // Llamar al callback al terminar exitosamente
            })
            .catch(function (error) {
                console.error("Error al obtener registros de GPS:", error);
                callback(); // Llamar al callback en caso de error
            });
        }
    };
};