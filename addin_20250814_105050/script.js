geotab.addin.simpleAddin = function (api, state) {
    'use strict';

    return {
        initialize: function (api, state, callback) {
            // Mostrar el mensaje al cargar el Add-In
            const messageElement = document.getElementById('message');
            messageElement.textContent = "Hola mundo Geotab Génesis";

            // Aquí se podría incluir lógica adicional en caso de ser necesario
            
            callback(); // ¡Crucial!
        }
    };
};