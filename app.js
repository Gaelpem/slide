"use strict"; 

let container = document.querySelector('.container'); 
let items = document.querySelector('.items'); 
let itemElement = document.querySelectorAll('.item'); 
let itemImage = document.querySelectorAll('.item img'); 
let imagePreview= document.querySelector('.img-preview img'); 
let indicator = document.querySelector('.indicator');


let isVertical = window.innerWidth <= 900; 

// stockage des dimensions avec l'objet dimension 

let dimensions = {
    itemSize : 0, 
    containerSize :0, 
    indicatorSize: 0, 
}

// creaiton des variable 

let maxTranslate = 0 ; 
let currentTranslate = 0; 
let targetTranslate =0 ; 
let isClickMove = 0; 
const activeOpacity = 0.3; 
let currentImageIndex = 0; 


// creation d'une fonction updateDimension pour mettre à jour 

function updateDimension(){
    isVertical = window.innerWidth < 900; 
    if(isVertical){
        dimensions = {
            itemSize : itemElement[0].getBoundingClientRect().height,
            containerSize : items.getBoundingClientRect().height, 
            indicatorSize : indicator.getBoundingClientRect().height, 
        }
    }else{
        dimensions = {
            itemSize : itemElement[0].getBoundingClientRect().width,
            containerSize : items.scrollWidth, 
            indicatorSize : indicator.getBoundingClientRect().width, 
        }
    }
    return dimensions; 
}

dimensions = updateDimension(); 

maxTranslate = dimensions.containerSize - dimensions.indicatorSize; 

// creation de la fonction lerp pour lisser les animations

function lerp(start, end, factor){
    return start + (end - start) * factor ; 
}

// function getItemIndicator

function getItemIndicator(){

     itemImage.forEach((img) => (img.style.opacity = 1)); 

     const indicatorStart = -currentTranslate; 
     const indicatorEnd = indicatorStart + dimensionsIndicator; 

     const maxOverlap = 0; 
     const selectIndex = 0; 

     itemElement.forEach((item, index) =>{
           const itemStart = index * dimensions.itemSize; 
           const itemEnd = itemStart + dimensions.itemSize; 

           const overlapStart = Math.max(itemStart, indicatorStart); 
           const overlapEnd = Math.min(itemEnd, indicatorEnd)
           const overlap =   Math.max(0, overlapEnd - overlapStart ); 

           if(overlap > maxOverlap){
            maxOverlap = overlap; 
            selectIndex = index; 
           }
     })
     //Cette ligne modifie l'opacité de l'image qui est actuellement sélectionnée (celle qui est dans la zone visible).
     itemElement[selectIndex].style.opacity = activeOpacity; 
     return selectIndex; 
}

function animate(index){
      //lisser 
      const lerpFactor = isClickMove ? 0.05 : 0.075; 
      
      currentTranslate = lerp(currentTranslate, targetTranslate, lerpFactor); 

      if(isVertical){
        const transform = 
      }
}