import axios from "axios";


export default class NewsApiServices {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.quantity = 40;
  }

  fetchImages() {
    const API_KEY = '34785269-2da0cadfc3fd212a10b88586f';
    const BASE_URL = 'https://pixabay.com/api/';
    const response = axios.get(`${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.quantity}`);
    this.incrementPage();
    return response;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
  
 
}
