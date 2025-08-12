/* global geotab */

/**
 * @returns {object} The Add-In.
 */
geotab.addin.geotabGenesis = function () {
    'use strict';

    return {
        /**
         * Se llama una vez que el Add-In se ha cargado.
         * @param {object} api El objeto API de Geotab.
         * @param {object} state El estado guardado del Add-In.
         */
        initialize: function (api, state, callback) {
            // Llama al callback para indicar que la inicialización básica ha terminado.
            callback();
        },

        focus: function (api, state) {
            const userRequestTextArea = document.getElementById('userRequest');
            const generateButton = document.getElementById('generateButton');

            generateButton.addEventListener('click', async function () {
                const userPrompt = userRequestTextArea.value;
                if (!userPrompt) {
                    alert('Por favor, describe el Add-In que quieres construir.');
                    return;
                }

                // Deshabilitamos el botón para evitar múltiples clics
                generateButton.disabled = true;
                generateButton.textContent = 'Generando...';
                alert('Generación iniciada. El proceso puede tardar unos momentos.');
                console.log('Enviando solicitud al backend:', userPrompt);

                try {
                    const response = await fetch('http://localhost:8000/generate-addin', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ prompt: userPrompt }),
                    });

                    const result = await response.json();
                    console.log('Respuesta del backend:', result);
                    alert(`¡Proceso completado! Los archivos se han generado en la ruta: ${result.output.code_path}`);
                } catch (error) {
                    console.error('Error al contactar el backend:', error);
                    alert('Hubo un error al conectar con el servidor de generación. Asegúrate de que el servidor local esté corriendo.');
                } finally {
                    // Volvemos a habilitar el botón al finalizar, tanto si hay éxito como si hay error
                    generateButton.disabled = false;
                    generateButton.innerHTML = '<span class="icon">✨</span> Generar Add-In';
                }
            });

            // Una vez que el Add-In tiene el foco, le pedimos a la API de Geotab
            // que traduzca todos los elementos que marcamos con data-i18n.
            // Esto reemplaza el texto hardcodeado con el del archivo es.json.
            api.translate(document.getElementById('geotabAddin'));
        }
    };
};
