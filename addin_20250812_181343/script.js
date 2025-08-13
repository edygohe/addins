document.addEventListener('DOMContentLoaded', function() {
    const vehicleListElement = document.getElementById('vehicleList');

    // Simula la llamada a la API de Geotab para recuperar los vehículos
    function obtenerVehiculos() {
        // En un caso real, aquí se realiza la llamada a la API
        return [
            { id: '1', nombre: 'Vehículo A' },
            { id: '2', nombre: 'Vehículo B' },
            { id: '3', nombre: 'Vehículo C' },
            { id: '4', nombre: 'Vehículo D' },
            { id: '5', nombre: 'Vehículo E' }
        ];
    }

    function agregarVehiculosALista(vehiculos) {
        vehiculos.forEach(vehiculo => {
            const li = document.createElement('li');
            li.textContent = vehiculo.nombre;
            li.dataset.id = vehiculo.id; // Almacena el ID en un atributo de datos
            vehicleListElement.appendChild(li);
        });
    }

    // Maneja el evento clic en la lista de vehículos
    vehicleListElement.addEventListener('click', function(event) {
        // Verifica que se haga clic en un elemento de la lista
        if (event.target.tagName === 'LI') {
            const idVehiculo = event.target.dataset.id; // Obtiene el ID del vehículo
            alert('ID del vehículo: ' + idVehiculo);
        }
    });

    // Recupera los vehículos y los agrega a la lista
    const vehiculos = obtenerVehiculos();
    agregarVehiculosALista(vehiculos);
});