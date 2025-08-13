geotab.addin.mapaAddin = function (api, state) {
    'use strict';

    let map; // Variable para guardar la instancia del mapa
    let vehicleMarkers = {}; // Objeto para almacenar los marcadores de vehículos

    return {
        initialize: function (api, state, callback) {
            // 1. Inicializar el mapa Leaflet en nuestro div
            map = L.map('map').setView([43.6532, -79.3832], 5); // Coordenadas iniciales y zoom

            // 2. Añadir la capa de tiles (el fondo del mapa)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // 3. Obtener los datos para mostrar en el mapa
            api.call("Get", { typeName: "Device", resultsLimit: 5 })
                .then(function(devices) {
                    if (!devices || devices.length === 0) return Promise.resolve([]);
                    const deviceIds = devices.map(d => d.id);
                    return api.call("Get", { typeName: "DeviceStatusInfo", search: { deviceSearch: { ids: deviceIds } } });
                })
                .then(function(deviceStatusInfos) {
                    const vehicleList = document.getElementById('vehicle-list');
                    vehicleList.innerHTML = ''; // Limpiar la lista antes de llenarla

                    // 4. Añadir un marcador por cada vehículo con coordenadas
                    deviceStatusInfos.forEach(function(statusInfo) {
                        if (statusInfo.latitude && statusInfo.longitude) {
                            const marker = L.marker([statusInfo.latitude, statusInfo.longitude]).addTo(map)
                                .bindPopup(statusInfo.device.name);
                            vehicleMarkers[statusInfo.device.id] = marker; // Guardar el marcador

                            // Añadir elemento a la lista de vehículos
                            const listItem = document.createElement('li');
                            listItem.textContent = statusInfo.device.name;
                            listItem.dataset.deviceId = statusInfo.device.id; // Para identificar qué vehículo fue clickeado
                            vehicleList.appendChild(listItem);
                        }
                    });

                    callback(); // ¡Crucial!
                })
                .catch(function(error) {
                    console.error("Error inicializando el Add-In:", error);
                    callback(); // ¡Crucial!
                });

            // 5. Delegación de eventos para los elementos de la lista
            document.getElementById('vehicle-list').addEventListener('click', function(event) {
                if (event.target && event.target.nodeName === 'LI') {
                    const deviceId = event.target.dataset.deviceId;
                    const marker = vehicleMarkers[deviceId];

                    if (marker) {
                        map.setView(marker.getLatLng(), 13); // Centrar el mapa en el marcador
                        marker.openPopup(); // Abrir el popup del marcador
                    }
                }
            });
        }
    };
};