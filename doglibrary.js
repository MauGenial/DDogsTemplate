const gridRazas = document.getElementById('grid-razas');
const modal = document.getElementById('mi-modal');
const modalImg = document.getElementById('modal-img');
const modalTitulo = document.getElementById('modal-titulo');
const modalTexto = document.getElementById('modal-texto');
const buscador = document.getElementById('buscador'); // Elemento del buscador

// Función principal que renderiza la biblioteca
async function cargarBiblioteca() {
    try {
        const response = await fetch('https://dog.ceo/api/breeds/list/all');
        const data = await response.json();
        
        const listaRazas = Object.keys(data.message); 
        const razasPrincipales = listaRazas;

        for (const raza of razasPrincipales) {
            // 1. Creamos la estructura base de la tarjeta
            const tarjeta = document.createElement('div');
            tarjeta.classList.add('tarjeta-perro');
            tarjeta.onclick = () => abrirModalConRaza(raza);

            // 2. Creamos el contenedor especial para la foto y las flechas flotantes
            const contenedorFoto = document.createElement('div');
            contenedorFoto.classList.add('contenedor-foto-tarjeta');

            const img = document.createElement('img');
            img.alt = `Foto de ${raza}`;

            // Creación de la flecha izquierda
            const btnIzq = document.createElement('button');
            btnIzq.classList.add('flecha-carrusel', 'flecha-izq');
            btnIzq.innerText = '‹';
            btnIzq.onclick = (event) => {
                event.stopPropagation(); // Evita que se abra el modal al clickear la flecha
                obtenerImagenRaza(raza, img); // Carga otra foto aleatoria
            };

            // Creación de la flecha derecha
            const btnDer = document.createElement('button');
            btnDer.classList.add('flecha-carrusel', 'flecha-der');
            btnDer.innerText = '›';
            btnDer.onclick = (event) => {
                event.stopPropagation(); // Evita que se abra el modal al clickear la flecha
                obtenerImagenRaza(raza, img); // Carga otra foto aleatoria
            };

            // Metemos la imagen y las flechas dentro de su contenedor flotante
            contenedorFoto.appendChild(btnIzq);
            contenedorFoto.appendChild(img);
            contenedorFoto.appendChild(btnDer);

            // 3. Creamos el texto inferior con el nombre
            const nombre = document.createElement('p');
            nombre.innerText = raza;

            // Ensamblamos la tarjeta final
            tarjeta.appendChild(contenedorFoto);
            tarjeta.appendChild(nombre);
            gridRazas.appendChild(tarjeta);

            // Buscamos la primera imagen inicial de la raza
            obtenerImagenRaza(raza, img);
        }

    } catch (error) {
        console.error("Error al cargar la biblioteca:", error);
    }
}

// Función encargada de buscar la foto de una raza en específico
async function obtenerImagenRaza(raza, elementoImg) {
    try {
        const response = await fetch(`https://dog.ceo/api/breed/${raza}/images/random`);
        const data = await response.json();
        elementoImg.src = data.message;
    } catch (error) {
        console.error(`Error buscando foto para ${raza}:`, error);
        elementoImg.src = "https://via.placeholder.com/220x200?text=No+Photo";
    }
}

// --- LÓGICA DE CONTROL DEL MODAL ---
async function abrirModalConRaza(raza) {
    modal.style.display = 'flex';
    modalTitulo.innerText = raza;
    modalImg.src = "https://placehold.co/280x280/000/aaa/?text=Loading+Dog";
    let data = {"data": {"attributes": {"name": "Unknown", "description": "Information not available for this breed.","life": {"max": "?","min": "?"},"male_weight": {"max": "?","min": "?"},"female_weight": {"max": "?","min": "?"}}}};

    /* Traer detalle de dogapi.dog para mostrar en el modal */
    const aID = obtenerIdPorNombre(raza);
        if (aID !== 'NotFound') {
            try {
            const response = await fetch(`https://dogapi.dog/api/v2/breeds/${aID}`);
            data = await response.json();
            console.log("Información de la raza obtenida:", data);
        } catch (error) {
            console.error("Error cargando la data de raza:", error);
        }
    }
    /* Construcción del texto del modal con la información obtenida */
    modalTexto.innerHTML = `
        <p>📋 <strong>Information:</strong> ${data.data.attributes.description}</p>
        <p>❤️ <strong>Lifespan:</strong> Between ${data.data.attributes.life.min}-${data.data.attributes.life.max} years</p>
        <p>🦴 <strong>Weight:</strong> ${data.data.attributes.male_weight.min}-${data.data.attributes.male_weight.max} kg</p>
`;

    try {
        const response = await fetch(`https://dog.ceo/api/breed/${raza}/images/random`);
        const data = await response.json();
        modalImg.src = data.message;
    } catch (error) {
        console.error("Error cargando la foto del modal:", error);
        modalImg.src = "https://via.placeholder.com/280x280?text=Error+al+cargar";
    }
}

