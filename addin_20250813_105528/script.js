geotab.addin.vehicleViewer = function (api, state) {
    'use strict';

    let map;
    let vehicles = [];

    return {
        initialize: function (api, state, callback) {
            map = L.map('map').setView([0, 0], 2); // Vista inicial por defecto
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            api.call("Get", { typeName: "Device", resultsLimit: 5 })
                .then(function (devices) {
                    if (!devices || devices.length === 0) {
                        return Promise.reject("No se encontraron vehículos.");
                    }
                    const deviceIds = devices.map(d => d.id);
                    return api.call("Get", { typeName: "DeviceStatusInfo", search: { deviceSearch: { ids: deviceIds } } });
                })
                .then(function (deviceStatusInfos) {
                    deviceStatusInfos.forEach(function (statusInfo) {
                        const vehicle = {
                            id: statusInfo.device.id,
                            name: statusInfo.device.name,
                            latitude: statusInfo.latitude,
                            longitude: statusInfo.longitude
                        };
                        vehicles.push(vehicle);
                        const listItem = document.createElement('li');
                        listItem.textContent = `${vehicle.name} (ID: ${vehicle.id})`;
                        listItem.dataset.vehicleId = vehicle.id;
                        document.getElementById('vehicle-list').appendChild(listItem);

                        if (vehicle.latitude && vehicle.longitude) {
                            L.marker([vehicle.latitude, vehicle.longitude]).addTo(map)
                                .bindPopup(vehicle.name).openPopup();
                        }
                    });

                    // Delegación de eventos para la lista
                    document.getElementById('vehicle-list').addEventListener('click', function(event) {
                        if (event.target.tagName === 'LI') {
                            const vehicleId = event.target.dataset.vehicleId;
                            const selectedVehicle = vehicles.find(v => v.id === vehicleId);
                            if (selectedVehicle.latitude && selectedVehicle.longitude) {
                                map.setView([selectedVehicle.latitude, selectedVehicle.longitude], 13);
                            } else {
                                alert(`El vehículo ${selectedVehicle.name} no tiene datos de ubicación.`);
                            }
                        }
                    });

                    callback();
                })
                .catch(function (error) {
                    console.error("Error al obtener datos:", error);
                    alert("Error al cargar los datos de los vehículos.");
                    callback();
                });
        }
    };
};