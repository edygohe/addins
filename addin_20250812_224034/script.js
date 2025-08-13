geotab.addin.nombreDelAddin = function (api, state) {
    return {
        initialize: function (api, state, callback) {
            api.call("Get", {
                typeName: "Device",
                resultsLimit: 5
            })
            .then(function (devices) {
                // Lógica para poblar la lista de vehículos
                const vehicleList = document.getElementById("vehicleList");
                devices.forEach(device => {
                    const listItem = document.createElement("li");
                    listItem.textContent = device.name;
                    listItem.dataset.id = device.id; // Almacenar el ID del vehículo en un atributo data
                    vehicleList.appendChild(listItem);
                });
                callback(); // Llamar al callback en caso de éxito
            })
            .catch(function (error) {
                console.error("Error al obtener dispositivos:", error);
                callback(); // Llamar al callback en caso de error
            });

            // Delegación de eventos para manejar clic en los vehículos
            document.getElementById("vehicleList").addEventListener("click", function (event) {
                if (event.target && event.target.matches("li")) {
                    const vehicleId = event.target.dataset.id;
                    alert("ID del vehículo: " + vehicleId); // Mostrar el ID del vehículo
                }
            });
        }
    };
};