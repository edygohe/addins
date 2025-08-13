geotab.addin.miAddin = function (api, state) {
    return {
        initialize: function (api, state, callback) {
            this.loadData(api, callback);
            
            // Manejador de eventos para el botón de refresco
            document.getElementById('refreshButton').addEventListener('click', (event) => {
                this.loadData(api, callback);
            });

            callback(); // ¡MUY IMPORTANTE!
        },
        loadData: function (api, callback) {
            // Obtener el primer vehículo
            api.call("Get", {
                typeName: "Device",
                resultsLimit: 1
            })
            .then((devices) => {
                if (devices.length > 0) {
                    const vehicleId = devices[0].id;
                    this.fetchLogRecords(api, vehicleId, callback);
                } else {
                    console.warn("No se encontraron vehículos en la flota.");
                    callback(); // ¡MUY IMPORTANTE!
                }
            })
            .catch((error) => {
                console.error("Error al obtener vehículos:", error);
                callback(); // ¡MUY IMPORTANTE!
            });
        },
        fetchLogRecords: function (api, vehicleId, callback) {
            api.call("Get", {
                typeName: "LogRecord",
                search: {
                    deviceId: vehicleId
                },
                sort: [{ order: "DESC", property: "dateTime" }],
                resultsLimit: 5
            })
            .then((logRecords) => {
                this.populateTable(logRecords);
                callback(); // ¡MUY IMPORTANTE!
            })
            .catch((error) => {
                console.error("Error al obtener registros de logs:", error);
                callback(); // ¡MUY IMPORTANTE!
            });
        },
        populateTable: function (logRecords) {
            const tableBody = document.getElementById('logRecordsTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = ""; // Limpiar tabla antes de llenar
            logRecords.forEach(record => {
                const newRow = tableBody.insertRow();
                newRow.insertCell(0).innerText = new Date(record.dateTime).toLocaleString();
                newRow.insertCell(1).innerText = record.speed || 'N/D';
                newRow.insertCell(2).innerText = record.heading || 'N/D';
            });
        },
        focus: function (api, state) {
            // Lógica que se ejecuta cuando el Add-in gana el foco
        },
        blur: function (api, state) {
            // Lógica que se ejecuta cuando el Add-in pierde el foco
        }
    };
};