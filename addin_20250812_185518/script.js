document.addEventListener('DOMContentLoaded', function() {
    // Llamada a la API para obtener los primeros 5 vehículos
    api.call("Get", {"typeName": "Device", "limit": 5}, function(result) {
        const vehicleList = document.getElementById('vehicleList');
        vehicleList.innerHTML = ""; // Limpiar la lista antes de agregar los vehículos

        result.forEach(function(vehicle) {
            const listItem = document.createElement('li');
            listItem.textContent = vehicle.name; // Mostrar el nombre del vehículo
            
            // Ámbito de clic en el elemento de la lista
            listItem.dataset.vehicleId = vehicle.id; // Guardar el ID del vehículo
            vehicleList.appendChild(listItem);
        });
    }, function(error) {
        console.error(error);
    });

    // Delegación de eventos para manejar clics en la lista de vehículos
    document.getElementById('vehicleList').addEventListener('click', function(event) {
        if (event.target.tagName === 'LI') {
            const vehicleId = event.target.dataset.vehicleId; // Obtener el ID del vehículo al que se hizo clic
            alert("ID del vehículo: " + vehicleId);
        }
    });
});