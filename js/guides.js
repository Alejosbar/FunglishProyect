document.addEventListener('DOMContentLoaded', function() {
    const guidesList = document.getElementById('guidesList');
    if (guidesList) {
        guidesList.addEventListener('click', function(e) {
            // Nos aseguramos de que el clic fue en un botón de descarga
            if (e.target && e.target.classList.contains('download-btn')) {
                e.preventDefault(); // Prevenimos la acción por defecto del enlace

                const fileName = e.target.dataset.file;
                if (!fileName) {
                    console.error('El botón no tiene un atributo data-file con el nombre del archivo.');
                    alert('No se pudo encontrar el archivo para descargar.');
                    return;
                }

                // Creamos la ruta al archivo. Asumimos que los PDFs están en una carpeta /guides/pdf/
                const filePath = `../guides/pdf/${fileName}`;

                // Creamos un enlace temporal para iniciar la descarga
                const link = document.createElement('a');
                link.href = filePath;
                link.download = fileName; // El nombre que tendrá el archivo al ser descargado
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        });
    }
    // --- Lógica de filtrado ---
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const guideItems = document.querySelectorAll('.guide-item');

    // Leemos si se pasó una edad específica desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const ageFromUrl = urlParams.get('age');
    const specificAgeCategory = ageFromUrl ? `edad-${ageFromUrl}` : null;

    function filterGuides() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const selectedCategory = categoryFilter ? categoryFilter.value : '';

        guideItems.forEach(item => {
            const category = item.dataset.category;
            let shouldShow = false;

            // CASO 1: Si se especificó una edad en la URL, solo mostramos esa categoría.
            if (specificAgeCategory) {
                if (category === specificAgeCategory) {
                    shouldShow = true;
                }
            } else {
            // CASO 2: Comportamiento normal de filtrado (búsqueda y select).
                const title = item.querySelector('.card-title').textContent.toLowerCase();
                const text = item.querySelector('.card-text').textContent.toLowerCase();
                const matchesSearch = title.includes(searchTerm) || text.includes(searchTerm);
                const matchesCategory = selectedCategory === '' || category === selectedCategory;
                if (matchesSearch && matchesCategory) {
                    shouldShow = true;
                }
            }

            if (shouldShow) {
                item.style.display = ''; // Muestra la tarjeta
            } else {
                item.style.display = 'none'; // Oculta la tarjeta
            }
        });
    }
    if (searchInput) {
        searchInput.addEventListener('input', filterGuides);
    }
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterGuides);
    }

    // Al cargar la página, si viene una edad específica, la pre-seleccionamos en el filtro.
    if (specificAgeCategory && categoryFilter) {
        const categoryValue = specificAgeCategory;
        // Verificamos si esa opción existe en el select
        if (categoryFilter.querySelector(`option[value="${categoryValue}"]`)) {
            categoryFilter.value = categoryValue;
        }
    }
    filterGuides(); // Llamamos a filterGuides DESPUÉS de establecer el filtro
});