document.addEventListener('DOMContentLoaded', function () {
    // Aquí podríamos incluir lógica adicional si es necesario en el futuro

    // Ejemplo de uso de la API de Geotab (se puede modificar para otras funcionalidades)
    api.call("Get", { typeName: "Device" })
        .then(function (result) {
            console.log("Datos recibidos:", result);
            // Aquí se podrían manipular los resultados obtenidos de la API
        })
        .catch(function (error) {
            console.error("Error en la llamada a la API:", error);
        });
});