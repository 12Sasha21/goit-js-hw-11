const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '25701276-4c897598a1be31965ea51d876';
const axios = require('axios');

export default class ImgApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchApi() {
    const URL = `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&lang=ru&
    image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;
    try {
      const response = await axios.get(URL);
      this.incrementPage();
      return response.data;
    } catch (error) {
      console.log(error.message);
    }
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
