geotab.addin.vehiculosVisualizacion = function (api, state) {
    // Variable para guardar la instancia del mapa
    let mapInstance;

    return {
        initialize: function (api, state, callback) {
            api.call("Get", {
                typeName: "Device",
                resultsLimit: 5
            })
            .then(function (devices) {
                console.log("Vehículos recibidos:", devices);
                
                // La lógica de la lista de vehículos está aquí
                //this.populateVehicleList(devices);

                // **Nuevo: Inicializa el mapa solo si no existe**
                if (!mapInstance) {
                    this.initMap();
                }

                this.addVehicleMarkers(devices);
                callback();
            }.bind(this))
            .catch(function (error) {
                console.error("Error al obtener vehículos:", error);
                callback();
            });
        },
        
        // **Nuevo: Método para inicializar el mapa de Leaflet**
        initMap: function() {
            // El 'div' en tu HTML debe tener el id="map"
            mapInstance = L.map('map').setView([19.4326, -99.1332], 13); // Coordenadas y zoom inicial de ejemplo (CDMX)
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapInstance);

            console.log("Mapa de Leaflet inicializado.");
        },

        // **Nuevo: Método para agregar marcadores al mapa**
        addVehicleMarkers: function(devices) {
            if (!mapInstance) {
                console.error("No se puede agregar marcadores, el mapa no está inicializado.");
                return;
            }

            devices.forEach(device => {
                // Se necesita la latitud y longitud del dispositivo.
                // Para este ejemplo, estamos asumiendo que los datos de la API los incluyen.
                // Es posible que necesites una llamada adicional para obtener la posición actual.
                if (device.latitude && device.longitude) {
                    L.marker([device.latitude, device.longitude])
                        .addTo(mapInstance)
                        .bindPopup(`Vehículo: ${device.name}`)
                        .openPopup();
                } else {
                    console.warn(`No se encontraron coordenadas para el vehículo: ${device.name}`);
                }
            });
            console.log("Marcadores de vehículos agregados al mapa.");
        },
        
        populateVehicleList: function(devices) {
            const vehicleList = document.getElementById("vehicleList");
            vehicleList.innerHTML = '';
            devices.forEach(device => {
                const li = document.createElement("li");
                li.textContent = `Vehículo: ${device.name} - Estado: ${device.status}`;
                vehicleList.appendChild(li);
            });
        }
    };
};