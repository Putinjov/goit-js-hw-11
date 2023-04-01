import axios from "axios";

const API_KEY = '34785269-2da0cadfc3fd212a10b88586f';
const BASE_URL = 'https://pixabay.com/api/';

async function fetchImages(query, page = 1) {
  const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`);
  return response.data;
}

export default fetchImages;