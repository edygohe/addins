geotab.addin.vehicleVisualization = function (api, state) {
    'use strict';

    let map;
    let vehicles = [];

    return {
        initialize: function (api, state, callback) {
            // Inicializar el mapa Leaflet
            map = L.map('map').setView([0, 0], 2); // Coordenadas y zoom iniciales
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            api.call("Get", { typeName: "Device", resultsLimit: 5 })
                .then(function (devices) {
                    vehicles = devices;
                    const vehicleList = document.getElementById('vehicle-list');
                    vehicles.forEach(vehicle => {
                        const listItem = document.createElement('li');
                        listItem.textContent = `${vehicle.id} - ${vehicle.name}`;
                        listItem.dataset.vehicleId = vehicle.id;
                        vehicleList.appendChild(listItem);
                    });

                    // Delegación de eventos para la lista
                    vehicleList.addEventListener('click', function(event) {
                        if (event.target.tagName === 'LI') {
                            const vehicleId = event.target.dataset.vehicleId;
                            const selectedVehicle = vehicles.find(v => v.id === vehicleId);
                            centerMap(selectedVehicle);
                        }
                    });

                    // Obtener datos de ubicación (DeviceStatusInfo)
                    return api.call("Get", { typeName: "DeviceStatusInfo", search: { deviceSearch: { ids: vehicles.map(d => d.id) } } });
                })
                .then(function (deviceStatusInfos) {
                    deviceStatusInfos.forEach(statusInfo => {
                        if (statusInfo.latitude && statusInfo.longitude) {
                            addMarker(statusInfo);
                        }
                    });
                    callback();
                })
                .catch(function (error) {
                    console.error("Error al inicializar el Add-in:", error);
                    callback();
                });
        }
    };

    function addMarker(statusInfo) {
        L.marker([statusInfo.latitude, statusInfo.longitude]).addTo(map)
            .bindPopup(statusInfo.device.name).openPopup();
    }

    function centerMap(vehicle) {
        const deviceStatusInfo = vehicles.find(v => v.id === vehicle.id);
        if (deviceStatusInfo && deviceStatusInfo.latitude && deviceStatusInfo.longitude) {
            map.setView([deviceStatusInfo.latitude, deviceStatusInfo.longitude], 12);
        } else {
            alert(`No se encontraron datos de ubicación para el vehículo ${vehicle.name}`);
        }
    }
};