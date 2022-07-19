const https = require('https');
//Node.js comes with both HTTP and HTTPS modules in the standard as-installed library (so no node needed).
//First, we require the https standard Node module, which is available with Node.js installation. No need for a package.json file or any npm install --save to get this running


const unplashApi = 'https://source.unsplash.com/1600x900?dream';
const quotes = [
  'Wherever you go, no matter what the weather, always bring your own sunshine.',
  'You\’re awesome.',
  'Happiness is the only thing that multiplies when you share it.',
  'It always seems impossible until it is done.',
  'Let your unique positive energy inspire confidence in others.',
  'The best is yet to come.',
  'You\'re capable of more than you can even dream.',
  'You deserve the best.',
  'Keep going, you\'re doing well.',
  'Stay positive; stay hopeful'
];

//define an async function which calls our URL using the HTTP module 'get' method

//With modern Promise-based functions, we attach our callback functions to the returned promises instead, forming a promise chain. As the name suggests, a promise is either kept or broken. So, a promise is either completed(kept) or rejected(broken).

//state of a pending promise can either be fulfilled with a value or rejected with a reason (error)

//https.get(URL, response)

async function getImage() {
  return new Promise((resolve, reject) => {
    https.get(unplashApi, (res) => {
      // API returns a HTTP 302 code, we only want the final image URL
      resolve(res.headers.location); // Promise.resolve method = returns a Promise that is resolved with the given value, or the promise passed as value
    }).on('error', (error) => {
      reject(error.message); // Promise.reject method = returns a Promise object that is rejected with a given reason.
    });
  });
}

/*The Promise object represents the eventual completion (or failure) of an asynchronous operation and its resulting value.
The methods Promise.prototype.then(), Promise.prototype.catch(), and Promise.prototype.finally() are used to associate further action with a promise that becomes settled. As the Promise.prototype.then() and Promise.prototype.catch() methods return promises, they can be chained.
The .then() method takes up to two arguments; the first argument is a callback function for the fulfilled case of the promise, and the second argument is a callback function for the rejected case. Each .then() returns a newly generated promise object, which can optionally be used for chaining */

module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');

  const image = await getImage();
  const text = quotes[Math.floor(Math.random() * quotes.length)];

  context.res = {
    body: {
      image,
      text
    }
  };
};
