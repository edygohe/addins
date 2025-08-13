document.addEventListener('DOMContentLoaded', function() {
    const vehiculosConFallos = document.getElementById('vehiculosConFallos');
    const tablaDetalles = document.getElementById('tablaDetalles').getElementsByTagName('tbody')[0];
    const refreshButton = document.getElementById('refreshButton');

    // Simulación de datos de fallos (esto debe ser reemplazado con una llamada a la API de Geotab)
    const vehiculos = [
        { id: 1, nombre: 'Vehículo A', fallos: [{ codigo: 'F001', descripcion: 'Fallo del motor', fecha: '2023-10-01', severidad: 'alta' }] },
        { id: 2, nombre: 'Vehículo B', fallos: [{ codigo: 'F002', descripcion: 'Fallo en la transmisión', fecha: '2023-10-02', severidad: 'media' }] },
        { id: 3, nombre: 'Vehículo C', fallos: [{ codigo: 'F003', descripcion: 'Problema con frenos', fecha: '2023-10-03', severidad: 'baja' }] },
    ];

    function mostrarVehiculos() {
        vehiculosConFallos.innerHTML = '';
        vehiculos.forEach(vehiculo => {
            const li = document.createElement('li');
            const estado = document.createElement('div');
            estado.className = 'estado';
            estado.style.backgroundColor = obtenerColorEstado(vehiculo.fallos);
            li.appendChild(estado);
            li.appendChild(document.createTextNode(vehiculo.nombre));
            li.dataset.id = vehiculo.id;
            vehiculosConFallos.appendChild(li);
        });
    }

    function obtenerColorEstado(fallos) {
        const severidades = fallos.map(fallo => fallo.severidad);
        if (severidades.includes('alta')) return 'red';
        if (severidades.includes('media')) return 'yellow';
        return 'green';
    }
    
    vehiculosConFallos.addEventListener('click', function(e) {
        if (e.target.tagName === 'LI' || e.target.parentNode.tagName === 'LI') {
            const vehiculoId = e.target.closest('li').dataset.id;
            mostrarDetallesFallo(vehiculoId);
        }
    });

    function mostrarDetallesFallo(vehiculoId) {
        tablaDetalles.innerHTML = '';
        const vehiculo = vehiculos.find(v => v.id == vehiculoId);
        vehiculo.fallos.forEach(fallo => {
            const row = tablaDetalles.insertRow();
            row.insertCell(0).innerText = fallo.codigo;
            row.insertCell(1).innerText = fallo.descripcion;
            row.insertCell(2).innerText = fallo.fecha;
        });
    }

    refreshButton.addEventListener('click', function() {
        // Aquí se debe realizar la lógica para actualizar la lista de vehículos usando la API de Geotab.
        mostrarVehiculos();
    });

    mostrarVehiculos();
});