const gallery = document.getElementsByClassName('gallery')[0];
const containersFilters = document.querySelector('.containers-filters');

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
  gallery.innerHTML = '';

  arrayWork.forEach(work => {
    const galleryProject = createGalleryProject(work);
    gallery.appendChild(galleryProject);
  });
}

async function main() {
  let listWorks = await recoverWorks();
  resetGallery();
  displayGallery(listWorks);
  recoverCategories();
}

function resetGallery() {
  gallery.innerHTML = '';
}

async function recoverCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  const listCategories = await response.json();
  createFilters(listCategories);
  addCategoryFilters();
}

function createFilters(categories) {
    
  categories.forEach(categorie => {
    const btn = document.createElement('button');
    btn.className = 'filter';
    btn.id = categorie.id;
    btn.textContent = categorie.name;
    containersFilters.appendChild(btn);
  });
}

function addCategoryFilters() {
  containersFilters.addEventListener('click', function (event) {
    if (event.target.classList.contains('filter')) {
      const selectedCategorie = event.target.id;
      // Effectuez ici le filtrage des projets en fonction de la catégorie sélectionnée
      // Réalisez les actions nécessaires pour filtrer les projets ici
      console.log("Catégorie sélectionnée :", selectedCategorie);
    }
  });
}

main();
