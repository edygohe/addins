document.addEventListener('DOMContentLoaded', function() {
    const geotabAddin = document.getElementById('geotabAddin');
    
    // Delegación de eventos para futuras interacciones
    geotabAddin.addEventListener('click', function(event) {
        const target = event.target;
        
        // Aquí se podrían agregar interacciones futuras
        // if (target.matches('.alguna-clase')) {
        //     // Lógica para la interacción
        // }

        console.log('Elemento clicado: ', target);
    });
});