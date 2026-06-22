
// URLs de los elementos del HTML
const imgIzq = document.getElementById('img-izq');
const imgDer = document.getElementById('img-der');
const contenedorIzq = document.getElementById('perro-izq');
const contenedorDer = document.getElementById('perro-der');
const overlayIzq = document.getElementById('overlay-izq');
const overlayDer = document.getElementById('overlay-der');
const breedIzq = document.getElementById('breed-izq');
const breedDer = document.getElementById('breed-der');

const overlayTimeouts = {};

function getBreedNameFromUrl(url) {
    try {
        const match = url.match(/\/breeds\/([^/]+)/);
        if (match && match[1]) {
            const breed = match[1];
            return breed.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }
    } catch (error) {
        console.error('Error al extraer el nombre de la raza:', error);
    }
    return 'Raza desconocida';
}

function showOverlay(lado, type) {
    const overlay = lado === 'izq' ? overlayIzq : overlayDer;
    if (!overlay) return;
  
    const icon = type === 'select' ? '✓' : '✕';
    overlay.textContent = icon;
    overlay.className = `overlay ${type}`;

    clearTimeout(overlayTimeouts[lado]);
    overlay.classList.remove('show');

    requestAnimationFrame(() => {
        overlay.classList.add('show');
    });

    overlayTimeouts[lado] = setTimeout(() => {
        overlay.classList.remove('show');
    }, 1500);
}

// Función auxiliar para obtener una URL de imagen de perro desde la API
async function obtenerUrlPerroAleatorio() {
    try {
        const response = await fetch('https://dog.ceo/api/breeds/image/random');
        const data = await response.json();
        return data.message; // Devuelve la URL de la imagen
    } catch (error) {
        console.error("Error al obtener perro:", error);
        return "https://placehold.co/280x280/000/aaa/?text=Error+al+cargar";
    }
}

// Función para cargar una nueva imagen en un lado específico esperando a que descargue
async function cargarNuevoPerro(lado) {
    const imgElement = lado === 'izq' ? imgIzq : imgDer;
    const contenedor = lado === 'izq' ? contenedorIzq : contenedorDer;
    const breedElement = lado === 'izq' ? breedIzq : breedDer;

    // Ponemos el contenedor en estado "cargando" (opacidad)
    contenedor.classList.add('cargando');

    const nuevaUrl = await obtenerUrlPerroAleatorio();
    imgElement.src = nuevaUrl;

    const breedName = getBreedNameFromUrl(nuevaUrl);
    breedElement.textContent = breedName;

    // Esperamos a que la imagen se descargue por completo antes de quitar el efecto de carga
    imgElement.onload = () => {
        contenedor.classList.remove('cargando');
    };
}

// Esta función corre cuando haces click en un perro
function elegirPerro(ladoElegido) {
    const ladoNoElegido = ladoElegido === 'izq' ? 'der' : 'izq';

    showOverlay(ladoElegido, 'select');
    showOverlay(ladoNoElegido, 'reject');

    // Si el usuario eligió el izquierdo, el derecho desaparece y se actualiza
    if (ladoElegido === 'izq') {
        cargarNuevoPerro('der');
    } 
    // Si eligió el derecho, el izquierdo desaparece y se actualiza
    else if (ladoElegido === 'der') {
        cargarNuevoPerro('izq');
    }
}

// INICIALIZACIÓN: Cuando la página carga por primera vez, pedimos los dos perros
window.onload = () => {
    cargarNuevoPerro('izq');
    cargarNuevoPerro('der');
};
