geotab.addin.mapaAddin = function (api, state) {
    'use strict';

    let map; // Variable para guardar la instancia del mapa

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

                    // Llenar la lista con los vehículos y crear marcadores en el mapa
                    devices.forEach(function(device) {
                        const listItem = document.createElement('li');
                        listItem.textContent = device.name;
                        listItem.setAttribute('data-device-id', device.id);
                        document.getElementById('vehicle-list').appendChild(listItem);

                        // Añadir un marcador en el mapa
                        if (device.position && device.position.latitude && device.position.longitude) {
                            L.marker([device.position.latitude, device.position.longitude])
                                .addTo(map)
                                .bindPopup(device.name);
                        }
                    });
                    callback(); // ¡Crucial!
                })
                .catch(function(error) {
                    console.error("Error obteniendo los vehículos:", error);
                    callback(); // ¡Crucial!
                });

            // 4. Delegación de eventos para la lista de vehículos
            document.getElementById('vehicle-list').addEventListener('click', function(event) {
                if (event.target.tagName === 'LI') {
                    const deviceId = event.target.getAttribute('data-device-id');
                    // Aquí se pueden agregar más acciones al hacer clic en un elemento de la lista
                    console.log("Vehículo seleccionado:", deviceId);
                }
            });
        }
    };
};