geotab.addin.vehiculosAddin = function (api, state) {
    'use strict';

    return {
        initialize: function (api, state, callback) {
            // Obtener la lista de vehículos
            api.call("Get", { typeName: "Device", resultsLimit: 5 })
                .then(function(devices) {
                    const vehicleList = document.getElementById("vehicle-list");
                    vehicleList.innerHTML = ""; // Limpiar la lista antes de llenarla

                    devices.forEach(function(device) {
                        const listItem = document.createElement("li");
                        listItem.textContent = device.name; // Nombre del vehículo
                        listItem.dataset.id = device.id; // ID del vehículo
                        vehicleList.appendChild(listItem); // Añadir a la lista
                    });
                })
                .catch(function(error) {
                    console.error("Error obteniendo la lista de vehículos:", error);
                    const vehicleList = document.getElementById("vehicle-list");
                    vehicleList.innerHTML = "<li>Error al cargar vehículos.</li>";
                })
                .finally(() => {
                    callback(); // Llamar al callback al final
                });

            // Delegación de eventos para la lista de vehículos
            document.getElementById("vehicle-list").addEventListener("click", function(event) {
                if (event.target.tagName === "LI") {
                    const vehicleId = event.target.dataset.id;
                    const vehicleName = event.target.textContent;
                    alert("Nombre del Vehículo: " + vehicleName + "\nID: " + vehicleId);
                }
            });
        }
    };
};