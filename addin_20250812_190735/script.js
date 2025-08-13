document.addEventListener("DOMContentLoaded", function() {
    const vehicleList = document.getElementById("vehicleList");
    const issueDetails = document.getElementById("issueDetails");
    const refreshButton = document.getElementById("refreshButton");

    function cargarVehiculos() {
        api.call("Get", { typeName: "Device" })
            .then(function(vehiculos) {
                vehicleList.innerHTML = ""; // Limpiar la lista existente
                vehiculos.forEach(function(vehiculo) {
                    const li = document.createElement("li");
                    li.textContent = `${vehiculo.name} (${vehiculo.diagnosisCount} fallos)`;
                    li.dataset.deviceId = vehiculo.id; // Guardar ID del vehículo en el elemento
                    vehicleList.appendChild(li);
                });
            })
            .catch(function(error) {
                console.error("Error al cargar vehículos:", error);
            });
    }

    vehicleList.addEventListener("click", function(event) {
        if (event.target.tagName === "LI") {
            const deviceId = event.target.dataset.deviceId;
            mostrarDetallesDelFallo(deviceId);
        }
    });

    function mostrarDetallesDelFallo(deviceId) {
        api.call("Get", { typeName: "DiagnosticData", deviceId: deviceId })
            .then(function(detalles) {
                issueDetails.innerHTML = `<h3>Detalles del Fallo</h3>`;
                detalles.forEach(function(diagnostico) {
                    issueDetails.innerHTML += `<p>Codigo: ${diagnostico.code}, Descripción: ${diagnostico.description}, Fecha: ${diagnostico.date}</p>`;
                });
                // Aquí iría también el código para centrar el mapa en el vehículo.
            })
            .catch(function(error) {
                console.error("Error al cargar detalles del fallo:", error);
            });
    }

    refreshButton.addEventListener("click", cargarVehiculos);

    // Cargar vehículos la primera vez
    cargarVehiculos();
});