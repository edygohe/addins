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
                    // 4. Llenar la lista de vehículos y añadir marcadores al mapa
                    deviceStatusInfos.forEach(function(statusInfo) {
                        if (statusInfo.latitude && statusInfo.longitude) {
                            let listItem = document.createElement('li');
                            listItem.textContent = statusInfo.device.name;
                            listItem.dataset.latitude = statusInfo.latitude;
                            listItem.dataset.longitude = statusInfo.longitude;

                            vehicleList.appendChild(listItem);

                            // Añadir un marcador en el mapa
                            L.marker([statusInfo.latitude, statusInfo.longitude]).addTo(map)
                                .bindPopup(statusInfo.device.name);
                        }
                    });
                    
                    // Delegación de eventos para manejar clics en la lista
                    vehicleList.addEventListener('click', function(event) {
                        const target = event.target;
                        if (target.tagName === 'LI') {
                            const lat = parseFloat(target.dataset.latitude);
                            const lon = parseFloat(target.dataset.longitude);
                            map.setView([lat, lon], 13); // Hacer zoom en la ubicación del vehículo
                        }
                    });

                    callback(); // ¡Crucial!
                })
                .catch(function(error) {
                    console.error("Error inicializando el Add-In:", error);
                    callback(); // ¡Crucial!
                });
        }
    };
};