geotab.addin.mapaAddin = function (api, state) {
    'use strict';

    let map; // Variable para guardar la instancia del mapa
    let vehicles = []; // Almacenar información de vehículos

    return {
        initialize: function (api, state, callback) {
            // 1. Inicializar el mapa Leaflet en nuestro div
            map = L.map('map').setView([43.6532, -79.3832], 5); // Coordenadas iniciales y zoom

            // 2. Añadir la capa de tiles (el fondo del mapa)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // 3. Obtener los datos para mostrar en el mapa
            this.getVehicles(api)
                .then((devices) => {
                    vehicles = devices;
                    this.populateVehicleList(devices);
                    callback(); // ¡Crucial!
                })
                .catch(function (error) {
                    console.error("Error inicializando el Add-In:", error);
                    callback(); // ¡Crucial!
                });

            // 4. Delegación de eventos para la lista de vehículos
            document.getElementById('vehicle-list').addEventListener('click', (event) => {
                const selectedVehicle = event.target.closest('li');
                if (selectedVehicle) {
                    const vehicleId = selectedVehicle.getAttribute('data-id');
                    this.centerMapOnVehicle(vehicleId);
                }
            });
        },

        getVehicles: function (api) {
            return api.call("Get", { typeName: "Device", resultsLimit: 5 })
                .then(function (devices) {
                    if (!devices || devices.length === 0) return Promise.resolve([]);
                    const deviceIds = devices.map(d => d.id);
                    return api.call("Get", { typeName: "DeviceStatusInfo", search: { deviceSearch: { ids: deviceIds } } });
                })
                .then(function (deviceStatusInfos) {
                    return deviceStatusInfos.filter(function (statusInfo) {
                        return statusInfo.latitude && statusInfo.longitude; // Filtrar solo vehículos con ubicación
                    });
                });
        },

        populateVehicleList: function (devices) {
            const vehicleList = document.getElementById('vehicle-list');
            vehicleList.innerHTML = ''; // Limpiar lista existente

            devices.forEach(function (device) {
                const listItem = document.createElement('li');
                listItem.textContent = device.name; // Mostrar el nombre del vehículo
                listItem.setAttribute('data-id', device.id); // Almacenar ID del vehículo
                vehicleList.appendChild(listItem);

                // Agregar marcador en el mapa
                L.marker([device.latitude, device.longitude]).addTo(map)
                    .bindPopup(device.name);
            });
        },

        centerMapOnVehicle: function (vehicleId) {
            const selectedVehicle = vehicles.find(v => v.id === vehicleId);
            if (selectedVehicle) {
                map.setView([selectedVehicle.latitude, selectedVehicle.longitude], 13); // Acercar en la ubicación del vehículo
            }
        }
    };
};