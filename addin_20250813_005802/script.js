geotab.addin.vehiculosVisualizacion = function (api, state) {
    return {
        initialize: function (api, state, callback) {
            api.call("Get", {
                typeName: "Device",
                resultsLimit: 5
            })
            .then(function (devices) {
                console.log("Vehículos recibidos:", devices);
                this.populateVehicleList(devices);
                // Aquí se inicializaría el mapa y se agregarían los vehículos
                this.initMap(devices);
                callback();
            }.bind(this))
            .catch(function (error) {
                console.error("Error al obtener vehículos:", error);
                callback();
            });
        },
        
        populateVehicleList: function(devices) {
            const vehicleList = document.getElementById("vehicleList");
            vehicleList.innerHTML = ''; // Limpiar la lista antes de agregar

            devices.forEach(device => {
                const li = document.createElement("li");
                li.textContent = `Vehículo: ${device.name} - Estado: ${device.status}`;
                vehicleList.appendChild(li);
            });
        },

        initMap: function(devices) {
            // Aquí se implementaría el código para inicializar el mapa
            // y colocar marcadores para cada vehículo.
            console.log("Inicializando el mapa con vehículos:", devices);

            // Ejemplo: Aquí se debería integrar con la API de mapas elegida.
        }
    };
};