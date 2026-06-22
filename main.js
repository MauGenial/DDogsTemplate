function fhttpRequest() {
    // 1. Buscamos el botón y el contenedor en el HTML
    const boton = document.querySelector('.btn-random');
    const contenedor = document.getElementById('resultado');

    // 2. Cambiamos el estado del botón para que el usuario sepa que está cargando
    boton.innerText = "Loading... 🐾";
    boton.disabled = true; // Deshabilita el botón para evitar múltiples clics

    // lógica ideal para esperar a la imagen es:
    fetch('https://dog.ceo/api/breeds/image/random')
        .then(response => response.json())
        .then(data => {
            // Creamos el elemento imagen en memoria primero
            const nuevaImagen = document.createElement('img');
            nuevaImagen.src = data.message; // Asignamos la URL del perrito

            // El truco de magia: Esperamos a que el navegador termine de DESCARGAR la imagen
            nuevaImagen.onload = function() {
                contenedor.innerHTML = "";  // Limpiamos el contenedor
                contenedor.appendChild(nuevaImagen); // Insertamos la imagen ya cargada
                
                // 3. Restauramos el botón a su estado original
                boton.innerText = "RandomDog 🐾";
                boton.disabled = false;
            };
        })
        .catch(error => {
            console.error("Error al cargar:", error);
            // Si hay un error, también debemos reactivar el botón
            boton.innerText = "Intentar de nuevo";
            boton.disabled = false;
        });
}
window.onload = function() {
    fhttpRequest(); // Para que no quede tan vacia la pagina
};