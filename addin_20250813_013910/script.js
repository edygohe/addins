geotab.addin.mapaAddin = function (api, state) {
    'use strict';

    let map; // Variable para guardar la instancia del mapa
    const vehicleList = document.getElementById('vehicle-list');

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
                    // 4. Añadir un marcador por cada vehículo con coordenadas
                    deviceStatusInfos.forEach(function(statusInfo) {
                        if (statusInfo.latitude && statusInfo.longitude) {
                            const marker = L.marker([statusInfo.latitude, statusInfo.longitude]).addTo(map)
                                .bindPopup(statusInfo.device.name);
                            
                            // Añadir a la lista de vehículos
                            const listItem = document.createElement('li');
                            listItem.textContent = statusInfo.device.name;
                            listItem.dataset.lat = statusInfo.latitude;
                            listItem.dataset.lng = statusInfo.longitude;
                            vehicleList.appendChild(listItem);
                        }
                    });
                    callback(); // ¡Crucial!
                })
                .catch(function(error) {
                    console.error("Error inicializando el Add-In:", error);
                    callback(); // ¡Crucial!
                });

            // Delegación de eventos para la lista de vehículos
            vehicleList.addEventListener('click', function(event) {
                if (event.target.tagName === 'LI') {
                    const lat = event.target.dataset.lat;
                    const lng = event.target.dataset.lng;
                    map.setView([lat, lng], 10); // Centrar el mapa en el vehículo seleccionado
                }
            });
        }
    };
};