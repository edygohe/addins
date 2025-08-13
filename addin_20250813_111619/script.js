geotab.addin.vehicleViewer = function (api, state) {
    'use strict';

    let map;
    let vehicles = [];

    return {
        initialize: function (api, state, callback) {
            // Inicializar el mapa
            map = L.map('map').setView([0, 0], 2); // Vista inicial genérica
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Obtener los 5 primeros vehículos
            api.call("Get", { typeName: "Device", resultsLimit: 5 })
                .then(function (devices) {
                    if (!devices || devices.length === 0) {
                        console.error("No se encontraron vehículos.");
                        return Promise.resolve([]);
                    }
                    const deviceIds = devices.map(d => d.id);
                    return api.call("Get", { typeName: "DeviceStatusInfo", search: { deviceSearch: { ids: deviceIds } } });
                })
                .then(function (deviceStatusInfos) {
                    vehicles = deviceStatusInfos;
                    renderVehicleList(vehicles);
                    // Agregar marcadores al mapa
                    updateMap();
                    callback();
                })
                .catch(function (error) {
                    console.error("Error al obtener datos de vehículos:", error);
                    callback();
                });

            // Delegación de eventos para la lista de vehículos
            document.getElementById('vehicle-list').addEventListener('click', function(event) {
                if (event.target.tagName === 'LI') {
                    const vehicleId = event.target.dataset.vehicleId;
                    const selectedVehicle = vehicles.find(v => v.device.id === vehicleId);
                    updateMap(selectedVehicle);
                }
            });
        }
    };

    function renderVehicleList(vehicles) {
        const vehicleList = document.getElementById('vehicle-list');
        vehicleList.innerHTML = ''; // Limpiar la lista antes de renderizar
        vehicles.forEach(vehicle => {
            const listItem = document.createElement('li');
            listItem.dataset.vehicleId = vehicle.device.id;
            listItem.textContent = `${vehicle.device.name} (ID: ${vehicle.device.id})`;
            vehicleList.appendChild(listItem);
        });
    }

    function updateMap(selectedVehicle) {
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        if (selectedVehicle) {
            if (selectedVehicle.latitude && selectedVehicle.longitude) {
                map.setView([selectedVehicle.latitude, selectedVehicle.longitude], 12);
                L.marker([selectedVehicle.latitude, selectedVehicle.longitude]).addTo(map)
                    .bindPopup(selectedVehicle.device.name).openPopup();
            } else {
                alert(`El vehículo ${selectedVehicle.device.name} no tiene datos de ubicación.`);
            }
        } else {
            vehicles.forEach(vehicle => {
                if (vehicle.latitude && vehicle.longitude) {
                    L.marker([vehicle.latitude, vehicle.longitude]).addTo(map)
                        .bindPopup(vehicle.device.name);
                }
            });
        }
    }
};