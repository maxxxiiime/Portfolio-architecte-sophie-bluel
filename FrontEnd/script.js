const gallery = document.getElementsByClassName('gallery')[0];
const containersFilters=document.querySelector('.containers-filters');

async function recoverWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    return works;
}

function createGalleryProject(work) {
    const project = document.createElement('figure');
    // project.classList.add('gallery');
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

    console.log(arrayWork);
    arrayWork.forEach(work =>{
        const galleryProject = createGalleryProject(work);
        gallery.appendChild(galleryProject);
        console.log(work);   
    });
}
async function main() {
    let listWorks = await recoverWorks()
    resetGallery();
    displayGallery(listWorks);
    recoverCategories();
}
function resetGallery(){
    gallery.innerHTML='';
}
// filtrer par catégories 1, 2 ou 3
async function recoverCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    const listCategories = await response.json();
    console.log(listCategories);
    // return listCategories;
    createFilters(listCategories);
    // ajoute les filtres categories
    categorieFilter();     
}

function createFilters(categories){

    categories.forEach(categorie =>{
        const btn = document.createElement('button')
        btn.className = 'filter';
        btn.id = categorie.id;
        btn.textContent = categorie.name;
        containersFilters.appendChild(btn);      
    });
}
// filtrer et selectionner les catégorie par id au clique
function categorieFilter() {
    containersFilters.addEventListener('click', function (event) {
        if (event.target.classList.contains('filter')) {
            // Filtre les projets en fonction de la catégorie sélectionné id
            const selectedCategorie = event.target.id;
            console.log(selectedCategorie);
        }
    });
}

main()
// async function main() {
//     let listWorks = await recoverWorks();
//     let listCategories = await recoverCategories();
//     resetGallery();
//     displayGallery(listWorks);
//     createFilters(listCategories);
//     categorieFilter();
// }



