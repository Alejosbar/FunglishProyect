// stories.js

document.addEventListener('DOMContentLoaded', function() {
    const storyButtons = document.querySelectorAll('.read-story');
    const storyReader = document.getElementById('storyReader');
    const closeStoryBtn = document.getElementById('closeStory');
    const storiesList = document.querySelector('.stories-list');

    // Elementos del lector de cuentos
    const storyImage = document.getElementById('storyImage');
    const storyText = document.getElementById('storyText');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const currentPageSpan = document.getElementById('currentPage');
    const totalPagesSpan = document.getElementById('totalPages');

    let currentStory = null;
    let currentPage = 0;

    // Base de datos de cuentos (simulada)
    const storiesData = {
        '1': {
            title: 'El Gato y el Sombrero',
            // Todas las imágenes deben estar en /img/stories/cat_hat/
            pages: [
                { image: '../img/stories/cat_hat/page1.jpg', text: 'En una casa grande, vivía un gato llamado Tom.' },
                { image: '../img/stories/cat_hat/page2.jpg', text: 'Un día, Tom encontró un sombrero mágico de color azul.' },
                { image: '../img/stories/cat_hat/page3.jpg', text: 'Cuando se lo puso, ¡pudo volar por toda la habitación!' },
                { image: '../img/stories/cat_hat/page4.jpg', text: 'Tom voló tan alto que llegó hasta la luna.' },
                { image: '../img/stories/cat_hat/page5.jpg', text: 'Y todos vivieron felices para siempre. Fin.' },
            ]
        },
        '2': {
            title: 'Los Colores del Arcoíris',
            // Todas las imágenes deben estar en /img/stories/rainbow/
            pages: [
                { image: '../img/stories/rainbow/page1.jpg', text: 'Había una vez un conejito que quería pintar el cielo.' },
                { image: '../img/stories/rainbow/page2.jpg', text: 'Encontró un pincel y pintura roja como una fresa.' },
                { image: '../img/stories/rainbow/page3.jpg', text: 'Luego, pintó con amarillo como el sol brillante.' },
                { image: '../img/stories/rainbow/page4.jpg', text: 'Y finalmente, azul como el océano profundo.' },
            ]
        },
        '3': {
            title: 'El Pez Dorado',
            pages: [
                { image: '../img/stories/goldfish/page1.jpg', text: 'Goldie era un pez dorado que vivía en una pequeña pecera.' },
                { image: '../img/stories/goldfish/page2.jpg', text: 'Soñaba con nadar en el gran océano.' },
                { image: '../img/stories/goldfish/page3.jpg', text: 'Un día, un niño lo llevó al mar y su sueño se hizo realidad.' },
            ]
        }
    };

    storyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const storyId = this.dataset.story;
            openStory(storyId);
        });
    });

    if (closeStoryBtn) {
        closeStoryBtn.addEventListener('click', closeStory);
    }

    function openStory(storyId) {
        currentStory = storiesData[storyId];
        if (!currentStory) {
            console.error('No se encontraron datos para el cuento:', storyId);
            return;
        }

        currentPage = 0;
        storiesList.classList.add('d-none');
        storyReader.classList.remove('d-none');
        storyReader.scrollIntoView({ behavior: 'smooth' });
        
        displayPage();
    }

    function closeStory() {
        storyReader.classList.add('d-none');
        storiesList.classList.remove('d-none');
        currentStory = null;
    }

    function displayPage() {
        if (!currentStory) return;

        const pageData = currentStory.pages[currentPage];
        storyImage.src = pageData.image;
        storyText.textContent = pageData.text;

        currentPageSpan.textContent = currentPage + 1;
        totalPagesSpan.textContent = currentStory.pages.length;

        // Habilitar/deshabilitar botones de navegación
        prevPageBtn.disabled = currentPage === 0;
        nextPageBtn.disabled = currentPage === currentStory.pages.length - 1;
    }

    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => {
            if (currentStory && currentPage < currentStory.pages.length - 1) {
                currentPage++;
                displayPage();
            }
        });
    }

    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => {
            if (currentStory && currentPage > 0) {
                currentPage--;
                displayPage();
            }
        });
    }
});