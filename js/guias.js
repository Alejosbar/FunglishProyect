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
});