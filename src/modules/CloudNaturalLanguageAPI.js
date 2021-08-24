// MAIN COMPONENT ---------------------------------------------------------------------------------

const API_KEY = process.env.REACT_APP_GOOGLE_NLU_API_KEY;

class CloudNaturalLanguageAPI {

  static async analyzeEntities(text) {

    let body = {
      "document":{
        "type": "PLAIN_TEXT",
        "content": text
      },
      "encodingType":"UTF8"
    }

    let options = {
        'method': 'post', 
        'mode': 'cors', 
        'cache': 'no-cache',
        'redirect': 'follow',
        'referrerPolicy': 'no-referrer',
        'headers': { 'Content-Type': 'application/json' },
        'body': JSON.stringify(body)
      };

      try {

      // Fetch data and get JSON result.
      let Response = await fetch(`https://language.googleapis.com/v1/documents:analyzeEntities?key=${API_KEY}`,options);

      let Result = await Response.json();

      if(!Result) return null

      if(Result) {
        return Result;
      }

      return null;

    } catch(Err) {
      console.log('analyzeEntities',Err);
      return [];
    }

  }

}


// EXPORT -----------------------------------------------------------------------------------------

export default CloudNaturalLanguageAPI;
