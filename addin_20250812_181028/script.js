document.addEventListener('DOMContentLoaded', function() {
    // Delegación de eventos para manejar la interactividad
    document.getElementById('geotabAddin').addEventListener('click', function(event) {
        if (event.target && event.target.id === 'mostrarMensaje') {
            alert('Hola mundo Geotab Génesis');
        }
    });
});