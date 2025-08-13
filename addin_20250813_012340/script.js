geotab.addin.vehicleListAddin = function (api, state) {
    'use strict';

    return {
        initialize: function (api, state, callback) {
            // Llamar a la API de Geotab para obtener la lista de vehículos
            api.call("Get", { typeName: "Device", resultsLimit: 5 })
                .then(function(devices) {
                    if (!devices || devices.length === 0) {
                        console.warn("No se encontraron vehículos.");
                        return callback(); // Salir si no hay vehículos
                    }

                    // Construir la lista de vehículos
                    const vehicleList = document.getElementById('vehicleList');
                    devices.forEach(function(device) {
                        const li = document.createElement('li');
                        li.textContent = device.name;
                        li.dataset.id = device.id; // Almacenar el ID en un atributo

                        // Usar delegación de eventos
                        li.addEventListener('click', function() {
                            alert(`Vehículo: ${device.name}\nID: ${device.id}`);
                        });

                        vehicleList.appendChild(li);
                    });
                    
                    callback(); // Crucial: indicar que hemos terminado
                })
                .catch(function(error) {
                    console.error("Error al obtener la lista de vehículos:", error);
                    callback(); // Crucial
                });
        }
    };
};