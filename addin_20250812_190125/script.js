document.addEventListener('DOMContentLoaded', function() {
    // Llamada a la API para obtener vehículos
    api.call("Get", { typeName: "Device" }, function(result) {
        // Filtrar los primeros 5 vehículos y llenar la lista
        const vehicleList = document.getElementById('vehicleList');
        const vehicles = result.slice(0, 5);
        
        vehicles.forEach(function(vehicle) {
            const li = document.createElement('li');
            li.textContent = vehicle.name; // Mostrar el nombre del vehículo
            li.dataset.id = vehicle.id; // Almacenar el ID del vehículo en un atributo de datos
            vehicleList.appendChild(li);
        });
    }, function(error) {
        console.error('Error al obtener vehículos:', error);
    });

    // Delegación de eventos para manejar clics en la lista de vehículos
    document.getElementById('vehicleList').addEventListener('click', function(event) {
        if (event.target.tagName === 'LI') {
            const vehicleId = event.target.dataset.id; // Obtener el ID del atributo de datos
            alert('ID del vehículo: ' + vehicleId); // Mostrar alerta con el ID
        }
    });
});