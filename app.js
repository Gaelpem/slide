"use strict"; 

let container = document.querySelector('.container'); 
let items = document.querySelector('.items'); 
let itemElement = document.querySelectorAll('.item'); 
let itemImage = document.querySelectorAll('.item img'); 
let imagePreview= document.querySelector('.img-preview img'); 
let indicator = document.querySelector('.indicator');


let isVertical = window.innerWidth <= 900; 

// stockage de dimension / creation d'un objet dimension 

let dimensions = {
    itemSize : 0, 
    containerSize : 0, 
    indicatorSize : 0, 
}

// creationn des variable les animation lisses et les position 

let maxTranslate = 0;  
let currentTranslate  = 0; 
let targetTranslate = 0; 
const activeOpacity = 0.3; 
let isClickMove = 0; 
let currentImageItem = -1; 


//creation d'une fonction lerp pour lisser les moouvement 

function lerp(start, end, factor){
    return start + (end - start) * factor
}

// function updateDimensios pour mettre à jour les dimensions

function updateDimensions(){
    
    isVertical = window.innerWidth <= 900; 

    if(isVertical){
        dimensions = {
            itemSize : itemElement[0].getBoundingClientRect().height, 
            containerSize : items.getBoundingClientRect().height, 
            indicatorSize :  indicator.getBoundingClientRect().height, 
        }
    }else{
        dimensions = {
            itemSize : itemElement[0].getBoundingClientRect().width, 
            containerSize : items.scrollWidth, 
            indicatorSize :  indicator.getBoundingClientRect().width, 
        }
    }

    return dimensions; 
}

dimensions = updateDimensions();
maxTranslate = dimensions.containerSize - dimensions.indicatorSize; 

// function getItemIndicator pour calculer la position entre item et l'indicator

function getItemIndicator(){
    itemImage.forEach((img) =>(img.style.opacity = 1))

       const indicatorStart = -currentTranslate;
       const indicatorEnd  = indicatorStart + dimensions.indicatorSize; 

       const maxOverlap  = 0; 
       const selectIndex = 0 ; 

       itemElement.forEach((item, index) =>{
             
          const itemStart = index * dimensions.itemSize
          const itemEnd = itemStart + dimensions.itemSize

          const overlapStart = Math.max(itemStart, indicatorStart);
          const overlapEnd = Math.min(itemEnd, indicatorEnd);
          const overlap = Math.max(0,overlapEnd - overlapStart); 

          if(overlap > maxOverlap){
            maxOverlap = overlap; 
            selectIndex = index; 
          }
       })
       itemElement[selectIndex].style.opacity = activeOpacity;
       return selectIndex
}

//function pour mettre à jour preview-image; 

function updatePreviewImage(index){
     if(currentImageItem !== index){
        currentImageItem = index; 
        const targetItem = itemElement[index].querySelector('img'); 
        const targetSrc = targetItem.getAttribute('src'); 
        imagePreview.setAttribute('src', targetSrc)
     }
}

//function animate() pou faire bouger la bande 
function animate(){
    //determination de la vitesse de l'animation en fonction de l'interaction (clic ou défilement)
    const lerpFactor = isClickMove ? 0.05 : 0.075; 
    // mettre à jour la position de la bande (currentTranslate) actuelle (currentTranslate) pour raprocher de la position cible
    currentTranslate = lerp(currentTranslate, targetTranslate, lerpFactor); 

    // verification si la position de la bande est assez proche de la cible (targetTranslate)
    if(Math.abs(currentTranslate - targetTranslate) > 0.01){
        const transform =  isVertical ? 
        `translateY(${currentTranslate})px`
        : `translateX(${currentTranslate})px`
        items.style.transform = transform; 
    }else{
        // si la bande est assez proche on stope le click
        isClickMove = false; 
    }

    // creer une boucle pour que l'animation se repete 
    requestAnimationFrame(animate);
}
//Cette partie du code est cruciale pour gérer le défilement de la molette de la souris (ou du trackpad) sur ton carrousel. Elle permet de faire bouger la bande d'images de manière fluide lorsque l'utilisateur fait défiler.
container.addEventListener("wheel", (e) => {
    // Empêche le comportement par défaut de la molette (comme le défilement de la page)
    e.preventDefault();

    // Désactive le mode "clic" pour le déplacement, car on utilise la molette
    isClickMove = false;

    // Récupère la valeur de déplacement vertical de la molette (deltaY)
    // deltaY est positif si l'utilisateur fait défiler vers le bas, négatif vers le haut
    let delta = e.deltaY;

    // Calcule la vitesse de défilement en limitant la valeur entre -20 et 20
    // Cela permet d'éviter des mouvements trop rapides
    const scrollVelocity = Math.min(Math.max(delta * 0.5, -20), 20);

    // Met à jour la position cible (targetTranslate) en fonction de la vitesse de défilement
    // La position cible est limitée entre -maxTranslate et 0 pour éviter de dépasser les limites du conteneur
    targetTranslate = Math.min(
        Math.max(targetTranslate - scrollVelocity, -maxTranslate), 0
    );
}, { passive: false }); // L'option { passive: false } permet d'utiliser e.preventDefault()lse}); //activation e.preventDefault()

// une variable pour stocker les touchStartY de l'utilisateur

let touchStart = 0; 

//Eouteur pour détecter les touches de l'utilisateur 

container.addEventListener('touchStart', (e) =>{
    
    // sauvegarder les touchés dans la variable touch
    touchStart = e.touches[0].touchY
})