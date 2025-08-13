geotab.addin.listaVehiculosAddin = function (api, state) {
    'use strict';
    
    return {
        initialize: function (api, state, callback) {
            const vehicleList = document.getElementById('vehicle-list');

            // Usar delegación de eventos para manejar los clics en la lista
            vehicleList.addEventListener('click', function(e) {
                if (e.target && e.target.nodeName === "LI") {
                    const vehicleId = e.target.dataset.id;
                    const vehicleName = e.target.textContent;
                    alert('Nombre: ' + vehicleName + '\nID: ' + vehicleId);
                }
            });

            // Obtener los datos para mostrar en la lista
            api.call("Get", { typeName: "Device", resultsLimit: 5 })
                .then(function(devices) {
                    if (!devices || devices.length === 0) {
                        vehicleList.innerHTML = '<li>No se encontraron vehículos.</li>';
                        return Promise.resolve([]);
                    }

                    // Limpiar "Cargando..."
                    vehicleList.innerHTML = ''; 
                    devices.forEach(function(device) {
                        const listItem = document.createElement('li');
                        listItem.textContent = device.name;
                        listItem.dataset.id = device.id; // Guardar el ID para el clic
                        vehicleList.appendChild(listItem);
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