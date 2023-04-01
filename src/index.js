import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import fetchImages from './getImage';

const form = document.querySelector(".search-form");
const gallery = document.querySelector(".gallery");

let pageNumber = 1;
let currentQuery = "";

const lightbox = new SimpleLightbox(".gallery a", {});

form.addEventListener("submit", onSearch);

function onSearch(event) {
  event.preventDefault();
  const formData = new FormData(form);
  const query = formData.get('searchQuery').trim();
  if (query === "") {
    return Notiflix.Notify.failure("Input query!");
  }

  if (query !== currentQuery) {
    clearGallery();
    pageNumber = 1;
  }

  currentQuery = query;

  fetchImages(currentQuery, pageNumber)
    .then((response) => {
      const hits = response.data.hits;
      const totalHits = response.data.totalHits;
      if (hits.length === 0) {
        Notiflix.Notify.failure(
          "Sorry, there are no images matching your search query. Please try again."
        );
        return;
      }

      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

      const imagesMarkup = createImagesMarkup(hits);
      addImagesToGallery(imagesMarkup);
      pageNumber +=1;
    })
    .catch((error) => {
      console.log(error);
      Notiflix.Notify.failure("Oops, something went wrong...");
    });
}

function createImagesMarkup(images) {
  return images
    .map(({ webformatURL, largeImageURL, likes, views, comments, downloads, tags }) => {
      return `
        <div class="photo-card">
          <a href="${webformatURL}">
            <img src="${largeImageURL}" alt="${tags}" loading="lazy" />
          </a>
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

window.addEventListener("scroll", onScroll);

function onScroll() {
const { height: cardHeight } =gallery
  .firstElementChild.getBoundingClientRect();
window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
}
