document.addEventListener("DOMContentLoaded", function () {
    const vehicleList = document.getElementById("vehicleList");

    // Llamada a la API para obtener los vehículos
    api.call("Get", { typeName: "Device" }, function (result) {
        // Limitar el resultado a los primeros 5 vehículos
        const vehicles = result.slice(0, 5);

        // Generar la lista de vehículos
        vehicles.forEach(vehicle => {
            const listItem = document.createElement("li");
            listItem.textContent = vehicle.name;
            listItem.dataset.id = vehicle.id; // Almacenar el ID en data-id
            vehicleList.appendChild(listItem);
        });
    }, function (error) {
        console.error("Error en la llamada a la API:", error);
    });

    // Delegación de eventos para la lista de vehículos
    vehicleList.addEventListener("click", function (event) {
        if (event.target.tagName === "LI") {
            const vehicleId = event.target.dataset.id;
            alert("ID del vehículo: " + vehicleId);
        }
    });
});