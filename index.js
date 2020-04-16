addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {

  // get urls from /api/variants
  let urls = await fetch("https://cfw-takehome.developers.workers.dev/api/variants")
    .then(function(response){
      return response.json();
    })
    .then(function(data) {
      return data["variants"];
    })
    .catch(function(err) {
      console.log("Error- Unable to fetch /api/variants");
      return "err";
    });
  
  

  // get each url with equal probability
  let n = urls.length;
  let ind = Math.floor(Math.random() * n);

  // OR if available get last persisted url
  // check for available url cookie
  // and respond with the version for the url
  let cookie = request.headers.get('Cookie');
  if ( cookie != null ) {
    let cookies = cookie.split(";");
    for ( var i = 0; i < cookies.length; i++ ) {
      var cookiePair = cookies[i].split("=");
      if ( cookiePair[0].trim() == "url" ) {
        ind = parseInt(cookiePair[1].trim());
      }
    }
    // ind = parseInt(url_ind.split("=")[1].split(",")[0]);
  }
  console.log(cookie)
  // again fetch content from selected url
  let data = await fetch(urls[ind])

  // return the response
  // return new Response(data, {
    // headers: { 'content-type': 'text/html' },
  // })

  let newdata = new HTMLRewriter()
    .on("title", new Title(ind+1))
    .on("h1#title", new Heading(ind+1))
    .on("p#description", new Description(ind+1))
    .on("a#url", new Link(ind+1))
    .transform(data);

  let header = 'url=' + ind;

  // set url cookie, to visit same url
  newdata.headers.set('Set-Cookie', header);
  return newdata;

}

class Title {
  constructor(ind) {
    this.ind = ind;
  }
  text(text) {
    if (text.lastInTextNode) {
      text.replace("Web Page" + this.ind);
    } else {
      text.remove();
    }
  }
}

class Heading {
  constructor(ind) {
    this.ind = ind;
  }
  text(text) {
    if (text.lastInTextNode) {
      text.replace("HARSHIT's Web Page" + this.ind)
    } else {
      text.remove();
    }
  }
}

class Description {
  constructor(ind) {
    this.ind = ind;
  }
  text(text) {
    if (text.lastInTextNode) {
      text.replace(
        "This is the variant " 
        + this.ind + " for my submission for this project ");
    } else {
      text.remove();
    }
  }
}

class Link {
  constructor(ind) {
    this.ind = ind;
  }
  element(elem) {
    elem.setAttribute("href", "https://harshit13.github.io/");
  }
  text(text) {
    if (text.lastInTextNode) {
      text.replace("GOTO Harshit's Personal Webpage");
    } else {
      text.remove();
    }
  }
}
