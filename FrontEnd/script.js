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
    project.setAttribute('project-id', work.id); //attribuer ID pour suppr
    const image = document.createElement('img');
    
    image.src = work.imageUrl;
    image.alt = work.title;
    project.appendChild(image);
    
    const title = document.createElement('h3');
    title.textContent = work.title;
    project.appendChild(title);
     
    return project;

   
  }

// Mettre les images dans la modale
function addImgModalGallery(arrayWork) {
  const ModalGallery = document.querySelector('.modal-img-gallery');

  arrayWork.forEach(work => {
    const project = document.createElement('figure');
    const image = document.createElement('img');
    const editBtn = document.createElement('div');

    const deleteIcon = document.createElement('div');
    deleteIcon.classList.add('delete-icon');
    // deleteIcon.src = "./assets/icons/bin.svg";// sinon img a la place de div a voir..
   
      const svgSrc = './assets/icons/bin.svg';
      deleteIcon.style.backgroundImage = `url(${svgSrc})`;

    image.src = work.imageUrl;
    image.alt = work.title;
    project.appendChild(image);

    project.appendChild(deleteIcon);
    editBtn.textContent = 'éditer';
    editBtn.className = 'edit-btn-modal';
    project.appendChild(editBtn);

    // supprimer un projet
    deleteIcon.addEventListener('click', function (event) {
      deleteProject(work.id);
      project.remove(); // Supprime le projet
    });
// On envoi tout (image projet deleteIcon editer... ) ici
    ModalGallery.appendChild(project);
   
  });
}
// j'appelle la fonction pour delete un projet avec son id
function deleteProject(projectId) {
  console.log(projectId);

  // projectTodelete = <figure> qui a le même attribute que projectID defini dans function createGalleryProject
  const projectToDelete = document.querySelector(`figure[project-id="${projectId}"]`); 
  if (projectToDelete) {
    projectToDelete.remove();
  }
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

    addImgModalGallery(listWorks);
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
            //   affiche la catégorie selectionnée
              else {
                const filteredProjects = listWorks.filter(work => work.categoryId == selectedCategorie);
                displayGallery(filteredProjects);
              }
        }
    });
}
main()
//! mode édition
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const modeEdition = document.querySelector('.mode-edition');
    const login = document.getElementById('login');
    const logout = document.getElementById('logout');
    const editProjects = document.querySelectorAll('.content-edit-projects');
    const body = document.querySelector('body');

    if (token) {
      // Le token est valide, affiche la div
      modeEdition.style.display = 'block';
      login.style.display = 'none';
      logout.style.display = 'block';
      containersFilters.style.display = 'none';
    //   editProjects.style.display ='flex' 
    //  cela ne marche que pour une seule class selectionnée (la 1ere)
      body.style.marginTop = '80px'; 

//! pour selectionner chaque element de toute les class editProjects
      editProjects.forEach(content => {
        content.style.display = 'flex';
      });

    } else {
      // Le token n'est pas valide, masque la div
      modeEdition.style.display = 'none';
      login.style.display = 'block';
    }

    logout.addEventListener('click', () => {
        // Supprimer le token du localStorage
        localStorage.removeItem('token');
        login.style.display = 'block';
        logout.style.display = 'none';
      
        // modeEdition.style.display = 'none';  // a voir plus tard
      });
  });


  // fonction pour faire basculer (toggle) le bouton  checkModal en active
  const modalContainer = document.querySelector(".modal-container");
  const checkModal = document.querySelectorAll(".check-modal");

  checkModal.forEach(check => check.addEventListener("click", toggleModal))

function toggleModal(){
  modalContainer.classList.toggle("active")
}


//! tentative d'ajouter des projets
const addImgBtn = document.querySelector('.add-img');
function addProjects() {
  console.log('Créé une modal form');
  //  creé ici une autre modal avec un form ? ou dans le html
}

addImgBtn.addEventListener('click', addProjects);