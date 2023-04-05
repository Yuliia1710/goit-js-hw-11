import axios from 'axios';
const url = 'https://pixabay.com/api/';
const key = '35078540-2c141ef0988cb1d0018a14385';

async function search(item, page) {
  const adress = `${url}?key=${key}&q=${item}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
  try {
    return await axios.get(adress);
  } catch (error) {
    console.log(error);
  }
}

export { search };
