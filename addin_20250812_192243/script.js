document.addEventListener('DOMContentLoaded', function() {
    obtenerPrimerVehiculoYRegistros();
});

// Función para obtener el primer vehículo y sus últimos 5 LogRecords
function obtenerPrimerVehiculoYRegistros() {
    api.call("Get", { typeName: "Device" })
        .then(function(vehiculos) {
            if (vehiculos.length > 0) {
                const primerVehiculo = vehiculos[0];
                obtenerLogRecords(primerVehiculo.id);
            } else {
                console.error("No se encontraron vehículos.");
            }
        })
        .catch(function(error) {
            console.error("Error en la llamada a la API para obtener vehículos:", error);
        });
}

// Función para obtener los últimos 5 registros de GPS de un vehículo
function obtenerLogRecords(vehiculoId) {
    const fechaFin = new Date();
    const fechaInicio = new Date(fechaFin);
    fechaInicio.setHours(fechaFin.getHours() - 1); // Última hora

    api.call("GetValue", {
        typeName: "LogRecord",
        search: {
            deviceId: vehiculoId,
            fromDate: fechaInicio.toISOString(),
            toDate: fechaFin.toISOString()
        },
        limit: 5,
        order: [{ field: 'dateTime', order: 'DESC' }]
    })
    .then(function(logRecords) {
        mostrarLogRecords(logRecords);
    })
    .catch(function(error) {
        console.error("Error en la llamada a la API para obtener LogRecords:", error);
    });
}

// Función para mostrar los LogRecords en la tabla
function mostrarLogRecords(logRecords) {
    const tablaBody = document.querySelector('#logRecordsTable tbody');
    tablaBody.innerHTML = ''; // Limpiar la tabla antes de mostrar los nuevos registros

    logRecords.forEach(record => {
        const fila = document.createElement('tr');

        const celdaFecha = document.createElement('td');
        celdaFecha.textContent = new Date(record.dateTime).toLocaleString();
        fila.appendChild(celdaFecha);

        const celdaVelocidad = document.createElement('td');
        celdaVelocidad.textContent = record.speed || 'N/A';
        fila.appendChild(celdaVelocidad);

        const celdaDireccion = document.createElement('td');
        celdaDireccion.textContent = record.heading || 'N/A';
        fila.appendChild(celdaDireccion);

        tablaBody.appendChild(fila);
    });
}