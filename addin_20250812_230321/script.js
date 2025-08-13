/* global geotab */

geotab.addin.mostrarVehiculosEnMapa = function (api, state) {
    'use strict';

    let loadedDevices = [];

    /**
     * Añade los vehículos al mapa y centra la vista, solo si es posible.
     * @param {object} currentState El objeto 'state' actualizado del evento.
     */
    function showVehiclesOnMap(currentState) {
        if (loadedDevices.length === 0) {
            return;
        }

        console.log("Intentando mostrar vehículos en el mapa...");
        
        // **LA CORRECCIÓN CLAVE ESTÁ AQUÍ**
        // Verificamos si la función getMap existe ANTES de llamarla.
        // Esto evita el error si el Add-In no está en la página del mapa.
        if (currentState && typeof currentState.getMap === 'function') {
            const map = currentState.getMap();
            if (map) {
                console.log("Mapa obtenido. Añadiendo vehículos y centrando la vista.");
                map.add("vehicle", loadedDevices);
                map.fitBounds(loadedDevices);
            }
        } else {
            console.error("Error: state.getMap no es una función. Asegúrate de que este Add-In se está ejecutando en una página con un mapa (ej: la página de 'Mapa').");
            const addinContainer = document.getElementById('geotabAddin');
            // Añadir un mensaje de error en la UI si aún no existe
            if (addinContainer && !addinContainer.querySelector('.map-error')) {
                const errorMsg = document.createElement('p');
                errorMsg.textContent = 'Este Add-In solo puede mostrar vehículos en la página del mapa.';
                errorMsg.style.color = 'red';
                errorMsg.className = 'map-error'; // Para no añadirlo múltiples veces
                addinContainer.appendChild(errorMsg);
            }
        }
    }

    /**
     * Limpia los vehículos del mapa, solo si es posible.
     * @param {object} currentState El objeto 'state' actualizado del evento.
     */
    function clearVehiclesFromMap(currentState) {
        if (currentState && typeof currentState.getMap === 'function') {
            const map = currentState.getMap();
            if (map) {
                console.log("Limpiando vehículos del mapa.");
                map.remove("vehicle");
            }
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
                vehicleList.innerHTML = ''; 

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
                
                callback();
            })
            .catch(function (error) {
                console.error("Error al obtener dispositivos:", error);
                document.getElementById('vehicleList').innerHTML = '<li>Error al cargar vehículos.</li>';
                callback();
            });
        },

        focus: function (api, state) {
            showVehiclesOnMap(state);
        },

        blur: function (api, state) {
            clearVehiclesFromMap(state);
        }
    };
};
