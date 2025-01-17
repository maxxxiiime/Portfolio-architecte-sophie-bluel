const gallery = document.getElementsByClassName("gallery")[0];
const containersFilters = document.querySelector(".containers-filters");
const addProjectForm = document.getElementById("addProjectForm");
let listWorks;

// récupérer les travaux de l'api avec Fetch
async function recoverWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  const works    = await response.json();
  return works;
}

function createGalleryProject(work) {
  const project = document.createElement("figure");
  project.setAttribute("project-id", work.id); //attribuer ID pour suppr
  const image = document.createElement("img");

  image.src = work.imageUrl;
  image.alt = work.title;
  project.appendChild(image);

  const title = document.createElement("h3");
    title.textContent = work.title;
    project.appendChild(title);

  return project;
}

// Ajout des projets dans la modal
function addSingleGalleryImg(work) {

  const project = document.createElement("figure");
    const image   = document.createElement("img");
    const editBtn = document.createElement("div");

    const deleteIcon = document.createElement("div"); 
    deleteIcon.classList.add("delete-icon");

    const svgSrc = "./assets/icons/bin.svg";
    deleteIcon.style.backgroundImage = `url(${svgSrc})`;

    image.src = work.imageUrl;
    image.alt = work.title;
    project.appendChild(image);

    project.appendChild(deleteIcon);
    editBtn.textContent = "éditer";
    editBtn.className   = "edit-btn-modal";
    project.appendChild(editBtn);

    // supprimer un projet
    deleteIcon.addEventListener("click", function (event) {

      deleteProject(work.id, listWorks);
      project.remove(); // Supprime le projet

      updateGallery(listWorks);//testt
    });

    return project;
}

// Mettre les images dans la modale
function addImgModalGallery(arrayWork) {
  const ModalGallery = document.querySelector(".modal-img-gallery");

  arrayWork.forEach((work) => {
    console.log(arrayWork);
    let project= addSingleGalleryImg(work);
    // On envoi tout (image projet deleteIcon editer... ) ici
    ModalGallery.appendChild(project);
  });
}

//! j'appelle la fonction pour delete un projet avec son id
function deleteProject(projectId, listWorks) {
  console.log(projectId);
  fetch(`http://localhost:5678/api/works/${projectId}`, {
    //suppr Backend
    method: "DELETE",
    headers: {
      'authorization': `Bearer ${localStorage.getItem('token')}`
    },
  })
    .then((response) => {
      if (response.ok) {
        // supprime l'élément du DOM
        const projectToDelete = document.querySelector(`figure[project-id="${projectId}"]`);
        if (projectToDelete) {
          projectToDelete.remove();
        }
   
        recoverWorks()
        .then((updatedWorks) => {
          listWorks = updatedWorks;

        displayGallery(listWorks);
      })
      .catch((error) => {
        console.log("Error while updating works", error);
      });
      } else {
        // Gérer l'erreur de suppression
        throw new Error("Failed");
      }
    })
    .catch((error) => {
      console.log("Error", error);
    });
}
// Reset gallery
function resetGallery() {
  gallery.innerHTML = "";
}
// mettre a jours la gallery
function updateGallery(arrayWork) {
  resetGallery();
  displayGallery(arrayWork);
}
//! Affiche la gallery
function displayGallery(arrayWork) {
  resetGallery();

  arrayWork.forEach((work) => {
    const galleryProject = createGalleryProject(work);
    gallery.appendChild(galleryProject);
  });
}

