/* global geotab */

geotab.addin.mostrarVehiculosEnMapa = function (api, state) {
    'use strict';

    // Variable para almacenar los vehículos una vez cargados.
    let loadedDevices = [];
    let areDevicesLoaded = false;

    /**
     * Añade los vehículos al mapa y centra la vista.
     */
    function showVehiclesOnMap() {
        // No hacer nada si los datos aún no están listos
        if (!areDevicesLoaded || loadedDevices.length === 0) {
            return;
        }

        console.log("Intentando mostrar vehículos en el mapa...");
        const map = state.getMap();

        if (map) {
            console.log("Mapa obtenido. Añadiendo vehículos y centrando la vista.");
            map.add("vehicle", loadedDevices);
            map.fitBounds(loadedDevices);
        } else {
            console.error("No se pudo obtener el objeto del mapa desde 'state'.");
        }
    }

    /**
     * Limpia los vehículos del mapa.
     */
    function clearVehiclesFromMap() {
        console.log("Limpiando vehículos del mapa.");
        const map = state.getMap();
        if (map) {
            map.remove("vehicle");
        }
    }

    return {
        initialize: function (api, state, callback) {
            const addinContainer = document.getElementById('geotabAddin');
            addinContainer.innerHTML = '<h2>Primeros 5 Vehículos</h2><p>Los vehículos se mostrarán en el mapa.</p><ul id="vehicleList"><li>Cargando...</li></ul>';

            api.call("Get", {
                typeName: "Device",
                resultsLimit: 5
            })
            .then(function (devices) {
                const vehicleList = document.getElementById('vehicleList');
                vehicleList.innerHTML = ''; // Limpiar "Cargando..."

                if (!devices || devices.length === 0) {
                    vehicleList.innerHTML = '<li>No se encontraron vehículos.</li>';
                } else {
                    // Guardar los vehículos para usarlos en 'focus'
                    loadedDevices = devices;
                    // Poblar la lista en el Add-In
                    devices.forEach(device => {
                        const li = document.createElement("li");
                        li.textContent = device.name;
                        vehicleList.appendChild(li);
                    });
                }
                
                areDevicesLoaded = true;
                // No llamamos a showVehiclesOnMap() aquí. Esperamos al 'focus'.
                callback(); // ¡Crucial!
            })
            .catch(function (error) {
                console.error("Error al obtener dispositivos:", error);
                document.getElementById('vehicleList').innerHTML = '<li>Error al cargar vehículos.</li>';
                areDevicesLoaded = true; // Marcamos como cargado para no reintentar
                callback(); // ¡Crucial!
            });
        },

        focus: function (api, state) {
            // Cuando el Add-In gana el foco, mostramos los vehículos.
            showVehiclesOnMap();
        },

        blur: function (api, state) {
            // Cuando el Add-In pierde el foco, los limpiamos.
            clearVehiclesFromMap();
        }
    };
};
