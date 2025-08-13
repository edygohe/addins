document.addEventListener("DOMContentLoaded", function () {
    const vehicleList = document.getElementById("vehicleList");
    const searchBox = document.getElementById("searchBox");

    // Función para cargar vehículos
    function loadVehicles() {
        api.call("Get", { typeName: "Device" })
            .then(function (result) {
                renderVehicleList(result);
            })
            .catch(function (error) {
                console.error("Error en la llamada a la API:", error);
            });
    }

    // Función para renderizar la lista de vehículos
    function renderVehicleList(vehicles) {
        vehicleList.innerHTML = ""; // Limpiar la lista antes de renderizar
        vehicles.forEach(vehicle => {
            const li = document.createElement("li");
            li.textContent = vehicle.name || "Sin nombre";
            vehicleList.appendChild(li);
        });
    }

    // Delegación de eventos para búsqueda
    searchBox.addEventListener("input", function () {
        const filter = searchBox.value.toLowerCase();
        Array.from(vehicleList.children).forEach(li => {
            if (li.textContent.toLowerCase().includes(filter)) {
                li.style.display = "";
            } else {
                li.style.display = "none";
            }
        });
    });

    loadVehicles(); // Cargar vehículos al inicio
});