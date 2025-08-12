geotab.addin.initialize = function (context) {
    // Obtener los datos de los 5 primeros vehículos
    geotab.api.call('Get', '/api/fleet/vehicles', {
        limit: 5,
        sort: 'creationDate' // Ejemplo de ordenación
    }).then(function (response) {
        if (response.data && response.data.length > 0) {
            const vehicleList = document.getElementById('vehicleList');
            response.data.forEach(vehicle => {
                const listItem = document.createElement('li');
                listItem.textContent = vehicle.name;
                listItem.dataset.vehicleId = vehicle.id; // Almacenar el ID en el dataset
                vehicleList.appendChild(listItem);
            });

            // Delegación de eventos para clicks en la lista
            vehicleList.addEventListener('click', function(event) {
                if (event.target.tagName === 'LI') {
                    const vehicleId = event.target.dataset.vehicleId;
                    showModal(vehicleId);
                }
            });
        } else {
            showError("No se encontraron vehículos.");
        }
    }).catch(function (error) {
        showError("Error al conectar con la API de Geotab: " + error.message);
    });
};

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// Función para mostrar el modal con el ID del vehículo
function showModal(vehicleId) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.innerHTML = `
        <span class="close">&times;</span>
        <p>ID del vehículo: ${vehicleId}</p>
    `;
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Agregar evento para cerrar el modal
    const closeButton = modal.querySelector('.close');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}