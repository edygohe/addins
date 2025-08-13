geotab.addin.mapaAddin = function (api, state) {
    'use strict';

    let map; // Variable para guardar la instancia del mapa
    let deviceStatusInfos = []; // Almacén para los datos de los vehículos

    return {
        initialize: function (api, state, callback) {
            // 1. Inicializar el mapa Leaflet en nuestro div
            map = L.map('map').setView([43.6532, -79.3832], 5); // Coordenadas iniciales y zoom

            // 2. Añadir la capa de tiles (el fondo del mapa)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            const vehicleList = document.getElementById('vehicle-list');

            // 3. Usar delegación de eventos para manejar los clics en la lista
            vehicleList.addEventListener('click', function (e) {
                if (e.target && e.target.nodeName === "LI") {
                    const deviceId = e.target.dataset.id;
                    const selectedDevice = deviceStatusInfos.find(d => d.device.id === deviceId);
                    if (selectedDevice && selectedDevice.latitude && selectedDevice.longitude) {
                        // Centrar el mapa en el vehículo seleccionado con un zoom de nivel 15
                        map.setView([selectedDevice.latitude, selectedDevice.longitude], 15);
                    }
                }
            });

            // 4. Obtener los datos para mostrar en la lista y el mapa
            // Patrón de 2 pasos: Get<Device> -> Get<DeviceStatusInfo>
            api.call("Get", { typeName: "Device", resultsLimit: 5 })
                .then(function (devices) {
                    if (!devices || devices.length === 0) {
                        vehicleList.innerHTML = '<li>No se encontraron vehículos.</li>';
                        return Promise.resolve([]);
                    }

                    // Poblar la lista de vehículos en la UI
                    vehicleList.innerHTML = ''; // Limpiar "Cargando..."
                    devices.forEach(function (device) {
                        const listItem = document.createElement('li');
                        listItem.textContent = device.name;
                        listItem.dataset.id = device.id; // Guardar el ID para el clic
                        vehicleList.appendChild(listItem);
                    });

                    const deviceIds = devices.map(d => d.id);
                    return api.call("Get", { typeName: "DeviceStatusInfo", search: { deviceSearch: { ids: deviceIds } } });
                })
                .then(function (statuses) {
                    deviceStatusInfos = statuses || [];
                    // 5. Añadir un marcador por cada vehículo con coordenadas
                    deviceStatusInfos.forEach(function (statusInfo) {
                        if (statusInfo.latitude && statusInfo.longitude) {
                            L.marker([statusInfo.latitude, statusInfo.longitude]).addTo(map)
                                .bindPopup(statusInfo.device.name);
                        }
                    });

                    // 6. Ajustar el mapa para que se vean todos los vehículos inicialmente
                    if (deviceStatusInfos.length > 0) {
                        const bounds = L.latLngBounds(deviceStatusInfos
                            .filter(s => s.latitude && s.longitude)
                            .map(s => [s.latitude, s.longitude])
                        );
                        if (bounds.isValid()) {
                            map.fitBounds(bounds);
                        }
                    }

                    callback(); // ¡Crucial!
                })
                .catch(function (error) {
                    console.error("Error inicializando el Add-In:", error);
                    vehicleList.innerHTML = '<li>Error al cargar vehículos.</li>';
                    callback(); // ¡Crucial!
                });
        }
    };
};