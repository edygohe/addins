geotab.addin.mapaAddin = function (api, state) {
    'use strict';

    let map; // Variable para guardar la instancia del mapa
    let markers = []; // Arreglo para almacenar los marcadores

    return {
        initialize: function (api, state, callback) {
            // Inicializar el mapa Leaflet en nuestro div
            map = L.map('map').setView([43.6532, -79.3832], 5); // Coordenadas iniciales y zoom

            // Añadir la capa de tiles (el fondo del mapa)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Obtener los datos para mostrar en el mapa
            api.call("Get", { typeName: "Device", resultsLimit: 5 })
                .then(function(devices) {
                    if (!devices || devices.length === 0) {
                        document.getElementById('vehicle-list').innerHTML = '<li>No hay vehículos disponibles.</li>';
                        return Promise.resolve([]);
                    }
                    const deviceIds = devices.map(d => d.id);
                    return api.call("Get", { typeName: "DeviceStatusInfo", search: { deviceSearch: { ids: deviceIds } } });
                })
                .then(function(deviceStatusInfos) {
                    const vehicleList = document.getElementById('vehicle-list');
                    vehicleList.innerHTML = ''; // Limpiar la lista
                    
                    deviceStatusInfos.forEach(function(statusInfo) {
                        const listItem = document.createElement('li');
                        listItem.textContent = statusInfo.device.name + ' (ID: ' + statusInfo.device.id + ')';
                        listItem.dataset.latitude = statusInfo.latitude;
                        listItem.dataset.longitude = statusInfo.longitude;

                        // Añadir el evento de clic para centrar el mapa
                        listItem.addEventListener('click', function() {
                            const lat = parseFloat(listItem.dataset.latitude);
                            const lng = parseFloat(listItem.dataset.longitude);
                            if (!isNaN(lat) && !isNaN(lng)) {
                                map.setView([lat, lng], 15); // Ajustar el zoom al hacer clic
                            }
                        });

                        vehicleList.appendChild(listItem);
                        if (statusInfo.latitude && statusInfo.longitude) {
                            const marker = L.marker([statusInfo.latitude, statusInfo.longitude]).addTo(map)
                                .bindPopup(statusInfo.device.name);
                            markers.push(marker); // Almacenar el marcador
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