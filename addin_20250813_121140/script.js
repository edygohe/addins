geotab.addin.vehicleListAddin = function (api, state) {
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
                    if (!devices || devices.length === 0) {
                        document.getElementById("vehicle-list").innerHTML = "<li>No hay vehículos disponibles.</li>";
                        return Promise.resolve([]);
                    }
                    
                    const vehicleList = devices.map(device => `<li data-id="${device.id}">${device.name}</li>`);
                    document.getElementById("vehicle-list").innerHTML = vehicleList.join('');

                    // Añadir marcadores en el mapa
                    devices.forEach(function(device) {
                        // Suponiendo que se puede acceder a la latitud y longitud aquí
                        if (device.latitude !== undefined && device.longitude !== undefined) {
                            L.marker([device.latitude, device.longitude]).addTo(map)
                                .bindPopup(device.name);
                        }
                    });
                })
                .catch(function(error) {
                    console.error("Error al obtener los vehículos:", error);
                    document.getElementById("vehicle-list").innerHTML = "<li>Error al cargar vehículos.</li>";
                })
                .finally(() => {
                    callback(); // ¡Crucial!
                });

            // 4. Delegación de eventos para la lista de vehículos
            document.getElementById("vehicle-list").addEventListener("click", function(event) {
                if (event.target.tagName === 'LI') {
                    const vehicleId = event.target.getAttribute('data-id');
                    const vehicleName = event.target.textContent;
                    alert(`Vehículo seleccionado:\nNombre: ${vehicleName}\nID: ${vehicleId}`);
                }
            });
        }
    };
};