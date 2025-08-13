geotab.addin.listaVehiculosAddin = function (api, state) {
    'use strict';

    return {
        initialize: function (api, state, callback) {
            // Obtener la lista de vehículos
            api.call("Get", { typeName: "Device", resultsLimit: 5 })
                .then(function(vehicles) {
                    if (!vehicles || vehicles.length === 0) {
                        document.getElementById('vehicle-list').innerHTML = "<li>No hay vehículos disponibles.</li>";
                        return callback(); // Llamar a la función de callback aunque no haya vehículos
                    }
                    // Construir lista de vehículos
                    const vehicleList = document.getElementById('vehicle-list');
                    vehicles.forEach(vehicle => {
                        const listItem = document.createElement('li');
                        listItem.textContent = vehicle.name;
                        listItem.setAttribute('data-id', vehicle.id);
                        vehicleList.appendChild(listItem);
                    });
                })
                .catch(function(error) {
                    console.error("Error obteniendo la lista de vehículos:", error);
                    document.getElementById('vehicle-list').innerHTML = "<li>Error al cargar los vehículos.</li>";
                })
                .finally(() => {
                    callback(); // Asegúrate de llamar al callback en cualquier caso
                });
            
            // Delegación de eventos para los elementos de la lista
            document.getElementById('vehicle-list').addEventListener('click', function(event) {
                if (event.target.tagName === 'LI') {
                    const vehicleId = event.target.getAttribute('data-id');
                    const vehicleName = event.target.textContent;
                    alert(`Vehículo: ${vehicleName}\nID: ${vehicleId}`);
                }
            });
        }
    };
};