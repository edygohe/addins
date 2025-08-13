geotab.addin.vehiculosMapaAddin = function (api, state) {
    'use strict';
    
    let map; // Variable para el mapa
    let vehicleMarkers = {}; // Para almacenar marcadores de vehículos

    return {
        initialize: function (api, state, callback) {
            // Inicializar el mapa Leaflet
            map = L.map('map').setView([43.6532, -79.3832], 5); // Coordenadas iniciales y zoom

            // Añadir la capa de tiles de OpenStreetMap
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Obtener los vehículos
            api.call("Get", { typeName: "Device", resultsLimit: 5 })
                .then(function (devices) {
                    if (!devices || devices.length === 0) return Promise.resolve([]);
                    // Llenar la lista de vehículos
                    let vehicleList = document.getElementById('vehicle-list');
                    vehicleList.innerHTML = ''; // Limpiar la lista

                    devices.forEach(function(device) {
                        // Añadir el vehículo a la lista
                        let li = document.createElement('li');
                        li.textContent = device.name;
                        li.dataset.deviceId = device.id; // Guardar ID del dispositivo en el elemento
                        vehicleList.appendChild(li);
                    });

                    // Asignar eventos a la lista
                    vehicleList.addEventListener('click', function(event) {
                        if (event.target && event.target.matches('li')) {
                            let selectedVehicleId = event.target.dataset.deviceId;
                            that.updateMap(selectedVehicleId, devices);
                        }
                    });
                })
                .catch(function (error) {
                    console.error("Error al obtener vehículos:", error);
                })
                .finally(callback); // Asegurar que se llama a callback al final
        },

        updateMap: function (deviceId, devices) {
            // Simulación de obtener información de ubicación para el vehículo seleccionado
            // En un escenario real, se debería hacer otra llamada a la API para obtener la ubicación en tiempo real.
            let selectedDevice = devices.find(device => device.id === deviceId);
            if (selectedDevice && selectedDevice.latitude && selectedDevice.longitude) {
                // Centrar el mapa en el vehículo
                map.setView([selectedDevice.latitude, selectedDevice.longitude], 13);

                // Añadir o actualizar marcador en el mapa
                if (vehicleMarkers[deviceId]) {
                    vehicleMarkers[deviceId].setLatLng([selectedDevice.latitude, selectedDevice.longitude]);
                } else {
                    let marker = L.marker([selectedDevice.latitude, selectedDevice.longitude]).addTo(map);
                    marker.bindPopup(selectedDevice.name);
                    vehicleMarkers[deviceId] = marker; // Guardar marcador
                }
            }
        }
    };
};