const fetchProductList = async () => {
  const localData = localStorage.getItem("productList");
  if (localData) {
    return JSON.parse(localData);
  }

  const response = await fetch(
    "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json"
  );
  const products = await response.json();
  localStorage.setItem("productList", JSON.stringify(products));
  return products;
};

const addCarouselStructure = () => {
  const productDetail = document.querySelector(".product-detail");
  if (productDetail) {
    productDetail.insertAdjacentHTML(
      "afterend",
      `
      <div class="product-carousel">
          <h2>You Might Also Like</h2>
          <div class="carousel-container">
              <button class="carousel-arrow left-arrow">&#10094;</button>
              <div class="carousel-track"></div>
              <button class="carousel-arrow right-arrow">&#10095;</button>
          </div>
      </div>
    `
    );
  }
};

const populateCarousel = (products) => {
  const track = document.querySelector(".carousel-track");
  if (track) {
    products.forEach((product) => {
      track.insertAdjacentHTML(
        "beforeend",
        `
        <div class="carousel-item" data-id="${product.id}">
            <img src="${product.img}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.price}</p>
            <button class="favorite-btn">&#9829;</button>
        </div>
      `
      );
    });
  }
};

const handleFavoritesAndRedirects = (products) => {
  document
    .querySelector(".carousel-track")
    .addEventListener("click", (event) => {
      const carouselItem = event.target.closest(".carousel-item");
      if (!carouselItem) return;
      const productId = carouselItem.dataset.id;
      const favorites = JSON.parse(localStorage.getItem("favorites")) || {};

      if (event.target.classList.contains("favorite-btn")) {
        favorites[productId] = !favorites[productId];
        localStorage.setItem("favorites", JSON.stringify(favorites));
        applySavedFavorites();
      } else {
        const thisItem = products.find(
          // one could be a string and the other a number
          // hence the "non-strict" == check
          (product) => product.id == productId
        );

        if (thisItem) {
          window.open(thisItem.url, "_blank");
        }
      }
    });
};

const applySavedFavorites = () => {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || {};

  document.querySelectorAll(".carousel-item").forEach((item) => {
    const productId = item.getAttribute("data-id");

    const favoriteButtonOfCard = item.querySelector(".favorite-btn");
    if (favorites[productId]) {
      favoriteButtonOfCard.classList.add("favorited");
    } else {
      favoriteButtonOfCard.classList.remove("favorited");
    }
  });
};

const carouselFunctionality = () => {
  const carouselTrack = document.querySelector(".carousel-track");
  const carouselItems = document.querySelectorAll(".carousel-item");
  const leftArrow = document.querySelector(".left-arrow");
  const rightArrow = document.querySelector(".right-arrow");

  let currentIndex = 0;

  const updateCarousel = (itemWidth) => {
    const shiftAmount = itemWidth * currentIndex;
    carouselTrack.style.transform = `translateX(-${shiftAmount}px)`;
  };

  const calculateEssentials = () => {
    const screenWidth = window.innerWidth;
    const itemWidth = carouselItems[0].offsetWidth;
    const numberOfItemsOnScreen = Math.floor(screenWidth / (itemWidth + 40));
    const maxIndex =
      numberOfItemsOnScreen < carouselItems.length
        ? carouselItems.length - numberOfItemsOnScreen
        : 0;

    return { screenWidth, itemWidth, numberOfItemsOnScreen, maxIndex };
  };

  const goToNext = () => {
    const { maxIndex, itemWidth } = calculateEssentials();

    currentIndex = currentIndex + 1 >= maxIndex ? 0 : currentIndex + 1;
    updateCarousel(itemWidth);
  };

  const goToPrevious = () => {
    const { maxIndex, itemWidth } = calculateEssentials();
    currentIndex = currentIndex - 1 <= 0 ? maxIndex : currentIndex - 1;
    updateCarousel(itemWidth);
  };

  leftArrow.addEventListener("click", goToPrevious);
  rightArrow.addEventListener("click", goToNext);
};

const makeResponsive = () => {
  const carouselItems = document.querySelectorAll(".carousel-item");

  const viewportWidth = window.innerWidth;

  let itemsVisible = 6.5;
  if (viewportWidth < 768) itemsVisible = 2.5;
  else if (viewportWidth < 1024) itemsVisible = 4.5;
  else if (viewportWidth < 1400) itemsVisible = 6.5;

  carouselItems.forEach(
    (item) => (item.style.flex = `0 0 calc(100% / ${itemsVisible})`)
  );
};

const addCarouselStyles = () => {
  const styleElement = document.createElement("style");
  styleElement.innerHTML = `
      .product-carousel {
          position: relative;
          overflow: hidden;
          width: 100%;
          margin: 20px auto;
      }
      .carousel-container {
          position: relative;
          display: flex;
          width: 100%;
          align-items: center;
      }
      .carousel-track {
          display: flex;
          transition: transform 0.5s ease;
          will-change: transform;
      }
      .carousel-item {
          position:relative;
          flex: 0 0 calc(100% / 6.5); /* 6.5 items visible */
          box-sizing: border-box;
          padding: 10px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
      }
      .carousel-item img {
          width: 100%;
          display: block;
      }
      .carousel-item h3 {
          font-size: 1.4rem;
          color: #0a0f0f;
      }
      .carousel-item p {
          font-size: 18px;
          font-weight: bold;
          color: #193db0;
          line-height: 22px;
          min-height: 22px;
          margin: 0;
      }
      .carousel-arrow {
          unset: all;
          position: absolute;
          transform: initial;
          top: 50%;
          width: 30px;
          height: 60px;
          background: none;
          border: none;
          font-size: 3rem;
          cursor: pointer;
          z-index: 2;
      }
      .left-arrow {
          left: 10px; 
          color: black !important;
      }
      .right-arrow {
          right: 10px;
          color: black !important;
      }
      .favorite-btn {
          all: unset;
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          background-color: white;
          padding: 5px;
          border: none;
          font-size: 1.2em;
          cursor: pointer;
          color: #ccc;
          transition: color 0.3s
      }
      .favorited {
          color: blue;
      }
  `;
  document.head.appendChild(styleElement);
};

(async () => {
  const products = await fetchProductList();
  addCarouselStructure();
  populateCarousel(products);
  handleFavoritesAndRedirects(products);
  applySavedFavorites();
  carouselFunctionality();
  addCarouselStyles();
  makeResponsive();
  window.addEventListener("resize", makeResponsive);
})();
