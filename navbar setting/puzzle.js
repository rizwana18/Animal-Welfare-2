// Initial References
const moves = document.getElementById("moves");
const container = document.querySelector(".container");
const startButton = document.getElementById("start-button");
const coverScreen = document.querySelector(".cover-screen");
const result = document.getElementById("result");
let currentElement = "";
let movesCount, imagesArr = [];

// Popups
const popup1 = () => {
  document.getElementById('popup1').style.display = 'block';
  setTimeout(() => {
    document.getElementById('popup1').style.display = 'none';
  }, 3000); // Close popup after 3 seconds (adjust as needed)
};

let hasScrolled = false;
window.onscroll = () => {
  if (!hasScrolled) {
    popup1();
    hasScrolled = true;
  }
};

const popup2 = () => {
  document.getElementById('popup2').style.display = 'block';
  setTimeout(() => {
    document.getElementById('popup2').style.display = 'none';
  }, 3000);
};

const popup3 = () => {
  document.getElementById('popup3').style.display = 'block';
  setTimeout(() => {
    document.getElementById('popup3').style.display = 'none';
  }, 3000);
};

window.onscroll = () => {
  popup1();
  window.onscroll = null;
};

const randomNumber = () => Math.floor(Math.random() * 19);

const specifiedOrder = [
  0, 1, 2, 3, 4,
  10, 11, 12, 13, 14,
  20, 21, 22, 23, 24,
  30, 31, 32, 33, 34
];

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const randomImages = () => {
  imagesArr = [...specifiedOrder];
  shuffleArray(imagesArr);
};

const getCoords = (element) => {
  const [row, col] = element.getAttribute("data-position").split("_");
  return [parseInt(row), parseInt(col)];
};

const checkAdjacent = () => true;

const gridGenerator = () => {
  let count = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 5; j++) {
      let div = document.createElement("div");
      div.setAttribute("data-position", `${i}_${j}`);
      div.classList.add("image-container");
      div.style.margin = "5px";

      let imgIndex = imagesArr[count];
      let imgSrc = `imgpiece-${imgIndex < 10 ? "0" : ""}${imgIndex}.jpg`;
      let imgClass = imgIndex === 34 ? "target" : "";

      div.innerHTML = `<img src="${imgSrc}" class="image ${imgClass}" data-index="${imgIndex}"/>`;

      count += 1;
      container.appendChild(div);

      // Make the image pieces draggable
      div.draggable = true;
      div.addEventListener("dragstart", handleDragStart);
      div.addEventListener("dragover", handleDragOver);
      div.addEventListener("drop", handleDrop);
    }
  }
};

const handleDragStart = (e) => {
  e.dataTransfer.setData("text/plain", e.target.dataset.index);
};

const handleDragOver = (e) => {
  e.preventDefault();
};

const handleDrop = (e) => {
  e.preventDefault();
  const sourceIndex = parseInt(e.dataTransfer.getData("text/plain"));
  const targetIndex = parseInt(e.target.dataset.index);

  swapImages(sourceIndex, targetIndex);
  updateGrid();
};

const swapImages = (sourceIndex, targetIndex) => {
  const sourcePosition = imagesArr.indexOf(sourceIndex);
  const targetPosition = imagesArr.indexOf(targetIndex);

  [imagesArr[sourcePosition], imagesArr[targetPosition]] = [imagesArr[targetPosition], imagesArr[sourcePosition]];
};

const updateGrid = () => {
  container.innerHTML = "";
  gridGenerator();
};

const selectImage = (e) => {
  e.preventDefault();
  currentElement = e.target;
  let targetElement = document.querySelector(".target");
  let currentParent = currentElement.parentElement;
  let targetParent = targetElement.parentElement;

  const [row1, col1] = getCoords(currentParent);
  const [row2, col2] = getCoords(targetParent);

  currentElement.remove();
  targetElement.remove();

  let currentIndex = parseInt(currentElement.getAttribute("data-index"));
  let targetIndex = parseInt(targetElement.getAttribute("data-index"));

  currentElement.setAttribute("data-index", targetIndex);
  targetElement.setAttribute("data-index", currentIndex);

  currentParent.appendChild(targetElement);
  targetParent.appendChild(currentElement);

  let currentArrIndex = imagesArr.indexOf(currentIndex);
  let targetArrIndex = imagesArr.indexOf(targetIndex);

  [imagesArr[currentArrIndex], imagesArr[targetArrIndex]] = [
    imagesArr[targetArrIndex],
    imagesArr[currentArrIndex],
  ];

  if (movesCount === 20 && !popup2Shown) {
    popup2();
    popup2Shown = true;
  }

  if (imagesArr.join("") === "012345101112131420212223243031323334") {
    setTimeout(() => {
      coverScreen.classList.remove("hide");
      container.classList.add("hide");
      result.innerText = `Total Moves: ${movesCount}`;
      startButton.innerText = "Restart Game";
    }, 1000);

    popup3();
  }

  movesCount += 1;
  moves.innerText = `Moves: ${movesCount}`;
};

// Show/Hide Original Image
const originalImage = document.getElementById("originalImage");
const showImageButton = document.getElementById("show");

function toggleOriginalImage() {
  if (originalImage.style.display === 'none' || originalImage.style.display === '') {
    originalImage.style.display = 'block';
    showImageButton.textContent = 'Hide Image';
  } else {
    originalImage.style.display = 'none';
    showImageButton.textContent = 'Show Image';
  }
}

showImageButton.addEventListener("click", toggleOriginalImage);

coverScreen.addEventListener("click", () => {
  container.classList.remove("hide");
  coverScreen.classList.add("hide");
  container.innerHTML = "";
  imagesArr = [];
  randomImages();
  gridGenerator();
  movesCount = 0;

  popup2Shown = false;

  popup1();
});

window.onload = () => {
  coverScreen.classList.remove("hide");
  container.classList.add("hide");
};

let popup2Shown = false;

