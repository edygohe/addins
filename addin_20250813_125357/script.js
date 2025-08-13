geotab.addin.mapaAddin = function (api, state) {
    'use strict';

    return {
        initialize: function (api, state, callback) {
            const vehicleList = document.getElementById('vehicle-list');

            // Obtener los datos de los vehículos
            api.call("Get", { typeName: "Device", resultsLimit: 5 })
                .then(function(devices) {
                    if (!devices || devices.length === 0) {
                        vehicleList.innerHTML = '<li>No se encontraron vehículos.</li>';
                        return Promise.resolve([]);
                    }

                    // Limpiar y poblar la lista de vehículos en la UI
                    vehicleList.innerHTML = ''; // Limpiar "Cargando..."
                    devices.forEach(function(device) {
                        const listItem = document.createElement('li');
                        listItem.textContent = device.name;
                        listItem.dataset.id = device.id; // Guardar el ID para el clic
                        vehicleList.appendChild(listItem);
                    });

                    // Usar delegación de eventos para manejar los clics en la lista
                    vehicleList.addEventListener('click', function(e) {
                        if (e.target && e.target.nodeName === "LI") {
                            const deviceId = e.target.dataset.id;
                            alert(`Vehículo: ${e.target.textContent}\nID: ${deviceId}`);
                        }
                    });

                    callback(); // ¡Crucial!
                })
                .catch(function(error) {
                    console.error("Error inicializando el Add-In:", error);
                    vehicleList.innerHTML = '<li>Error al cargar vehículos.</li>';
                    callback(); // ¡Crucial!
                });
        }
    };
};