async function main() {
  listWorks = await recoverWorks(); //récup les donnée de l'API et l'attribut a listWorks
  resetGallery(); //vide la galerie existante.
  displayGallery(listWorks); //affiche la gallery
  recoverCategories(); //recup la liste des categorie depuis API
  addImgModalGallery(listWorks); //Pour ajouter les projets a la mini gallery modal
  updateGallery(listWorks); //mettre a jour la gallery
}
//! FILTRES
// récupérer les catégories 1, 2 ou 3
async function recoverCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  const listCategories = await response.json();
  console.log(listCategories);
 
  createFilters(listCategories); // créé les filtres pr chaque categorie
  // ajoute les filtres categories
  categorieFilter();
}
// créer les filtres
function createFilters(categories) {
  categories.forEach((categorie) => {
    const btn = document.createElement("button");
    btn.className = "filter";
    btn.id = categorie.id;
    btn.textContent = categorie.name; // le text du bouton = le nom de la catégorie
    containersFilters.appendChild(btn);
  });
}
// filtre et selectionne les catégories par id au clique
function categorieFilter() {
  containersFilters.addEventListener("click", function (event) {
    if (event.target.classList.contains("filter")) {
      // Filtre les projets en fonction de la catégorie sélectionnée id
      const selectedCategorie = event.target.id;
      console.log(selectedCategorie);

      // affiche tous les projets si la catégorie selectionnée est 'tous'
      if (selectedCategorie === "all") {
        displayGallery(listWorks);
      }
      // affiche la catégorie selectionnée
      else {
        const filteredProjects = listWorks.filter(
          (work) => work.categoryId == selectedCategorie
        );
        displayGallery(filteredProjects);
      }
    } 
  });
}
main();

//! mode édition
document.addEventListener("DOMContentLoaded", () => {
  const token        = localStorage.getItem("token");
  const modeEdition  = document.querySelector(".mode-edition");
  const login        = document.getElementById("login");
  const logout       = document.getElementById("logout");
  const editProjects = document.querySelectorAll(".content-edit-projects");
  const body         = document.querySelector("body");

  if (token) {
    // Le token est valide, affiche la div
    modeEdition.style.display = "block";
    login.style.display = "none";
    logout.style.display = "block";
    containersFilters.style.display = "none";
    body.style.marginTop = "80px";

    //! pour selectionner chaque element de toute les class editProjects
    editProjects.forEach((content) => {
      content.style.display = "flex";
    });
  } else {
    // Le token n'est pas valide, masque la div
    modeEdition.style.display = "none";
    login.style.display = "block";
  }

  logout.addEventListener("click", () => {
    // Supprimer le token du localStorage
    localStorage.removeItem("token");
    login.style.display = "block";
    logout.style.display = "none";
    // modeEdition.style.display = 'none';  // a voir plus tard
  });
});

//! MODAL CONTAINER 1
// fonction pour faire basculer (toggle) le bouton  checkModal en active
const modalContainer = document.querySelector(".modal-container");
const checkModal = document.querySelectorAll(".check-modal");

checkModal.forEach((check) => check.addEventListener("click", toggleModal));

function toggleModal() {
  modalContainer.classList.toggle("active");
}

//! MODAL CONTAINER 2 : AJOUTER DES PROJETS / NAV Entre Modal
const modalContainer2 = document.querySelector(".modal-container2")
const addImgBtn = document.querySelectorAll(".add-img");

// CLOSE MODAL 1 et 2 par défaut
const modalClose = document.querySelectorAll(".close-modal");
modalClose.forEach(trigger => trigger.addEventListener("click", closeModal,))

function closeModal() {
  modalContainer.classList.remove("active");
  modalContainer2.classList.remove("active");
  previewImgContainer.style = "visibility: hidden";
  containerUploadImg.style = "visibility: visible";
  addProjectForm.reset();
  validateUpload.classList.remove("ready"); 
}
// bouton Ajouter une photo modal 1(close la 1ere modal et active modal2 )
addImgBtn.forEach((check) => check.addEventListener("click", toggleModal2));
function toggleModal2() {
  modalContainer.classList.remove("active"); // A voir aussi si je garde le overlay tout le temps de la nav entre modal
  modalContainer2.classList.toggle("active");

}
// retour a la premiere modal
function backToModal1(){
const arrowBack = document.getElementById("icon-arrow-back");

arrowBack.addEventListener("click", () => {
    modalContainer.classList.add("active")
    modalContainer2.classList.remove("active")
    previewImgContainer.style = "visibility: hidden";
    containerUploadImg.style = "visibility: visible";
    addProjectForm.reset();
    validateUpload.classList.remove("ready");
});
}

