geotab.addin.mapaAddin = function (api, state) {
    'use strict';

    let map; // Variable para guardar la instancia del mapa

    // Inicializa el Add-In
    return {
        initialize: function (api, state, callback) {
            // Inicializar el mapa Leaflet
            map = L.map('map').setView([43.6532, -79.3832], 5); // Coordenadas iniciales

            // Añadir capa de tiles al mapa
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Obtener datos de vehículos
            api.call("Get", { typeName: "Device", resultsLimit: 5 })
                .then(function(devices) {
                    if (!devices || devices.length === 0) return Promise.resolve([]);
                    const deviceIds = devices.map(d => d.id);
                    return api.call("Get", { typeName: "DeviceStatusInfo", search: { deviceSearch: { ids: deviceIds } } });
                })
                .then(function(deviceStatusInfos) {
                    const vehicleList = document.getElementById('vehicle-list');
                    deviceStatusInfos.forEach(function(statusInfo) {
                        if (statusInfo.latitude && statusInfo.longitude) {
                            // Crear el ítem de la lista
                            const listItem = document.createElement('li');
                            listItem.textContent = statusInfo.device.name;
                            listItem.dataset.latitude = statusInfo.latitude;
                            listItem.dataset.longitude = statusInfo.longitude;
                            vehicleList.appendChild(listItem);
                        }
                    });

                    // Delegación de eventos para la selección de vehículos
                    vehicleList.addEventListener('click', function(event) {
                        if (event.target.tagName === 'LI') {
                            const lat = event.target.dataset.latitude;
                            const lng = event.target.dataset.longitude;
                            map.setView([lat, lng], 10);
                        }
                    });

                    callback(); // Crucial
                })
                .catch(function(error) {
                    console.error("Error inicializando el Add-In:", error);
                    callback(); // Crucial
                });
        }
    };
};