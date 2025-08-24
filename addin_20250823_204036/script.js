geotab.addin.alertAddin = function (api, state) {
    'use strict';

    return {
        initialize: function (api, state, callback) {
            const alertButton = document.getElementById('alertButton');

            // Usar delegación de eventos para el botón de alerta
            alertButton.addEventListener('click', function() {
                alert("Hola Mima! que bueno que veniste");
            });

            callback(); // Llamar a callback al final
        }
    };
};