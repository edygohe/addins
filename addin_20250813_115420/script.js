geotab.addin.mapaAddin = function (api, state) {
    'use strict';

    let map;
    let markers = {}; // Almacena los marcadores para cada vehículo

    return {
        initialize: function (api, state, callback) {
            // Inicializar el mapa Leaflet
            map = L.map('map').setView([43.6532, -79.3832], 5);

            // Añadir capa de tiles al mapa
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Obtener los datos para los vehículos
            api.call("Get", { typeName: "Device", resultsLimit: 5 })
                .then(devices => {
                    if (!devices || devices.length === 0) return Promise.resolve([]);

                    // Mostrar los vehículos en la lista
                    devices.forEach(device => {
                        const li = document.createElement('li');
                        li.textContent = device.name;
                        li.dataset.id = device.id; // Almacenar el ID del dispositivo
                        document.getElementById('vehicle-list').appendChild(li);

                        // Añadir un marcador en el mapa
                        if (device.latitude && device.longitude) {
                            markers[device.id] = L.marker([device.latitude, device.longitude]).addTo(map)
                                .bindPopup(device.name);
                        }
                    });
                })
                .catch(error => {
                    console.error("Error al obtener vehículos:", error);
                })
                .finally(() => {
                    callback(); // Crucial: llamar el callback al final
                });

            // Delegación de eventos para la lista de vehículos
            document.getElementById('vehicle-list').addEventListener('click', function(event) {
                const clickedVehicle = event.target;
                if (clickedVehicle.tagName === 'LI') {
                    const vehicleId = clickedVehicle.dataset.id;
                    const marker = markers[vehicleId];
                    if (marker) {
                        map.setView(marker.getLatLng(), 15); // Hacer zoom en el marcador
                        marker.openPopup(); // Mostrar el popup
                    }
                }
            });
        }
    };
};