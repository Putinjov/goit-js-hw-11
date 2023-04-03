import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import NewsApiServices from './getImage';

const form = document.querySelector(".search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector('.load-more');



const lightbox = new SimpleLightbox(".gallery a", {});
const newsApiServices = new NewsApiServices();

form.addEventListener("submit", onSearch);
loadMoreBtn.addEventListener("click", onLoadMoreBtn);

async function onSearch(e) {
  e.preventDefault();
  const formData = new FormData(form);
  newsApiServices.query = formData.get('searchQuery').trim();
  newsApiServices.resetPage();
  

  if (newsApiServices.query === "") {
    return Notiflix.Notify.failure("Input query!");
  }


await newsApiServices.fetchImages()
    .then((response) => {
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
      loadMoreBtn.classList.remove('is-hidden');
      
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

window.addEventListener("scroll", onScroll);

function onScroll() {
const { height: cardHeight } =gallery
  .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}

function onLoadMoreBtn() {
  newsApiServices.fetchImages().then((response) => {
    const nextPageMarkup = createImagesMarkup(response.data.hits);
    createImagesMarkup(response.data.hits)
    addImagesToGallery(nextPageMarkup);
    console.log(response.data)
  
  
  if (response.data.total === response.data.totalHits) {
    loadMoreBtn.classList.add('is-hidden');
    endCollection();
    }
  });
}

function endCollection() {
  Notiflix.Notify.info("Were sorry, but you've reached the end of search results");
}