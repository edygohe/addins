geotab.addin.mapaAddin = function (api, state) {
    'use strict';

    let map; // Variable para guardar la instancia del mapa
    let vehicleMarkers = {}; // Objeto para almacenar los marcadores por vehículo

    return {
        initialize: function (api, state, callback) {
            // 1. Inicializar el mapa Leaflet en nuestro div
            map = L.map('map').setView([43.6532, -79.3832], 5); // Coordenadas iniciales y zoom

            // 2. Añadir la capa de tiles (el fondo del mapa)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // 3. Obtener los primeros 5 vehículos
            api.call("Get", { typeName: "Device", resultsLimit: 5 })
                .then(function(devices) {
                    if (!devices || devices.length === 0) return Promise.resolve([]);
                    // Llamar a la API para obtener la información del status de los dispositivos
                    const deviceIds = devices.map(d => d.id);
                    return api.call("Get", { typeName: "DeviceStatusInfo", search: { deviceSearch: { ids: deviceIds } } });
                })
                .then(function(deviceStatusInfos) {
                    // 4. Añadir los vehículos a la lista y marcadores al mapa
                    const vehicleList = document.getElementById('vehicle-list');
                    deviceStatusInfos.forEach(function(statusInfo) {
                        if (statusInfo.latitude && statusInfo.longitude) {
                            const vehicleItem = document.createElement('li');
                            vehicleItem.textContent = statusInfo.device.name;

                            // Almacenar el marcador para poder moverlo al seleccionar
                            const marker = L.marker([statusInfo.latitude, statusInfo.longitude]).addTo(map).bindPopup(statusInfo.device.name);
                            vehicleMarkers[statusInfo.device.id] = marker;

                            // Añadir el evento de clic a cada vehículo
                            vehicleItem.addEventListener('click', function() {
                                map.setView([statusInfo.latitude, statusInfo.longitude], 13); // Centrar el mapa en el vehículo
                            });

                            vehicleList.appendChild(vehicleItem);
                        }
                    });
                    callback(); // ¡Crucial!
                })
                .catch(function(error) {
                    console.error("Error al inicializar el Add-In:", error);
                    callback(); // ¡Crucial!
                });
        }
    };
};