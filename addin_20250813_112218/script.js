geotab.addin.vehiculosAddin = function (api, state) {
    'use strict';

    return {
        initialize: function (api, state, callback) {
            // Llamar a la API para obtener los dispositivos (vehículos)
            api.call("Get", { typeName: "Device", resultsLimit: 5 })
                .then(function(vehicles) {
                    const vehicleList = document.getElementById('vehicle-list');

                    // Limpiar la lista antes de añadir nuevos elementos
                    vehicleList.innerHTML = '';

                    // Llenar la lista con los primeros 5 vehículos
                    vehicles.forEach(function(vehicle) {
                        const listItem = document.createElement('li');
                        listItem.textContent = vehicle.name;
                        listItem.dataset.id = vehicle.id; // Almacenar el id del vehículo en un atributo data

                        vehicleList.appendChild(listItem);
                    });
                })
                .catch(function(error) {
                    console.error("Error al obtener los vehículos:", error);
                });
                
            // Delegación de eventos para manejar clics en la lista de vehículos
            document.getElementById('vehicle-list').addEventListener('click', function(event) {
                const target = event.target;

                // Verificar si se hizo clic en un elemento de la lista
                if (target.tagName === 'LI') {
                    const vehicleId = target.dataset.id; // Obtener el id desde el atributo data
                    const vehicleName = target.textContent; // Obtener el nombre del vehículo
                    alert(`Nombre: ${vehicleName}, ID: ${vehicleId}`);
                }
            });

            callback(); // Llamar al callback al final
        }
    };
};