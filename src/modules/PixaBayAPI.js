// MAIN COMPONENT ---------------------------------------------------------------------------------
const API_KEY_PIXABAY = process.env.REACT_APP_PIXABAY_API_KEY;
const API_KEY_UNSPLASH = process.env.REACT_APP_UNSPLASH_API_KEY;

class PixaBayAPI {

  static async getCorrespondingImages(words,language, nbResults = 200) {

    let queryString = "";

    words.forEach((word, idx) => {
        queryString += word + (idx + 1 < words.length ? "+": "");
    });

    /* let options = {
      'method': 'get', // *GET, POST, PUT, DELETE, etc.
      'mode': 'cors', // no-cors, *cors, same-origin
      'cache': 'no-cache',
      'headers': { 'Content-Type': 'application/json' },
    }; */

    let url = `https://pixabay.com/api/?key=${API_KEY_PIXABAY}&q=${encodeURIComponent(queryString)}&image_type=photo&lang=${language}&safesearch=true&per_page=${nbResults}`;

    if (words.length === 0) {
      url = `https://pixabay.com/api/?key=${API_KEY_PIXABAY}&category=backgrounds&image_type=photo&lang=${language}&safesearch=true&per_page=${nbResults}`;
    }

    try {

      // Fetch data and get JSON result.
      let Response = await fetch(url); //&orientation=horizontal

      let Result = await Response.json();

      if(!Result) return null

      if(Result) {
        return Result;
      }

      return null;

    } catch(Err) {
      console.log('getCorrespondingImages',Err);
      return [];
    }

  }

  static async getCorrespondingImagesUnsplash(words,language, nbResults = 20) {

      let queryString = "";

      words.forEach((word, idx) => {
          queryString += word + (idx + 1 < words.length ? " ": "");
      });

      try {

      // Fetch data and get JSON result.
      let Response = await fetch(`https://api.unsplash.com/search/photos?client_id=${API_KEY_UNSPLASH}&per_page=50&query=${encodeURIComponent(queryString)}&lang=${language}`);

      let Result = await Response.json();

      if(!Result) return null

      if(Result) {

        let images = [];

        Result.results.forEach(image => {
          images.push({ previewURL: image.urls.thumb, id: image.id, tags: image.description });
        });

        Result.hits = images;

        return Result;
      }

      return null;

    } catch(Err) {
      console.log('analyzeEntitiesUnsplash',Err);
      return [];
    }

  }

}


// EXPORT -----------------------------------------------------------------------------------------

export default PixaBayAPI;