backToModal1();

// !AJOUTER DES PROJETS
const fileInput = document.getElementById("upload-img");
const previewImage = document.querySelector(".preview-img");
const previewImgContainer = document.querySelector(".preview-img-container");
const containerUploadImg = document.querySelector(".container-upload-img");

fileInput.addEventListener("change", function(event) {
  let fileSize = fileInput.files[0].size / 1024 / 1024; // Convertit en Mo

    if (fileSize <= 4) { // Detecte si la taille du fichier upload <= 4mo
  previewImgContainer.style = "visibility: visible";
  containerUploadImg.style = "visibility: hidden";
  const file = event.target.files[0];
  const imageUrl = URL.createObjectURL(file);
  previewImage.src = imageUrl;
  console.log(imageUrl);
  checkFormIsOk(); }
  else{
    alert("le fichier ne doit pas dépasser 4mo") //! Alert 
  }
});

  async function addProjectToAPI(project) {
    try {
      const formData = new FormData();
      formData.append('image', project.image);
      formData.append('title', project.title);
      formData.append('category', +project.category); //+ pour avoir le numero de catégorie
  console.log(formData);
  console.log(project);

      const response = await fetch('http://localhost:5678/api/works', {
        method: "POST",
        headers: {
          'authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData 

      });
      if (response.ok) {
        // Projet rajouté avec succès dans l'API
        const newProject = await response.json();
        return newProject;
      } else {
        throw new Error("Failed to add project");
      }
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  }

//variable du formulaire
const validateUpload = document.querySelector(".validate-upload");
const titleInput     = document.getElementById("title-project");
const categorySelect = document.getElementById("category-project");
const errorUpload    = document.querySelector(".error-upload-txt");

// Fonction de vérification du formulaire pour le bouton valider
function checkFormIsOk() {
  if (titleInput.value !== "" && categorySelect.value !== "" && previewImage.src !== "") {
    let fileSize = fileInput.files[0].size / 1024 / 1024; // Convertit en Mo
    console.log(fileSize);
    if (fileSize <= 4) { //si la taille <= 4mo
     
    validateUpload.classList.add("ready");
    return;
    }

  } else {
    validateUpload.classList.remove("ready");
  }
}

// addEventListener de type "input" aux champs du formulaire
titleInput.addEventListener("input", checkFormIsOk);
categorySelect.addEventListener("input", checkFormIsOk);

validateUpload.addEventListener("click", async function() {

  if (titleInput.value === "" || categorySelect.value === "" || previewImage.src === "")  {
   
      
    // champs obligatoires sinon .shake
    errorUpload.style.display = "block";
    validateUpload.classList.add("shake");
    setTimeout(() => {
      validateUpload.classList.remove("shake");
    }, 500);

  } 
  else {
    const newProject = {
      title: titleInput.value,
      category: categorySelect.value,
      image: fileInput.files[0]    
    };
    
    try {
    const AddNewProjectPost = await addProjectToAPI(newProject);
    console.log(newProject);

      addProject(AddNewProjectPost);
      listWorks = await recoverWorks(); //récup les données de l'API et l'attribut a listWorks
      displayGallery(listWorks);
      console.log(AddNewProjectPost);
      closeModal();
      // backToModal1();
      toggleModal();
      validateUpload.classList.remove("ready");
      }
      catch (error) {
        console.log(error);
      }
    }

  function addProject(project) {
    // Ajouter le projet à la modal gallery
    const projectModal = addSingleGalleryImg(project);
    const ModalGallery = document.querySelector(".modal-img-gallery");
    ModalGallery.appendChild(projectModal);
  
    // Ajouter le projet à la gallery principale
    const galleryProject = createGalleryProject(project);
    gallery.appendChild(galleryProject);

    // Réinitialiser le formulaire
    addProjectForm.reset();
    validateUpload.classList.remove("ready");
  }
});

