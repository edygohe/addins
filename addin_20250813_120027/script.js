geotab.addin.mapaAddin = function (api, state) {
    'use strict';

    let map; // Variable para guardar la instancia del mapa
    let vehicleList = document.getElementById('vehicle-list');

    return {
        initialize: function (api, state, callback) {
            // 1. Inicializar el mapa Leaflet en nuestro div
            map = L.map('map').setView([0, 0], 2); // Coordenadas iniciales y zoom

            // 2. Añadir la capa de tiles (el fondo del mapa)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // 3. Obtener los datos de los vehículos
            api.call("Get", { typeName: "Device", resultsLimit: 5 })
                .then(function(devices) {
                    if (!devices || devices.length === 0) return Promise.resolve([]);
                    const deviceIds = devices.map(d => d.id);
                    return api.call("Get", { typeName: "DeviceStatusInfo", search: { deviceSearch: { ids: deviceIds } } });
                })
                .then(function(deviceStatusInfos) {
                    // 4. Añadir un marcador y un elemento de lista por cada vehículo
                    deviceStatusInfos.forEach(function(statusInfo) {
                        if (statusInfo.latitude && statusInfo.longitude) {
                            // Añadir marcador al mapa
                            const marker = L.marker([statusInfo.latitude, statusInfo.longitude]).addTo(map)
                                .bindPopup(statusInfo.device.name);

                            // Añadir elemento a la lista de vehículos
                            const listItem = document.createElement('li');
                            listItem.textContent = statusInfo.device.name;
                            listItem.dataset.latitude = statusInfo.latitude;
                            listItem.dataset.longitude = statusInfo.longitude;
                            vehicleList.appendChild(listItem);
                        }
                    });
                })
                .catch(function(error) {
                    console.error("Error inicializando el Add-In:", error);
                })
                .finally(callback); // ¡Crucial!

            // Delegación de eventos para la lista de vehículos
            vehicleList.addEventListener('click', function(e) {
                if (e.target && e.target.nodeName === 'LI') {
                    const lat = e.target.dataset.latitude;
                    const lon = e.target.dataset.longitude;
                    map.setView([lat, lon], 10); // Zoom en el vehículo seleccionado
                }
            });
        }
    };
};