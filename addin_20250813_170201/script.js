geotab.addin.simpleAddin = function(api, state) {
    'use strict';

    return {
        initialize: function(api, state, callback) {
            // Aquí podrías incluir lógica adicional si fuera necesaria en el futuro.
            console.log("Add-In inicializado correctamente.");
            callback(); // Llamada al callback para indicar que la inicialización ha finalizado.
        }
    };
};