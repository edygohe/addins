geotab.addin.flotaAddin = function (api, state) {
    return {
        initialize: function (api, state, callback) {
            api.call("Get", {
                typeName: "Device",
                resultsLimit: 5
            })
            .then(function (vehicles) {
                // Lógica de éxito para poblar lista y mapa
                console.log("Vehículos recibidos:", vehicles);
                populateVehicleList(vehicles);
                initializeMap(vehicles);
                callback();
            })
            .catch(function (error) {
                console.error("Error al obtener vehículos:", error);
                callback();
            });
        }
    };

    function populateVehicleList(vehicles) {
        const vehicleList = document.getElementById('vehicleList');
        vehicleList.innerHTML = ''; // Limpiar lista antes de poblar
        vehicles.forEach(function (vehicle) {
            const li = document.createElement('li');
            li.textContent = vehicle.name + ' (ID: ' + vehicle.id + ')';
            li.dataset.id = vehicle.id; // Almacenar ID en data attribute
            vehicleList.appendChild(li);
        });
        attachListEventListener();
    }

    function attachListEventListener() {
        const vehicleList = document.getElementById('vehicleList');
        vehicleList.addEventListener('click', function (event) {
            if (event.target.tagName === 'LI') {
                const vehicleId = event.target.dataset.id;
                // Lógica para mostrar información adicional del vehículo
                showVehicleDetails(vehicleId);
            }
        });
    }

    function initializeMap(vehicles) {
        // Aquí se implementaría la lógica de inicialización del mapa.
        console.log("Inicializar mapa con vehículos", vehicles);
    }

    function showVehicleDetails(vehicleId) {
        console.log("Mostrar detalles del vehículo con ID:", vehicleId);
        // Integrar lógica adicional para mostrar detalles del vehículo específico.
    }
};