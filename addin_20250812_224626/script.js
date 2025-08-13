geotab.addin.nombreDelAddin = function (api, state) {
    return {
        initialize: function (api, state, callback) {
            api.call("Get", {
                typeName: "Device",
                resultsLimit: 5
            })
            .then(function (devices) {
                // Llenar la lista con los nombres de los vehículos
                const vehicleList = document.getElementById('vehicleList');
                devices.forEach(device => {
                    const li = document.createElement('li');
                    li.textContent = device.name;
                    li.setAttribute('data-id', device.id); // Guardar ID del vehículo
                    vehicleList.appendChild(li);
                });
                // Llamar al callback para notificar que el Add-In terminó de cargar
                callback();
            })
            .catch(function (error) {
                console.error("Error al obtener dispositivos:", error);
                callback(); // Llamar al callback también en caso de error
            });

            // Delegación de eventos para manejar clics en la lista
            document.getElementById('vehicleList').addEventListener('click', function (event) {
                if (event.target.tagName === 'LI') {
                    const vehicleId = event.target.getAttribute('data-id');
                    // Obtener la última ubicación del vehículo
                    api.call("Get", {
                        typeName: "Device",
                        id: vehicleId
                    })
                    .then(function (vehicle) {
                        if (vehicle && vehicle[0]) {
                            const lastLocation = vehicle[0].lastLocation;
                            if (lastLocation) {
                                // Logica para centrar el mapa en la ubicación obtenida
                                console.log(`Última ubicación del vehículo: ${lastLocation.latitude}, ${lastLocation.longitude}`);
                                centerMap(lastLocation.latitude, lastLocation.longitude);
                            }
                        }
                    })
                    .catch(function (error) {
                        console.error("Error al obtener la ubicación del vehículo:", error);
                    });
                }
            });
        }
    };
};

// Función para centrar el mapa, esta es una función ficticia que debería implementar la lógica para el mapa.
function centerMap(latitude, longitude) {
    // Implementar la lógica para centrar el mapa en la ubicación proporcionada
    console.log(`Centrando el mapa en: ${latitude}, ${longitude}`);
}