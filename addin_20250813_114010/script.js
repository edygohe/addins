geotab.addin.mapaAddin = function (api, state) {
    'use strict';

    let map; // Variable para guardar la instancia del mapa
    const vehicleList = document.getElementById('vehicle-list');

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
                        vehicleList.innerHTML = '<li>No hay vehículos disponibles</li>';
                        return Promise.resolve([]);
                    }
                    devices.forEach(device => {
                        const li = document.createElement('li');
                        li.textContent = device.name;
                        li.dataset.id = device.id; // Guardar el ID del vehículo en el dato
                        vehicleList.appendChild(li);
                    });
                    return api.call("Get", { typeName: "DeviceStatusInfo", search: { deviceSearch: { ids: devices.map(d => d.id) } } });
                })
                .then(function(deviceStatusInfos) {
                    // Añadir un marcador por cada vehículo con coordenadas
                    deviceStatusInfos.forEach(function(statusInfo) {
                        if (statusInfo.latitude && statusInfo.longitude) {
                            L.marker([statusInfo.latitude, statusInfo.longitude]).addTo(map)
                                .bindPopup(statusInfo.device.name);
                        }
                    });
                })
                .catch(function(error) {
                    console.error("Error inicializando el Add-In:", error);
                })
                .finally(callback); // Llamar al callback al final

            // Delegación de eventos para la lista de vehículos
            vehicleList.addEventListener('click', function(event) {
                const target = event.target;
                if (target.tagName === 'LI') {
                    const vehicleId = target.dataset.id;
                    // Aquí se puede implementar la lógica para centrar el mapa en el vehículo
                    api.call("Get", { typeName: "Device", search: { id: vehicleId } })
                        .then(function(vehicle) {
                            if (vehicle.length > 0 && vehicle[0].latitude && vehicle[0].longitude) {
                                map.setView([vehicle[0].latitude, vehicle[0].longitude], 15); // Zoom al vehículo
                            }
                        })
                        .catch(function(error) {
                            console.error("Error al centrar el mapa en el vehículo:", error);
                        });
                }
            });
        }
    };
};