function cerrarModal() {
    modal.style.display = 'none';
}

function cerrarModalFondo(event) {
    if (event.target === modal) {
        cerrarModal();
    }
}

// --- LÓGICA DEL BUSCADOR (FILTRO EN TIEMPO REAL) ---
buscador.addEventListener('input', (event) => {
    const textoBusqueda = event.target.value.toLowerCase();
    const tarjetas = document.querySelectorAll('.tarjeta-perro');

    tarjetas.forEach(tarjeta => {
        const nombreRaza = tarjeta.querySelector('p').innerText.toLowerCase();

        if (nombreRaza.includes(textoBusqueda)) {
            tarjeta.style.display = 'block';
        } else {
            tarjeta.style.display = 'none';
        }
    });
});

// --- LÓGICA DEL BOTÓN "IR ARRIBA" ---
const btnSubir = document.getElementById('btnSubir');

window.onscroll = function() {
    detectarScroll();
};

function detectarScroll() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        btnSubir.style.display = "flex";
    } else {
        btnSubir.style.display = "none";
    }
}

function subirArriba() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

window.onload = cargarBiblioteca;

function obtenerIdPorNombre(nombre) {
  const match = dogBreed.raza.find(item => item.nombre === nombre);
  return match ? match.id : 'NotFound';
}


