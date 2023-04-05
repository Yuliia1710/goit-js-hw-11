import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { search } from './search';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

var lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

let page = 1;
let request = '';
let arrayImg = '';
let hits = '';
let lastMessage = false;
let temporaryValue = '';

const form = document.querySelector('#search-form');
console.log(form);
const gallery = document.querySelector('.gallery');
console.log(gallery);

window.addEventListener('scroll', debounce(onScrollDocument, DEBOUNCE_DELAY));
form.addEventListener('submit', onSearchImg);

async function onSearchImg(e) {
  e.preventDefault();
  gallery.innerHTML = '';
  console.log(gallery.innerHTML);

  const {
    elements: { searchQuery },
  } = e.currentTarget;

  request = searchQuery.value.trim();

  if (request !== temporaryValue) {
    page = 1;
    temporaryValue = request;
  }

  form.reset();
  lastMessage = false;

  if (request === '') {
    errorMessage();
    gallery.innerHTML = '';
    return;
  }

  const response = await search(request, page);
  arrayImg = response.data.hits;
  hits = response.data.totalHits;

  if (arrayImg.length <= 0) {
    errorMessage();
    return;
  }

  renderItemList(arrayImg);
  hitsMessages(hits);
}

function errorMessage() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
    { timeout: 3000 }
  );
}

function renderItemList(item) {
  const listItem = item
    .map(
      item => `<div class="photo-card">
                  <a href="${item.largeImageURL}">
                  <div class="thumb">
                  <img
                    src="${item.webformatURL}"
                    alt=" ${item.tags}"
                    loading="lazy"
                    />
                    </div>
                  </a>
                  <div class="info">
                    <p class="info-item"><b>Likes</b><br> ${item.likes}</p>
                    <p class="info-item"><b>Views</b><br> ${item.views}</p>
                    <p class="info-item"><b>Comments</b><br> ${item.comments}</p>
                    <p class="info-item"><b>Downloads</b><br> ${item.downloads}</p>
                  </div>
                </div>`
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', listItem);
  lightbox.refresh();
}

function hitsMessages(hits) {
  Notify.success(`Hooray! We found ${hits} images.`, { timeout: 5000 });
}

async function onScrollDocument() {
  const scroll = document.documentElement.getBoundingClientRect();
  if (scroll.bottom < document.documentElement.clientHeight + 150) {
    page += 1;
    const response = await search(request, page);
    if (response.data.hits.length === 0 && lastMessage === false) {
      allItemMessages();
      lastMessage = true;
    }
    renderItemList(response.data.hits);
  }
}

function errorMessage() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
    { timeout: 3000 }
  );
}

function allItemMessages() {
  Notify.info("We're sorry, but you've reached the end of search results.", {
    timeout: 3000,
  });
}
