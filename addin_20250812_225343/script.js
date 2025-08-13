geotab.addin.nombreDelAddin = function (api, state) {
    return {
        initialize: function (api, state, callback) {
            api.call("Get", {
                typeName: "Device",
                resultsLimit: 5
            })
            .then(function (vehicles) {
                // Llenar la lista de vehículos
                const vehicleList = document.getElementById('vehicleList');
                vehicles.forEach(function(vehicle) {
                    const listItem = document.createElement('li');
                    listItem.textContent = vehicle.name;
                    listItem.dataset.vehicleData = JSON.stringify(vehicle); // Almacenar datos del vehículo
                    vehicleList.appendChild(listItem);
                });

                // Llamar al callback de éxito
                callback();
            })
            .catch(function (error) {
                console.error("Error al obtener vehículos:", error);
                callback();
            });

            // Delegación de eventos para el clic en la lista
            document.getElementById('vehicleList').addEventListener('click', function(e) {
                if (e.target.tagName === 'LI') {
                    const vehicleData = JSON.parse(e.target.dataset.vehicleData);
                    alert(`Detalles del vehículo:\nNombre: ${vehicleData.name}\nID: ${vehicleData.id}\nOtros campos: ${JSON.stringify(vehicleData)}`);
                }
            });
        }
    };
};