/* Estructura de datos con las razas y sus IDs para poder obtener la información de cada raza desde dogapi.dog */
const dogBreed = {
  "raza": [
    { id: "036feed0-da8a-42c9-ab9a-57449b530b13", nombre: "affenpinscher" },
    { id: "1ceaee48-1374-4b11-9c66-173cce6f5da5", nombre: "african" },
    { id: "1460844f-841c-4de8-b788-271aa4d63224", nombre: "airedale" },
    { id: "e7e99424-d514-4b56-9f0c-05736f6dd22d", nombre: "akita" },
    { id: "b56e4273-9ec0-4274-831d-b238225f8fb6", nombre: "appenzeller" },
    { id: "0543cf54-a255-402e-84e5-f440cc2a67cc", nombre: "australian" },
    { id: "NotFound", nombre: "bakharwal" },
    { id: "edf3d596-e83b-4ba1-972b-d1144a39cf3c", nombre: "basenji" },
    { id: "d8621d92-6558-451c-8631-a32e767026a0", nombre: "beagle" },
    { id: "4823c4e3-d4bf-4cd3-ac6c-88fb2d8a4cdd", nombre: "bluetick" },
    { id: "0d84dcb0-2eb9-41fe-882a-29e140dd0822", nombre: "borzoi" },
    { id: "4ddbe251-72af-495e-8e9d-869217e1d92a", nombre: "bouvier" },
    { id: "08c9fafe-fc77-4da8-9824-05f64910a8e1", nombre: "boxer" },
    { id: "NotFound", nombre: "brabancon" },
    { id: "3bf9ff15-c5ac-41d4-8266-2e0fe48329d3", nombre: "briard" },
    { id: "bf7bd04b-b5fb-4195-b793-81c8e08c5839", nombre: "buhund" },
    { id: "0a8e3eb0-8a37-4734-ad51-c3002c18fd19", nombre: "bulldog" },
    { id: "0c6755a1-3877-4933-bc6d-08b8d197cefb", nombre: "bullterrier" },
    { id: "0543cf54-a255-402e-84e5-f440cc2a67cc", nombre: "cattledog" },
    { id: "9ca8f849-4979-4634-80bc-949692635577", nombre: "cavapoo" },
    { id: "092dae18-86f4-4b41-a3f8-f57fab2f6f2c", nombre: "chihuahua" },
    { id: "861977df-b35a-49c4-b155-e9d29bbd2f0d", nombre: "chippiparai" },
    { id: "03c728a4-258a-4c31-8a1e-5c5e89455cdb", nombre: "chow" },
    { id: "3c7ca8f4-175f-4d55-bedb-5c53907340f9", nombre: "clumber" },
    { id: "NotFound", nombre: "cockapoo" },
    { id: "6b57d7c1-553d-4f46-b33b-c9c5a3a67c96", nombre: "collie" },
    { id: "4524645f-dda7-4031-9272-dee29f5f91ea", nombre: "coonhound" },
    { id: "84070958-0e6d-46e8-8c20-ee8b4f136b78", nombre: "corgi" },
    { id: "1ed6a742-ac64-4f53-8f52-9eb48bef560a", nombre: "cotondetulear" },
    { id: "db7a3ede-d877-4e6f-bd98-8c9ba9ff1d8d", nombre: "dachshund" },
    { id: "9ca1f843-4cad-45b3-847f-bc7975864b1d", nombre: "dalmatian" },
    { id: "eb5988dd-6ffe-453f-9ded-206c9a9026ed", nombre: "dane" },
    { id: "ac379a19-fc5b-48bc-958e-4c3c39590ac8", nombre: "danish" },
    { id: "861977df-b35a-49c4-b155-e9d29bbd2f0d", nombre: "deerhound" },
    { id: "NotFound", nombre: "dhole" },
    { id: "NotFound", nombre: "dingo" },
    { id: "29fac412-58f8-44c4-8a47-77527e55123b", nombre: "doberman" },
    { id: "5b89a1a3-549f-4166-b6c7-188926b89caa", nombre: "elkhound" },
    { id: "27ab345b-4e04-483f-bfdb-2a0031174a79", nombre: "entlebucher" },
    { id: "e1c0664d-aa61-4c85-970d-6c86ba197bee", nombre: "eskimo" },
    { id: "36e2aeb0-28a2-4052-bf97-788ceb5243dc", nombre: "finnish" },
    { id: "5ba3c057-7190-42b4-a9dc-209b9b7130ee", nombre: "frise" },
    { id: "NotFound", nombre: "gaddi" },
    { id: "74a2d74a-48a3-4281-a473-abfcd59a0d60", nombre: "german" },
    { id: "305408b2-c3a8-4ec8-99f0-33b865dfaeb6", nombre: "greyhound" },
    { id: "7ee19070-1a62-40e4-95d8-3b33ef87c9ef", nombre: "groenendael" },
    { id: "feaa80fe-68bc-42b9-b2b5-2220ec4ff615", nombre: "havanese" },
    { id: "dd9362cc-52e0-462d-b856-fccdcf24b140", nombre: "hound" },
    { id: "e0561c26-6d8b-42ae-88df-3047873e929a", nombre: "husky" },
    { id: "df58876a-a3b9-4737-8b0e-90b422e9aa6b", nombre: "keeshond" },
    { id: "2adf5a19-028d-4993-8044-4571008b6d49", nombre: "kelpie" },
    { id: "NotFound", nombre: "kombai" },
    { id: "63ada456-e0c7-4b52-9759-25efec4dc540", nombre: "komondor" },
    { id: "9cb2e6d5-bacb-4b14-a534-7b1b243045b0", nombre: "kuvasz" },
    { id: "9d7c4db8-b9cf-4ed3-af8e-86fc56fbf251", nombre: "labradoodle" },
    { id: "9d7c4db8-b9cf-4ed3-af8e-86fc56fbf251", nombre: "labrador" },
    { id: "0780919e-5b5d-4883-9c09-c6d150e224ce", nombre: "leonberg" },
    { id: "bf1a3791-0df3-4338-9b99-53ac4641bdda", nombre: "lhasa" },
    { id: "5328d59b-b4e4-48e9-98ec-0545c66c4385", nombre: "malamute" },
    { id: "ece72a1b-d6e1-4e2c-b3b3-04f9b534336d", nombre: "malinois" },
    { id: "521d8c02-32b9-4b50-8f0d-f791b4bfe697", nombre: "maltese" },
    { id: "da3946bb-9281-4ee3-b39a-f4434a433628", nombre: "mastiff" },
    { id: "43cdadb4-851b-4a3a-99c1-5f63d08d97f8", nombre: "mexicanhairless" },
    { id: "NotFound", nombre: "mix" },
    { id: "ca34c3f8-40dc-4dec-aadf-2633016c7cc0", nombre: "mountain" },
    { id: "NotFound", nombre: "mudhol" },
    { id: "3f5ec130-8f1e-41fb-b614-26dda736375f", nombre: "newfoundland" },
    { id: "8acfbb7f-f4b8-4e56-b64a-283a007a77eb", nombre: "otterhound" },
    { id: "68f47c5a-5115-47cd-9849-e45d3c378f12", nombre: "ovcharka" },
    { id: "88591552-b3bd-45fd-931c-5c8b88aad4f2", nombre: "papillon" },
    { id: "NotFound", nombre: "pariah" },
    { id: "dd9017cb-368d-4013-8e9c-01ec3f305365", nombre: "pekinese" },
    { id: "2a4b364b-ec99-467c-b86c-516415601771", nombre: "pembroke" },
    { id: "f9f8166b-aee7-4b32-bc01-170bddd89731", nombre: "pinscher" },
    { id: "0c6755a1-3877-4933-bc6d-08b8d197cefb", nombre: "pitbull" },
    { id: "33f28453-ae29-41be-8f02-e9cd16c7efbd", nombre: "pointer" },
    { id: "b7211a59-787d-4b34-b390-77b9b0dc5b9d", nombre: "pomeranian" },
    { id: "3f17b92b-bd0c-499a-bc84-da8f2a206bab", nombre: "poodle" },
    { id: "a6ea38ed-f692-478e-af29-378d0e2cc270", nombre: "pug" },
    { id: "a6ea38ed-f692-478e-af29-378d0e2cc270", nombre: "puggle" },
    { id: "9aafa721-a86d-4df6-880f-75fa117ee468", nombre: "pyrenees" },
    { id: "NotFound", nombre: "rajapalayam" },
    { id: "0af27828-f1f6-41d4-8580-48025d5e182c", nombre: "redbone" },
    { id: "fee91641-2a2e-4c4f-b557-cff67c5803bc", nombre: "retriever" },
    { id: "09d3fe1d-03d7-46d8-ad86-d66288563673", nombre: "ridgeback" },
    { id: "11f90c78-8f4c-43f7-bc47-fab733a33c6b", nombre: "rottweiler" },
    { id: "20b1d8be-ae44-4a70-8526-0612904bc9b2", nombre: "rough" },
    { id: "58f9eb88-7288-42a5-b34a-5b5192eaac17", nombre: "saluki" },
    { id: "e3046d15-8fae-4cbb-a6df-4afe80490bbd", nombre: "samoyed" },
    { id: "88025f0c-987f-42e9-98e0-ccb8b53516e9", nombre: "schipperke" },
    { id: "5e415b34-d15f-46da-ab83-25ec1e48bced", nombre: "schnauzer" },
    { id: "15e35786-3ff3-4f59-87eb-d9dd84a29d07", nombre: "segugio" },
    { id: "699a4ee6-564c-43e2-8932-5159657a29a8", nombre: "setter" },
    { id: "22ec7c8e-9339-45b1-b524-54caa7570760", nombre: "sharpei" },
    { id: "7ee19070-1a62-40e4-95d8-3b33ef87c9ef", nombre: "sheepdog" },
    { id: "80d23247-6f46-4962-90cc-c3692b4cb4a5", nombre: "shiba" },
    { id: "e4aa816d-fb22-4841-80c4-b9967c310447", nombre: "shihtzu" },
    { id: "4dba996c-1b89-4fd5-92c1-3df35c05ecac", nombre: "spaniel" },
    { id: "6978f4da-e6a9-4f85-b120-d5ac9f416c36", nombre: "spitz" },
    { id: "3b7aa8d3-4e4c-424b-bf4d-11453c26bb00", nombre: "springer" },
    { id: "e0c3dc07-73d6-4209-ae0b-8ddd99817287", nombre: "stbernard" },
    { id: "84b24bac-9b97-4bb0-a585-e8bb18de1a58", nombre: "terrier" },
    { id: "947a92b5-0d27-460a-aa18-f15643f39f63", nombre: "tervuren" },
    { id: "2d7be3ac-c72b-4d2f-af62-93a1f1d944f9", nombre: "vizsla" },
    { id: "4750a978-d281-4cdb-a0c8-8f24c06365b5", nombre: "waterdog" },
    { id: "851399dd-ebd6-49d6-b4c1-ec26ee583799", nombre: "weimaraner" },
    { id: "32534831-9241-4be3-a594-70c45e1a9bbe", nombre: "whippet" },
    { id: "0cef8682-d0c9-48f0-890b-f567eb2e7c2d", nombre: "wolfhound" }
  ]
};