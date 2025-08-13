geotab.addin.vehiclesAddin = function (api, state) {
    'use strict';

    return {
        initialize: function (api, state, callback) {
            const vehicleList = document.getElementById('vehicle-list');

            // Delegación de eventos para manejar clics en la lista de vehículos
            vehicleList.addEventListener('click', function(e) {
                if (e.target && e.target.nodeName === "LI") {
                    alert(`Nombre del vehículo: ${e.target.textContent}, ID: ${e.target.dataset.id}`);
                }
            });

            // Obtener la lista de vehículos
            api.call("Get", { typeName: "Device", resultsLimit: 5 })
                .then(function(vehicles) {
                    if (!vehicles || vehicles.length === 0) {
                        vehicleList.innerHTML = '<li>No se encontraron vehículos.</li>';
                        return Promise.resolve([]);
                    }

                    // Limpiar la lista y poblarla con los vehículos obtenidos
                    vehicleList.innerHTML = '';
                    vehicles.forEach(function(vehicle) {
                        const listItem = document.createElement('li');
                        listItem.textContent = vehicle.name;
                        listItem.dataset.id = vehicle.id; // Guardar el ID para el clic
                        vehicleList.appendChild(listItem);
                    });

                    callback(); // Llamar al callback al finalizar
                })
                .catch(function(error) {
                    console.error("Error obteniendo vehículos:", error);
                    vehicleList.innerHTML = '<li>Error al cargar vehículos.</li>';
                    callback(); // Llamar al callback al finalizar, también en error
                });
        }
    };
};