geotab.addin.nombreDelAddin = function (api, state) {
    return {
        initialize: function (api, state, callback) {
            api.call("Get", {
                typeName: "Device",
                resultsLimit: 5
            })
            .then(function (devices) {
                const vehicleList = document.getElementById("vehicleList");
                devices.forEach(function (device) {
                    const listItem = document.createElement("li");
                    listItem.textContent = device.name;
                    listItem.dataset.id = device.id;
                    vehicleList.appendChild(listItem);
                });
                callback(); // Notificar que la inicialización terminó con éxito
            })
            .catch(function (error) {
                console.error("Error al obtener vehículos:", error);
                callback(); // Notificar que hubo un error durante la inicialización
            });

            // Delegación de eventos para manejar clics en la lista
            document.getElementById("vehicleList").addEventListener("click", function (event) {
                if (event.target.tagName === 'LI') {
                    const vehicleId = event.target.dataset.id;
                    alert("ID del vehículo: " + vehicleId);
                }
            });
        }
    };
};