/* global geotab */

geotab.addin.mostrarVehiculosEnMapa = function (api, state) {
    'use strict';

    // Almacenaremos DeviceStatusInfo, que incluye coordenadas.
    let loadedDeviceStatusInfo = [];

    /**
     * Añade los vehículos al mapa y centra la vista.
     * @param {object} currentState El objeto 'state' actualizado del evento.
     */
    function showOnMap(currentState) {
        if (loadedDeviceStatusInfo.length === 0) return;

        if (currentState && typeof currentState.getMap === 'function') {
            const map = currentState.getMap();
            if (map) {
                console.log("Mapa obtenido. Añadiendo vehículos y centrando la vista.");
                // Pasamos los DeviceStatusInfo al mapa. La API del mapa sabe cómo manejarlos.
                map.add("vehicle", loadedDeviceStatusInfo);
                map.fitBounds(loadedDeviceStatusInfo);
            }
        } else {
            console.error("state.getMap no es una función. El Add-In debe estar en una página con mapa.");
        }
    }

    /**
     * Limpia los vehículos del mapa.
     * @param {object} currentState El objeto 'state' actualizado del evento.
     */
    function clearFromMap(currentState) {
        if (currentState && typeof currentState.getMap === 'function') {
            const map = currentState.getMap();
            if (map) {
                map.remove("vehicle");
            }
        }
    }

    return {
        initialize: function (api, state, callback) {
            const addinContainer = document.getElementById('geotabAddin');
            addinContainer.innerHTML = '<h2>Primeros 5 Vehículos</h2><p>Los vehículos se mostrarán en el mapa.</p><ul id="vehicleList"><li>Cargando...</li></ul>';

            // Paso 1: Obtener los primeros 5 dispositivos.
            api.call("Get", {
                typeName: "Device",
                resultsLimit: 5
            })
            .then(function (devices) {
                if (!devices || devices.length === 0) {
                    document.getElementById('vehicleList').innerHTML = '<li>No se encontraron vehículos.</li>';
                    // Resolvemos la promesa con un array vacío para que la cadena no se rompa.
                    return Promise.resolve([]);
                }

                // Poblar la lista en la UI
                const vehicleList = document.getElementById('vehicleList');
                vehicleList.innerHTML = '';
                devices.forEach(device => {
                    const li = document.createElement("li");
                    li.textContent = device.name;
                    vehicleList.appendChild(li);
                });

                // Paso 2: Obtener la información de estado (incluidas las coordenadas) para esos dispositivos.
                const deviceIds = devices.map(d => d.id);
                return api.call("Get", {
                    typeName: "DeviceStatusInfo",
                    search: {
                        deviceSearch: {
                            ids: deviceIds
                        }
                    }
                });
            })
            .then(function (deviceStatusInfos) {
                // Guardamos los resultados para usarlos en 'focus'.
                loadedDeviceStatusInfo = deviceStatusInfos || [];
                console.log("Información de estado de los vehículos cargada:", loadedDeviceStatusInfo);
                callback();
            })
            .catch(function (error) {
                console.error("Error durante la inicialización:", error);
                document.getElementById('vehicleList').innerHTML = '<li>Error al cargar datos.</li>';
                callback();
            });
        },

        focus: function (api, state) {
            showOnMap(state);
        },

        blur: function (api, state) {
            clearFromMap(state);
        }
    };
};
