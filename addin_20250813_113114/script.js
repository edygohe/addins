geotab.addin.mapaAddin = function (api, state) {
    'use strict';

    let map; // Variable para guardar la instancia del mapa
    let markers = []; // Lista para almacenar marcadores de vehículos

    return {
        initialize: function (api, state, callback) {
            // 1. Inicializar el mapa Leaflet en nuestro div
            map = L.map('map').setView([43.6532, -79.3832], 5); // Coordenadas iniciales y zoom

            // 2. Añadir la capa de tiles (el fondo del mapa)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // 3. Obtener los datos para mostrar en el mapa
            this.updateVehicleList(api, callback);
        },

        updateVehicleList: function(api, callback) {
            api.call("Get", { typeName: "Device", resultsLimit: 5 })
                .then(devices => {
                    if (!devices || devices.length === 0) return Promise.resolve([]);
                    
                    const vehicleList = document.getElementById("vehicle-list");
                    vehicleList.innerHTML = ''; // Limpiar la lista existente

                    devices.forEach(device => {
                        const listItem = document.createElement("li");
                        listItem.textContent = device.name;
                        listItem.dataset.id = device.id; // Guardar ID para el clic
                        vehicleList.appendChild(listItem);
                    });

                    // Manejo de eventos de clic
                    vehicleList.addEventListener('click', (e) => {
                        if(e.target.tagName === 'LI') {
                            this.zoomToVehicle(e.target.dataset.id, api);
                        }
                    });

                    callback(); // Llamamos al callback al actualizar
                })
                .catch(error => {
                    console.error("Error obteniendo vehículos:", error);
                    callback(); // Callback de error
                });
        },

        zoomToVehicle: function(vehicleId, api) {
            api.call("Get", { typeName: "DeviceStatusInfo", search: { deviceSearch: { ids: [vehicleId] } } })
                .then(statusInfos => {
                    const statusInfo = statusInfos[0]; // Suponiendo que solo hay uno por ID
                    if (statusInfo && statusInfo.latitude && statusInfo.longitude) {
                        map.setView([statusInfo.latitude, statusInfo.longitude], 15);
                        
                        // Si hay marcadores previos, limpiarlos
                        markers.forEach(marker => map.removeLayer(marker));
                        markers = [];

                        // Añadir nuevo marcador
                        const marker = L.marker([statusInfo.latitude, statusInfo.longitude]).addTo(map)
                            .bindPopup(statusInfo.device.name);
                        markers.push(marker);
                    }
                })
                .catch(error => {
                    console.error("Error al hacer zoom en el vehículo:", error);
                });
        }
    };
};