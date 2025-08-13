geotab.addin.mapaAddin = function (api, state) {
    'use strict';

    let map; // Variable para guardar la instancia del mapa
    let vehicleList = document.getElementById('vehicle-list');
    let faultTableBody = document.querySelector('#fault-table tbody');
    
    return {
        initialize: function (api, state, callback) {
            // Inicializar el mapa Leaflet en nuestro div
            map = L.map('map').setView([43.6532, -79.3832], 5); // Coordenadas iniciales y zoom

            // Añadir la capa de tiles (el fondo del mapa)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Función para cargar y mostrar vehículos
            const loadVehicles = () => {
                api.call("Get", { typeName: "Device", resultsLimit: 100 })
                    .then(function(devices) {
                        if (!devices || devices.length === 0) return Promise.resolve([]);
                        // Limpiar la lista anterior
                        vehicleList.innerHTML = '';
                        faultTableBody.innerHTML = '';
                        
                        devices.forEach(function(device) {
                            let li = document.createElement('li');
                            li.textContent = device.name; 
                            li.setAttribute('data-id', device.id);
                            vehicleList.appendChild(li);
                        });
                    })
                    .catch(function(error) {
                        console.error("Error obteniendo vehículos:", error);
                    });
            };

            // Cargar vehículos inicialmente
            loadVehicles();

            // Delegación de eventos para la lista de vehículos
            vehicleList.addEventListener('click', function(e) {
                if (e.target && e.target.tagName === 'LI') {
                    const selectedDeviceId = e.target.getAttribute('data-id');
                    
                    api.call("Get", { typeName: "DeviceStatusInfo", search: { deviceSearch: { ids: [selectedDeviceId] } } })
                        .then(function(statusInfos) {
                            const statusInfo = statusInfos[0]; // Solo un vehículo por selección

                            // Actualizar marcador en el mapa
                            if (statusInfo.latitude && statusInfo.longitude) {
                                map.setView([statusInfo.latitude, statusInfo.longitude], 13);
                                L.marker([statusInfo.latitude, statusInfo.longitude]).addTo(map)
                                    .bindPopup(statusInfo.device.name).openPopup();
                            }

                            // Limpiar tabla de fallos
                            faultTableBody.innerHTML = '';

                            // Agregar detalles de fallos
                            if (statusInfo.faults && statusInfo.faults.length > 0) {
                                statusInfo.faults.forEach(function(fault) {
                                    let row = document.createElement('tr');
                                    row.innerHTML = `<td>${fault.device.id}</td><td>${fault.description}</td><td>${fault.severity}</td>`;
                                    faultTableBody.appendChild(row);
                                });
                            }
                        })
                        .catch(function(error) {
                            console.error("Error obteniendo detalles del vehículo:", error);
                        });
                }
            });

            // Evento para el botón de actualizar
            document.getElementById('refresh-button').addEventListener('click', function() {
                loadVehicles();
            });

            callback(); // ¡Crucial!
        }
    };
};