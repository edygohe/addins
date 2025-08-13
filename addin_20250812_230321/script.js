/* global geotab */

/**
 * Add-in que muestra los 5 primeros vehículos en el mapa.
 */
geotab.addin.mostrarVehiculosEnMapa = function (api, state) {
    'use strict';

    return {
        /**
         * Se llama una vez que el Add-In se ha cargado.
         * @param {object} api El objeto API de Geotab.
         * @param {object} state El estado guardado del Add-In.
         * @param {function} callback Callback para notificar que la inicialización ha terminado.
         */
        initialize: function (api, state, callback) {
            const addinContainer = document.getElementById('geotabAddin');
            addinContainer.innerHTML = '<h2>Primeros 5 Vehículos</h2><ul id="vehicleList"><li>Cargando vehículos...</li></ul>';

            api.call("Get", {
                typeName: "Device",
                resultsLimit: 5
            })
            .then(function (devices) {
                if (!devices || devices.length === 0) {
                    document.getElementById('vehicleList').innerHTML = '<li>No se encontraron vehículos.</li>';
                    callback();
                    return;
                }

                // Limpiar la lista de "cargando"
                const vehicleList = document.getElementById('vehicleList');
                vehicleList.innerHTML = '';

                // Poblar la lista en el Add-In
                devices.forEach(device => {
                    const li = document.createElement("li");
                    li.textContent = device.name;
                    vehicleList.appendChild(li);
                });

                // Ahora, interactuar con el mapa
                console.log("Vehículos recibidos, intentando acceder al mapa...");
                
                // La forma correcta de obtener el mapa es a través del objeto 'state'
                var map = state.getMap();
                
                if (map) {
                    console.log("Mapa obtenido. Añadiendo vehículos y centrando la vista.");
                    // Añadir los vehículos al mapa. Geotab espera un array.
                    map.add("vehicle", devices);
                    // Centrar la vista del mapa para que se vean todos los vehículos añadidos.
                    map.fitBounds(devices);
                } else {
                    console.error("No se pudo obtener el objeto del mapa desde 'state'.");
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
            // Lógica a ejecutar cuando el Add-In gana foco (opcional)
        },

        blur: function (api, state) {
            // Lógica a ejecutar cuando el Add-In pierde foco (opcional)
            // Por ejemplo, podríamos limpiar los vehículos del mapa
            var map = state.getMap();
            if (map) {
                map.remove("vehicle");
            }
        }
    };
};
