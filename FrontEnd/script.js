const gallery = document.getElementsByClassName('gallery')[0];
const containersFilters = document.querySelector('.containers-filters');
let listWorks;

// récupérer les travaux de l'api avec Fetch
async function recoverWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    return works;
}

function createGalleryProject(work) {
    const project = document.createElement('figure');
    const image = document.createElement('img');
    image.src = work.imageUrl;
    image.alt = work.title;
    project.appendChild(image);
    
    const title = document.createElement('h3');
    title.textContent = work.title;
    project.appendChild(title);
     
    return project;
  }

function displayGallery(arrayWork) {
    gallery.innerHTML='';

    arrayWork.forEach(work => {
        const galleryProject = createGalleryProject(work);
        gallery.appendChild(galleryProject);
        console.log(work);   
    });
}
async function main() {
    listWorks = await recoverWorks();
    resetGallery();
    displayGallery(listWorks);
    recoverCategories();
}
function resetGallery() {
    gallery.innerHTML='';
}
// récupérer les catégories 1, 2 ou 3
async function recoverCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    const listCategories = await response.json();
    console.log(listCategories);
    // return listCategories;
    createFilters(listCategories);
    // ajoute les filtres categories
    categorieFilter(); 
}
// créer les filtres
function createFilters(categories) {
    categories.forEach(categorie => {
        const btn = document.createElement('button')
        btn.className = 'filter';
        btn.id = categorie.id; 
        btn.textContent = categorie.name;
        containersFilters.appendChild(btn);      
    });
}
        // filtre et selectionne les catégories par id au clique
function categorieFilter() {
    containersFilters.addEventListener('click', function (event) {
        if (event.target.classList.contains('filter')) {
            // Filtre les projets en fonction de la catégorie sélectionnée id
            const selectedCategorie = event.target.id;
            console.log(selectedCategorie);
           
        // affiche tous les projets si la catégorie selectionnée est 'tous'
            if (selectedCategorie === 'all') {
                displayGallery(listWorks); 
              } 
            //   afficher la catégorie selectionnée
              else {
                const filteredProjects = listWorks.filter(work => work.categoryId == selectedCategorie);
                displayGallery(filteredProjects);
              }
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const modeEdition = document.querySelector('.mode-edition');
    const login = document.getElementById('login');
    const logout = document.getElementById('logout');
    const body = document.querySelector('body');

    if (token) {
      // Le token est valide, affiche la div
      modeEdition.style.display = 'block';
      login.style.display = 'none';
      logout.style.display = 'block';
      containersFilters.style.display = 'none';
      body.style.marginTop = '80px'; 
      

    } else {
      // Le token n'est pas valide, masque la div
      modeEdition.style.display = 'none';
      login.style.display = 'block';
    }


  });

  main()