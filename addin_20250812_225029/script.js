geotab.addin.vehiculosAddIn = function (api, state) {
    return {
        initialize: function (api, state, callback) {
            api.call("Get", {
                typeName: "Device",
                resultsLimit: 5
            })
            .then(function (devices) {
                // Lógica de éxito aquí. Poblar la lista de vehículos.
                const vehicleList = document.getElementById("vehicleList");
                devices.forEach(function (device) {
                    const listItem = document.createElement("li");
                    listItem.textContent = device.name;
                    listItem.dataset.id = device.id; // Almacenar el ID en el dataset
                    vehicleList.appendChild(listItem);
                });
                
                // ¡Llamar al callback es crucial!
                callback();
            })
            .catch(function (error) {
                // Lógica de error aquí.
                console.error("Error al obtener dispositivos:", error);
                callback();
            });

            // Delegación de eventos para manejar clics en la lista
            document.getElementById("vehicleList").addEventListener("click", function (event) {
                if (event.target.tagName === "LI") {
                    const vehicleId = event.target.dataset.id;
                    alert("ID del vehículo seleccionado: " + vehicleId);
                }
            });
        }
    };
};