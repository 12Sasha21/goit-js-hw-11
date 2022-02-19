import './sass/main.scss';
import getRefs from './js/get-refs';
import imgCardTpl from './templates/image-card.hbs';
import Notiflix from 'notiflix';
import ImgsApiService from './js/img-service';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import LoadMoreBtn from './js/load-more-btn';

const refs = getRefs();
const imgsApiService = new ImgsApiService();

const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  hidden: true,
});

refs.searchForm.addEventListener('submit', onSearch);
refs.gallery.addEventListener('click', onOpenModal);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

// ---------------------------------------------------------------------------

function onSearch(event) {
  event.preventDefault();

  imgsApiService.query = event.currentTarget.elements.searchQuery.value;

  if (imgsApiService.query === '') {
    return;
  }

  imgsApiService.fetchApi().then(data => {
    appendHitsMarkup(data.hits);

    if (data.total === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.',
      );
    }
    if (data.total > 0) {
      Notiflix.Notify.success(`Hooray! We found ${data.total} images.`);
        loadMoreBtn.show();
    }
  });

  imgsApiService.resetPage( );
  loadMoreBtn.enable();
  clearHitsContainer();
}

// -------------------------------------------------------------------------

function onLoadMore() {
  imgsApiService.fetchApi().then(data => {
    appendHitsMarkup(data.hits);
    scrollToMore();

    if (Math.ceil(data.totalHits / 40) === imgsApiService.page - 1) {
      loadMoreBtn.hide();
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
  });
}

function appendHitsMarkup(hits) {
  refs.gallery.insertAdjacentHTML('beforeend', imgCardTpl(hits));
}

function clearHitsContainer() {
  refs.gallery.innerHTML = '';
}

function onOpenModal(event) {
  event.preventDefault();

  if (event.target.nodeName !== 'IMG') {
    return;
  }

  new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  }).refresh();
}

function scrollToMore() {
  const firstEl = document.querySelector('.gallery a');
  const { height: cardHeight } = firstEl.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
