document.addEventListener('DOMContentLoaded', function() {
    // Llamada a la API para obtener los vehículos
    api.call("Get", { typeName: "Device" })
        .then(function(result) {
            // Usamos solo los primeros 5 vehículos
            const vehicles = result.slice(0, 5);
            const vehicleList = document.getElementById('vehicleList');

            // Crear elementos de lista e insertarlos en el DOM
            vehicles.forEach(function(vehicle) {
                const li = document.createElement('li');
                li.textContent = vehicle.name; // Nombre del vehículo
                li.setAttribute('data-id', vehicle.id); // ID del vehículo en un atributo
                vehicleList.appendChild(li);
            });
        })
        .catch(function(error) {
            console.error("Error en la llamada a la API:", error);
        });

    // Delegación de eventos para manejar clics en la lista de vehículos
    document.getElementById('vehicleList').addEventListener('click', function(event) {
        if (event.target.tagName === 'LI') {
            const vehicleId = event.target.getAttribute('data-id');
            // Mostrar alerta con el ID del vehículo
            alert(`ID del vehículo: ${vehicleId}`);
        }
    });
});