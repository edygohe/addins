geotab.addin.nombreDelAddin = function (api, state) {
    return {
        initialize: function (api, state, callback) {
            api.call("Get", {
                typeName: "Device",
                resultsLimit: 5
            })
            .then(function (devices) {
                let vehicleList = document.getElementById('vehicleList');
                vehicleList.innerHTML = ''; // Limpiar la lista previa

                // Añadir los primeros 5 vehículos a la lista
                devices.slice(0, 5).forEach(function (device) {
                    let listItem = document.createElement('li');
                    listItem.textContent = device.name; // Nombre del vehículo
                    listItem.dataset.id = device.id; // ID del vehículo
                    vehicleList.appendChild(listItem);
                });
                
                // Llamar al callback al completar con éxito
                callback();
            })
            .catch(function (error) {
                console.error("Error al obtener dispositivos:", error);
                callback();
            });

            // Delegación de eventos para la lista interactiva
            document.getElementById('vehicleList').addEventListener('click', function (event) {
                if (event.target.tagName === 'LI') {
                    const vehicleId = event.target.dataset.id;
                    const vehicleName = event.target.textContent;
                    alert(`Vehículo: ${vehicleName} (ID: ${vehicleId})`);
                }
            });
        }
    };
};