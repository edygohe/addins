geotab.addin.initialize = function(context) {
    // Esta función se ejecuta cuando el Add-In se inicializa.
    // Aquí se puede acceder al contexto de Geotab (context) para obtener datos.
    // Para este ejemplo, no se necesita acceder a ningún dato de Geotab.

    // Ejemplo de cómo obtener datos de usuario (requiere permisos):
    // geotab.addin.get(geotab.addin.context.user, function(user) {
    //     console.log("Usuario:", user);
    // });

    console.log("Add-in 'Hola Mundo Geotab' inicializado.");
};


geotab.addin.onLogout = function() {
    // Esta función se ejecuta cuando el usuario cierra sesión.
    console.log("Usuario ha cerrado sesión.");
};

geotab.addin.onError = function(error) {
    // Esta función se ejecuta si ocurre un error.
    console.error("Error:", error);
};