document.addEventListener('DOMContentLoaded', function() {
    // Mostrar el mensaje después de que el DOM esté completamente cargado
    const messageContainer = document.getElementById('message-container');
    messageContainer.textContent = "Hola mundo Geotab Génesis";

    // Ejemplo de manejo de eventos (no utilizado en este caso simple, pero incluido para mostrar la técnica de delegación)
    // document.getElementById('geotabAddin').addEventListener('click', function(event) {
    //     if (event.target.tagName === 'LI') {
    //         // Manejar el click en un elemento LI
    //     }
    // });
});

// Ejemplo de llamada a la API Geotab (no necesaria para este Add-In simple, pero se incluye para mostrar la forma correcta)
// api.call("Get", { typeName: "Device" })
//     .then(function (result) {
//         console.log("Datos recibidos:", result);
//     })
//     .catch(function (error) {
//         console.error("Error en la llamada a la API:", error);
//     });