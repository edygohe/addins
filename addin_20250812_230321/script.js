/* global geotab */

geotab.addin.mostrarVehiculosEnMapa = function (api, state) {
    'use strict';

    // Variable para almacenar los vehículos una vez cargados.
    let loadedDevices = [];

    /**
     * Añade los vehículos al mapa y centra la vista.
     * @param {object} currentState El objeto 'state' actualizado del evento.
     */
    function showVehiclesOnMap(currentState) {
        if (loadedDevices.length === 0) {
            return;
        }

        console.log("Intentando mostrar vehículos en el mapa con el estado actual...");
        const map = currentState.getMap();

        if (map) {
            console.log("Mapa obtenido. Añadiendo vehículos y centrando la vista.");
            map.add("vehicle", loadedDevices);
            map.fitBounds(loadedDevices);
        } else {
            console.error("No se pudo obtener el objeto del mapa desde 'state'. Asegúrate de que el Add-In está en una página con mapa.");
        }
    }

    /**
     * Limpia los vehículos del mapa.
     * @param {object} currentState El objeto 'state' actualizado del evento.
     */
    function clearVehiclesFromMap(currentState) {
        console.log("Limpiando vehículos del mapa.");
        const map = currentState.getMap();
        if (map) {
            map.remove("vehicle");
        }
    }

    return {
        initialize: function (api, state, callback) {
            const addinContainer = document.getElementById('geotabAddin');
            addinContainer.innerHTML = '<h2>Primeros 5 Vehículos</h2><p>Los vehículos se mostrarán en el mapa cuando esta ventana tenga el foco.</p><ul id="vehicleList"><li>Cargando...</li></ul>';

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
                    loadedDevices = devices;
                    devices.forEach(device => {
                        const li = document.createElement("li");
                        li.textContent = device.name;
                        vehicleList.appendChild(li);
                    });
                }
                
                callback(); // ¡Crucial!
            })
            .catch(function (error) {
                console.error("Error al obtener dispositivos:", error);
                document.getElementById('vehicleList').innerHTML = '<li>Error al cargar vehículos.</li>';
                callback(); // ¡Crucial!
            });
        },

        focus: function (api, state) {
            // Cuando el Add-In gana el foco, usamos el 'state' de este evento.
            showVehiclesOnMap(state);
        },

        blur: function (api, state) {
            // Cuando el Add-In pierde el foco, usamos el 'state' de este evento.
            clearVehiclesFromMap(state);
        }
    };
};
