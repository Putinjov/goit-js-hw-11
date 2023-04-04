import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import NewsApiServices from './getImage';

const form = document.querySelector(".search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector('.load-more');
const elements = document.querySelectorAll('.photo-card');

const lightbox = new SimpleLightbox(".gallery a", {});
const newsApiServices = new NewsApiServices();
let currentQuantity = newsApiServices.quantity;

form.addEventListener("submit", onSearch);
loadMoreBtn.addEventListener("click", onLoadMoreBtn);

function onSearch(e) {
  e.preventDefault();
  getQuery();

  try {
    fetchData();
  }
  catch (error) {
    console.log(error);
    Notiflix.Notify.failure("Oops, something went wrong...");
  }
}

function createImagesMarkup(images) {
  return images
    .map(({ webformatURL, largeImageURL, likes, views, comments, downloads, tags }) => {
      return `
        <div class="photo-card">
          <div class="thumb">
            <a class="image" href="${webformatURL}">
            <img src="${largeImageURL}" alt="${tags}" loading="lazy" />
            </a>
          </div>
          <div class="info">
            <p class="info-item">
              <b>Likes</b> ${likes}
            </p>
            <p class="info-item">
              <b>Views</b> ${views}
            </p>
            <p class="info-item">
              <b>Comments</b> ${comments}
            </p>
            <p class="info-item">
              <b>Downloads</b> ${downloads}
            </p>
          </div>
        </div>
      `;
    })
    .join("");
  
}

function addImagesToGallery(markup) {
  gallery.insertAdjacentHTML("beforeend", markup);
  lightbox.refresh();
}

function clearGallery() {
  gallery.innerHTML = "";
}

function onScroll() {
const { height: cardHeight } =gallery
  .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}

async function onLoadMoreBtn() {
  try {
    const response = await newsApiServices.fetchImages();
    const elements = document.querySelectorAll('.photo-card');
    if (elements.length === response.data.totalHits) {
      endCollection();
    };
    
    const nextPageMarkup = createImagesMarkup(response.data.hits);
    addImagesToGallery(nextPageMarkup);
    
    let timeoutScroll = setTimeout( onScroll, 1000);

  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure("Oops, something went wrong...");
  }
}

function endCollection() {
  loadMoreBtn.classList.toggle('is-hidden');
  Notiflix.Notify.info("Were sorry, but you've reached the end of search results");
}

function getQuery() {
  const formData = new FormData(form);
  newsApiServices.query = formData.get('searchQuery').trim();
  newsApiServices.resetPage();
  clearGallery();

  if (newsApiServices.query === "") {
    return Notiflix.Notify.failure("Input query!");
    
  }
}

async function fetchData() {
    const response = await newsApiServices.fetchImages();
    const hits = response.data.hits;
    const totalHits = response.data.totalHits;
    if (hits.length === 0) {
      Notiflix.Notify.failure(
        "Sorry, there are no images matching your search query. Please try again."
      );
      clearGallery();
      return;
    }

    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    const imagesMarkup = createImagesMarkup(hits);
    addImagesToGallery(imagesMarkup);
    loadMoreBtn.classList.toggle('is-hidden');
}