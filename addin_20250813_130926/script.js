geotab.addin.holaMundoAddin = function (api, state) {
    'use strict';

    return {
        initialize: function (api, state, callback) {
            // Solo se carga un mensaje estático, por lo que no se requieren llamadas a la API
            console.log("Add-In inicializado correctamente con el mensaje: 'Hola mundo Geotab Génesis'");

            callback(); // Llamamos al callback al final de la inicialización
        }
    };
};