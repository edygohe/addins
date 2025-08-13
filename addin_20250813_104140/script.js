geotab.addin.vehicleVisualization = function (api, state) {
    'use strict';

    let map;

    return {
        initialize: function (api, state, callback) {
            map = L.map('map').setView([0, 0], 2); // Coordenadas y zoom iniciales
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            api.call("Get", { typeName: "Device", resultsLimit: 5, search: { sort: [{ field: 'id', direction: 'asc' }] } })
                .then(function (devices) {
                    if (!devices || devices.length === 0) {
                        return Promise.resolve([]);
                    }
                    const vehicleList = document.getElementById('vehicle-list');
                    devices.forEach(device => {
                        const listItem = document.createElement('li');
                        listItem.textContent = device.name;
                        listItem.dataset.deviceId = device.id;
                        vehicleList.appendChild(listItem);
                    });

                    // Delegación de eventos para la lista
                    vehicleList.addEventListener('click', function(event) {
                        if (event.target.tagName === 'LI') {
                            const deviceId = event.target.dataset.deviceId;
                            api.call("Get", { typeName: "DeviceStatusInfo", search: { deviceSearch: { ids: [deviceId] } } })
                                .then(function(deviceStatusInfos) {
                                    if (deviceStatusInfos && deviceStatusInfos.length > 0 && deviceStatusInfos[0].latitude && deviceStatusInfos[0].longitude) {
                                        map.setView([deviceStatusInfos[0].latitude, deviceStatusInfos[0].longitude], 13);
                                    }
                                })
                                .catch(function(error) {
                                    console.error("Error al obtener la ubicación:", error);
                                });
                        }
                    });

                    return api.call("Get", { typeName: "DeviceStatusInfo", search: { deviceSearch: { ids: devices.map(d => d.id) } } });
                })
                .then(function (deviceStatusInfos) {
                    deviceStatusInfos.forEach(function (statusInfo) {
                        if (statusInfo.latitude && statusInfo.longitude) {
                            L.marker([statusInfo.latitude, statusInfo.longitude]).addTo(map)
                                .bindPopup(statusInfo.device.name);
                        }
                    });
                    callback();
                })
                .catch(function (error) {
                    console.error("Error inicializando el Add-In:", error);
                    callback();
                });
        }
    };
};