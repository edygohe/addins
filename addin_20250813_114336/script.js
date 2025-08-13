geotab.addin.mapaAddin = function (api, state) {
    'use strict';

    let map; // Variable para guardar la instancia del mapa

    return {
        initialize: function (api, state, callback) {
            // Inicializar el mapa Leaflet en nuestro div
            map = L.map('map').setView([43.6532, -79.3832], 5); // Coordenadas iniciales y zoom

            // Añadir la capa de tiles (el fondo del mapa)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Obtener los datos para mostrar en el mapa
            // Patrón de 2 pasos: Get<Device> -> Get<DeviceStatusInfo>
            api.call("Get", { typeName: "Device", resultsLimit: 5 })
                .then(function(devices) {
                    if (!devices || devices.length === 0) return Promise.resolve([]);
                    const deviceIds = devices.map(d => d.id);
                    return api.call("Get", { typeName: "DeviceStatusInfo", search: { deviceSearch: { ids: deviceIds } } });
                })
                .then(function(deviceStatusInfos) {
                    // Actualiza la lista de vehículos
                    const vehicleList = document.getElementById('vehicle-list');
                    vehicleList.innerHTML = ''; // Limpia la lista existente

                    //  Añadir un marcador por cada vehículo con coordenadas y actualizar la lista
                    deviceStatusInfos.forEach(function(statusInfo) {
                        if (statusInfo.latitude && statusInfo.longitude) {
                            L.marker([statusInfo.latitude, statusInfo.longitude]).addTo(map)
                                .bindPopup(statusInfo.device.name);

                            // Añadir vehículo a la lista
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
                .finally(callback); // Llama al callback siempre al final

            // Delegación de eventos para el clic en elementos de la lista de vehículos
            document.getElementById('vehicle-list').addEventListener('click', function(e) {
                if (e.target.tagName === 'LI') {
                    const lat = e.target.dataset.latitude;
                    const lon = e.target.dataset.longitude;
                    map.setView([lat, lon], 15); // Zoom al nivel 15
                }
            });
        }
    };
};