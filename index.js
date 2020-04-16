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

  // again fetch content from selected url
  let data = await fetch(urls[ind])
    .then(function(response) {
      return response.text();
    });

  // return the response
  return new Response(data, {
    headers: { 'content-type': 'text/html' },
  })
}
