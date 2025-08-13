document.addEventListener('DOMContentLoaded', function() {
    const vehicleListElement = document.getElementById('vehicleList');

    // Función para obtener los vehículos de la API de Geotab
    async function fetchVehicles() {
        try {
            // Simulación de la API de Geotab para obtener los vehículos
            const response = await fetch('https://api.geotab.com/v1/vehicles?limit=5');
            const vehicles = await response.json();

            // Construir la lista de vehículos
            vehicles.forEach(vehicle => {
                const listItem = document.createElement('li');
                listItem.textContent = vehicle.name; // Asumimos que vehicle tiene una propiedad 'name'
                listItem.dataset.id = vehicle.id; // Guardamos el ID único en un atributo de datos
                vehicleListElement.appendChild(listItem);
            });
        } catch (error) {
            console.error('Error al obtener los vehículos:', error);
        }
    }

    // Delegación de eventos para la lista
    vehicleListElement.addEventListener('click', function(event) {
        if (event.target.tagName === 'LI') {
            const vehicleId = event.target.dataset.id;
            alert(`ID del vehículo: ${vehicleId}`);
        }
    });

    // Llamar a la función para cargar los vehículos
    fetchVehicles();
});