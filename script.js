'use strict';

// MARK: Synchronous Code means that the code is executed line by line, in the exact order of execution that we defined in our code. So each line of code always waits for the previous line to finish execution.
// Now this can create problems when one line of code takes a long time to run. For example, if our code have an alert statement, the alert window will block the code execution. So nothing will happen on the page until we click that OK/Cancel Button And only then, the code can continue executing.

// MARK: Asynchronous Code is executed after a task that runs in the background finishes.
// Asynchronous Code is non-blocking.

// Execution doesn't wait for an asynchonous task to finish its work. For example, the timer function SetTimeout is an example of asynchronous bcz it doesn't block the execution after it, runs on the background, and the callback funtcion associated with it executes after the timer finishes.
// Note that the callback functions alone do not make the code asynchronous.

// Another example of Async is setting the source attribute of the image (img.src = 'someimage.jpg'). So setting the source attribute of any image is essentially loading an image in the background while the rest of the code can keep running.

// MARK: AJAX stands for Asynchronous JavaScript And XML: Allows us to communicate with remote web servers in an asynchronous way. With AJAX calls, we can request data from web servers dynamically.
// With Ajax, we can do an HTTP request to the server, which has the data. And the server will then set back a response containing that data that we requested. And this back and forth between Client and server all happens asynchronously in the background. The server usually contains a web API, and this API is the one that has the data that we're asking for.

// MARK: API stands for Application Programming Interface. Piece of software that can be used by another piece of software, in order to allow applications to talk to each other.

//There are many types of APIs but the most important one is ONLINE API. An online API is essentially an application running on a web server, which receives requests for data, then retrieves this data from some database and then sends it back to the client.

// Most APIs these days use the JSON data format. JSON data format today is basically just a JavaScript object, but converted to a string. So therefore, it's very easy to send across the web and also to use in JavaScript once the data arrives.

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

//  MARK: OUR FIRST API CALL: In JavaScript, there are actually multiple ways of doing AJAX calls. But we're gonna start with the most old school one, called the XML HTTP request function. This also shows how AJAX calls used to be handled WITH EVENTS AND CALLBACK FUNCTIONS.

const getCountryData = function (country) {
  const request = new XMLHttpRequest(); // This creates request object
  request.open('GET', `https://restcountries.com/v3/name/${country}`); //here we pass the type of request, type of HTTP request to get data is simply called GET. second, we need a string containing the URL to which the AJAX call should actually be made.

  // So with this, we basically open the request And now next, we need to also send it:

  request.send(); // this AJAX call that we just send off here, is being done in the background, while the rest of the code keeps running (async non-blocking behavior).

  // Now we need to register a callback on the request object for the load event. addEventListener here will wait for the load event:

  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText); // What we get after the AJAX call is JSON which is just a big string of text. So we need to convert that into an object. RHS returns an array with single object, so we use destructuring on the LHS to get the object
    console.log(data);

    const html = `<article class="country">
  <img class="country__img" src="${data.flags[0]}" />
  <div class="country__data">
    <h3 class="country__name">${data.name.common}</h3>
    <h4 class="country__region">${data.region}</h4>
    <p class="country__row"><span>🏛</span>${data.capital}</p>
    <p class="country__row"><span>🗣️</span>${[
      ...Object.values(data.languages),
    ]}</p>
    <p class="country__row"><span>💰</span>${
      Object.values(Object.values(data.currencies)[0])[0]
    }</p>
  </div>
  </article>`;
    countriesContainer.insertAdjacentHTML('beforeend', html); // The insertAdjacentHTML() method of the Element interface parses the specified text as HTML or XML and inserts the resulting nodes into the DOM tree at a specified position.
    // A DOMString representing the position relative to the element; must be one of the following strings: 'beforebegin': Before the element itself; 'afterbegin': Just inside the element, before its first child; 'beforeend': Just inside the element, after its last child; 'afterend': After the element itself.
  });
};
/* SHOW: getCountryData('india');
getCountryData('germany');*/

// Here, we basically send off the request, the request then fetches the data in the background. Once that is done, it will omit the load event. The event listener is waiting for that event, and as soon as the data arrives, callback function in it will be called.

// After calling this functions here twice, we will basically have two AJAX calls happening at the same time. If we reload the page, then they might appear in a different order, And the reason for that is basically that the data arrives at a slightly different time.

// So as we call getCountryData here with india, for the first time, it sends of this request, and then JavaScript moves on in the code right away to the next line. And this, of course, fires off another AJAX call immediately, way before the data of India has actually arrived.

// And so whoever one arrives first will then fire the load event first. So if the first one is the AJAX call for the germany, then the first element that's gonna be printed here will of be the one from the germany.

// MARK: In our example, we only just did one request and got one response back, And that's how it's gonna work when all we do is to access an API. However, if it's a WEB PAGE that we're accessing, then there will be many more requests and responses. And that's because when we do the first request, all we get back is just the initial HTML file. That HTML file will then get scanned by the browser for all the assets that it needs in order to build the entire Web page like JavaScript, CSS files, image files, or other assets. And then for each different file, there will be a new HTTP request made to the server. When all the files have finally arrived, then the Web page can be rendered in the browser, according to the HTML, CSS and JavaScript specifications.

// MARK: Now, if we want these requests to be made in a specific predefined order, then we would basically have to chain the requests. Which means to make the second request only after the first request has finished. This results to something called as the CALLBACK HELL!

// Below, we will make an AJAX call for a country, then once we get the data then we call for the neighbour of that country:

const getCountryAndNeighbour = function (country) {
  //AJAX call for country
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v3/name/${country}`);

  request.send();

  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    console.log(data);

    // Render country:
    renderCountry(data);

    //Get country neighbour
    let neighbour = 0;
    if (!data.borders) {
      return; // If no neighbour then simply return
    } else {
      for (let neighbour of data.borders) {
        //AJAX call for neighbour
        const requestNeighbour = new XMLHttpRequest();
        requestNeighbour.open(
          'GET',
          `https://restcountries.com/v3/alpha/${neighbour}` //alpha used in link instead of name bcz neighbour is the code
        );
        requestNeighbour.send();

        requestNeighbour.addEventListener('load', function () {
          const [dataNeighbour] = JSON.parse(this.responseText);
          console.log(dataNeighbour);
          renderCountry(dataNeighbour, 'neighbour');
        });
      }
    }
  });
};

const renderCountry = function (data, className = '') {
  const html = `<article class="country ${className}">
  <img class="country__img" src="${data.flags[0]}" />
  <div class="country__data">
    <h3 class="country__name">${data.name.common}</h3>
    <h4 class="country__region">${data.region}</h4>
    <p class="country__row"><span>🏛</span>${data.capital}</p>
    <p class="country__row"><span>🗣️</span>${[
      ...Object.values(data.languages),
    ]}</p>
    <p class="country__row"><span>💰</span>${
      Object.values(Object.values(data.currencies)[0])[0]
    }</p>
  </div>
  </article>`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

// SHOW: //getCountryAndNeighbour('usa');

// MARK: So here, we attach the first callback function And then inside of that, we have yet another one. So we have nested callbacks.But if we have to find the neighbour of the neighbours then we need to add callback inside a callback so on... this results to something called as the CALLBACK HELL.

// The callback hell is when we have a lot of nested callbacks in order to execute asynchronous tasks in sequence. And in fact, this happens for all asynchronous tasks, which are handled by callbacks (for example, a nested setTimeout function) And not just AJAX calls.

// Now, the problem with callback hell is that it makes our code look very messy. But even more important, it makes our code harder to maintain, and very difficult to understand, now the harder it is to understand code and to reason about the code, the more difficult it will be to add new features.

// MARK: Since ES6, there is actually a way of escaping callback hell by using something called as PROMISES.

const requestnew = fetch('https://restcountries.com/v3/name/india'); //in the fetch function, to make a simple get request, all we really need is to pass in the URL.

// SHOW: console.log(requestnew); //At this point, we can see something called promise in the console.
// A PROMISE is an object that is used basically as a placeholder for the future result of an asynchronous operation. SO it is like a container for an asynchronously delivered value.
// So when we start the AJAX call, there is no value yet, but we know that there will be some value in the future. And so we can use a promise to handle this future value.

// Advantages of using promises is that we no longer need to rely on events and callback functions to handle asynchronous results, events and callback functions can sometimes cause unpredictable results. Second, with promises we can chain promises for a sequence of asynchronous operations instead of nesting, and escape from the Callback Hell.

//The Cycle of a Promise: A promises can be in different states. In the very beginning, we say that a promise is Pending (before any value resulting from the asynchronous task is available). Then when the task finally finishes, we say that the promise is Settled and there are two different types of settled promises: Fulfilled promises and Rejected promises. An important thing is that a promise is only settled once. So the promise was either fulfilled or rejected, but it's impossible to change that state.

// Now, these different states are relevant and useful when we use a promise to get a result, called as to Consume a promise. But in order for a promise to exist in the first place, it must first be built. In the case of the fetch API, it's the fetch function that builds the promise and returns it for us to consume. But sometimes we also need to build a promise and to not just consume it.

// MARK: CONSUME A PROMISE:

const getCountryData2 = function (country) {
  fetch(`https://restcountries.com/v3/name/${country}`)
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      renderCountry(data[0]);
    });
};

// Initially, we assume that the promise will be fulfilled and that we have a value available to work with. To handle this fulfilled state, we can use then() method that is available on all promises.
// Now into the then method, we need to pass a callback function that we want to be executed as soon as the promise is actually fulfilled.
// function inside then() will receive one argument once it's called by JavaScript and that argument is the resulting value (of an AJAX call) of the fulfilled promise. let us call it response here.
// respose we get here contains many things like header, status, but the data we need is in the body.
// So in order to read this data from the body, we need to call the json method on the response. The json method here is available on all the response objects that is coming from the fetch function.
// Now, the problem here is that this json function itself, is actually also an asynchronous function and so it will also return a new promise. So we need return this promise from here (return response.jason()), And then call another then() method, So we need another callback function in which we pass the data.
// Now the data is the array containing an object which the data we demanded, which we will pass to the render.

//Simplifying above using arrow funtcions:

const getCountryData3 = function (country) {
  fetch(`https://restcountries.com/v3/name/${country}`)
    .then(response => response.json())
    .then(data => renderCountry(data[0]));
};

/* SHOW: getCountryData2('india');
getCountryData3('germany'); */

// Summary: First we call the fetch function that returns a promise And then we handled that promise using the then method, But to actually read the data from the response, we need to call the json method on that response object. Now json itself will also return a promise, so if we then return that promise then it basicall  becomes a new promise itself, the resolved value of this promise is going to be the data itself. And so we call again then() method on that with data as the callback argument. So now all we have to do is render country of data zero.

// MARK: CHAINING PROMISES:
// Now we will chain together two sequential Ajax calls. So just like before we first get the data about the neighboring country, And again, the second Ajax call depends on the data from the first call:

const renderError = function (message) {
  countriesContainer.insertAdjacentText('beforeend', message);
};

const getCountryAndNeighbour2 = function (country) {
  fetch(`https://restcountries.com/v3/name/${country}`)
    .then(response => {
      // console.log(response);
      if (response.ok === false)
        throw new Error(`Country not found ${response.status}`);

      return response.json();
    })
    .then(data => {
      renderCountry(data[0]); // Shows the country passed

      // For neighbour of country passed:
      let neighbour2;
      if (!data[0].borders) throw new Error('No neighbour found!');
      else neighbour2 = data[0].borders[0];

      return fetch(`https://restcountries.com/v3/alpha/${neighbour2}`); //we need to return this new promise bcz then only we will be able to chain a new then() method on the result of this then method.
    })
    .then(response => response.json())
    .then(data => {
      renderCountry(data[0], 'neighbour'); // Shows a neighbour of the country passed

      // For neighbour of the neighbour of the country passed:
      const neighbourOfNeighbour = data[0].borders[0];
      return fetch(
        `https://restcountries.com/v3/alpha/${neighbourOfNeighbour}`
      );
    })
    .then(response => response.json())
    .then(data => renderCountry(data[0], 'neighbour'))
    .catch(err => {
      // Catches any error
      console.error(`${err}`);
      renderError(err.message);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    }); // Shows a neighbour of the neighbour of country passed
};

// SHOW: getCountryAndNeighbour2('india');
//getCountryAndNeighbour2('japan');
//getCountryAndNeighbour2('xjxjxj');

// the then() method always return a promise no matter if we return anything or not, But if we do return a value, then that value will become the fulfillment value of the returned promise. So the data that we receive as an input to the function attached to the chained then(), is the fulfilled value of the promise returned.

// In this way, we get rid of the Callback Hell where Because now indeed one callback function is defined inside of another. Here we always return a promise and then handle it outside by simply continuing the chain.

// MARK: HANDLING ERRORS: Into the then method, the first callback function is always gonna be called for the fulfilled promise. But we can also pass in a second callback which will be called when the promise was rejected, by writing something like err => alert('no neighbour').

// Now, the errors basically propagate down the chain until they are caught, So we need to set the second argument for every then() method which is really annoying.

// So there is a better way of handling all these errors globally. We can handle all the errors no matter where they appear in the chain, right at the end of the chain by adding a catch method. And then we can use the same call back function. So this catch method at the end of the chain will catch any errors that occur in any place in this whole promise chain no matter where that is.

// Actually, the error (err) that is generated is a real JavaScript object. So we can create errors in JavaScript with a constructor, just like a map or a set. And any err contains the message property, to print the message of that error and not the whole object itself.

// Besides then and catch there is also the FINALLY method. The callback function defined in it will always be called whatever happens with the promise, no matter if the promise is fulfilled or rejected. One good example of using finally is to hide a loading spinner (rotating circles) that you we everywhere in web applications when you load some data. So these applications show a spinner when an asynchronous operation starts and then hide it once the operation completes.
// And in our case, what we always need to do is to fade-in the container. Note that this can only work if catch itself also returns a promise.

// MARK: THROWING ERRORS MANUALLY:
// Here, when we write a random word which is not a country name, we get two error: a Type error and a 404 ERROR. The Fetch promise gets rejected when there is no internet connection, but with a 404 ERROR, the fetch promise will still get fulfilled. So there is no rejection and so our catch handler cannot pick up on this error. So we have to manually make the promise rejected right away.
// For this, we need to look at the response object (in the first then method). In it, there is a property called OK which is set to FALSE whenever a 404 error occurs. So we can now use the fact that this response has the Ok property set to false to basically reject the promise, ourselves manually.
// throw keyword which will immediately terminate the current function just like return does it. Now the effect of creating and throwing an error in any of these then method is that the promise will immediately reject. So basically, the promise returned by this then handler here will be a rejected promise. And that rejection will then propagate all the way down to the catch handler.

/* MARK: Coding Challenge #1:
In this challenge you will build a function 'whereAmI' which renders a country only based on GPS coordinates. For that, you will use a second API to geocode coordinates. So in this challenge, you’ll use an API on your own for the first time.
Your tasks:
PART 1
1. Create a function 'whereAmI' which takes as inputs a latitude value ('lat') and a longitude value ('lng') (these are GPS coordinates, examples are in testdata below).
2. Do “reverse geocoding” of the provided coordinates. Reverse geocoding means to convert coordinates to a meaningful location, like a city and country name. Use this API to do reverse geocoding: https://geocode.xyz/api. The AJAX call will be done to a URL with this format: https://geocode.xyz/52.508,13.381?geoit=json. Use the fetch API and promises to get the data.
3. Once you have the data, take a look at it in the console to see all the attributes that you received about the provided location. Then, using this data, log a message like this to the console: “You are in Berlin, Germany”
4. Chain a .catch method to the end of the promise chain and log errors to the console
5. This API allows you to make only 3 requests per second. If you reload fast, you will get this error with code 403. This is an error with the request. Remember, fetch() does not reject the promise in this case. So create an error to reject the promise yourself, with a meaningful error message PART 2
6. Now it's time to use the received data to render a country. So take the relevant attribute from the geocoding API result, and plug it into the countries API that we have been using.
7. Render the country and catch any errors, just like we have done in the last lecture (you can even copy this code, no need to type the same code)
Test data:
§ Coordinates 1: 52.508, 13.381 (Latitude, Longitude)
§ Coordinates 2: 19.037, 72.873
§ Coordinates 3: -33.933, 18.474  */

const whereAmI = function (lati, longi) {
  fetch(`https://geocode.xyz/${lati},${longi}?geoit=json`)
    .then(response => {
      console.log(response);
      if (!response.ok)
        throw new Error(`Problem with geocoding! ${response.status}`);
      return response.json();
    })
    .then(data => {
      return fetch(`https://restcountries.com/v3/name/${data.country}`);
      //renderCountry(data.country);
      // console.log(`You are in ${data.city}, ${data.country}`);
    })
    .then(response => response.json())
    .then(data => {
      // console.log(data[0]);
      renderCountry(data[0]);
    })
    .catch(err => renderError(err.message))
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};
// SHOW: whereAmI(52.508, 13.381);

// MARK: EVENT LOOPS:
// The event loop takes callbacks from the callback queue and puts them into call stack so that they can be executed. So the event loop is the essential piece that makes asynchronous behavior possible in JavaScript. It's the reason why we can have a non blocking concurrency model in JavaScript.

// As we already know, everything related to the DOM is not really part of JavaScript, but of the web APIs. And so it's in a web APIs environment where the asynchronous tasks related to the DOM will run. In fact, the same is true for timers, AJAX calls, and all other asynchronous tasks.

/* Consider the following piece of code:
el = document.quesrySelector('img');
el.src = 'dog.jpg';
el.addEventListener('load', () => {
  el.classList.add('fadeIn');
});

fetch('https://someurl.com/api').then(res => console.log(res));  */

// 1) From th first two lines, the image starts loading asynchronously in the web APIs environment and not in the call stack.
// 2) We then used addEventListener to attach a callback function to the image load event. And this callback is asynchronous code, it's a code that we deferred into the future because we only want to execute it once the image has loaded.
// 3) And in the meantime, the rest of the code kept running. Now addEventListener did not put the callback directly in the callback queue. It simply registered the callback, which then kept waiting in the web APIs environment until the load event was fired off. Only then the environment put the call back into queue.
// 4) Then while in the queue the callback kept waiting for the event loop to pick it up and put it on the call stack. And this happened as soon as the callback was first in line and the call stack was empty.
// 5) MARK: MICROTASKS QUEUE: Now we still have to fetch function in our code, getting data from the AJAX call in the background. Now with promises, things work in a slightly different way.
// 6) So, let's say that the data has now finally arrived and so the fetch is done. Now, callbacks related to promises do actually not go into the callback queue. Instead, callbacks of promises have a special queue for themselves, which is the so called MICROTASKS QUEUE.
// 7) This microtasks queue is has priority over the callback queue. So, at the end of an event loop tick, so after a callback has been taken from the callback queue, the event loop will check if there are any callbacks in the microtasks queue. And if there are, it will run all of them before it will run any more callbacks from the regular callback queue. By the way, we call these callbacks from promises MICROTASKS.
// 8) And this means that the microtasks queue can essentially starve the callback queue. Because if we keep adding more and more microtasks, then callbacks in the callback queue can never execute.

/* SHOW: console.log('Test start'); // Printed first

setTimeout(() => console.log('0 sec timer'), 0); // Printed fifth

Promise.resolve('Resolved promise 1').then(res => console.log(res)); // Printed third

Promise.resolve('Resolved promise 2').then(res => {
  for (let i = 0; i < 1000000000; i++) {}
  console.log(res); // Printed fourth
});
console.log('Test end'); // Printed second */

// Here the setTimeout function will fire the timer after exactly zero seconds. So what that means is that after zero seconds, this callback will be put on the callback queue.
// Second we create a promise. Promise.resolve allows us to build a promise, so to create a promise that is immediately resolved. And the fulfilled success value, is gonna be this one we passed in.
// Now any top level of code, that means the code outside of any callback, will run first. And so the first two logs will come from these two synchronous console.logs.
// Now both the timer and the promise will finish at the exact same time. The timer because we told it to finish after zero seconds and a promise because we told it to immediately become resolved.
// The timer's callback will be put on the callback queue, and the callback of the resolved promise will be put on the micro-tasks queue and this micro-tasks queue has priority over the callback queue, And therefore the one from the micro tests queue should be executed first.
// If one of the micro-tasks takes a long time to run, then the timer will actually be delayed and not run after the zero seconds. So instead it will run a little bit later just after the micro-task is actually done with its work. That is what happens in our code with Resolved promise 2:
// The asynchronous task resulting to the second microtask will finish at an instant, what takes the long time is the microtask itself which will be executed inside the call stack. That's why the timer callback, which is selected after both the microtaks, will also gets delayed.

// MARK: BUILDING A PROMISE:
// Lets simulate a lottery using a promise. Here a fulfilled promise means to win the lottery while a rejected promise means to lose.
// We create a new promise using the promise constructor (promises are just a special kind of object in JavaScript).
// Now the promise constructor takes exactly one argument and that is the so-called executor function. Now, as soon as the promise constructor runs, it will automatically execute this executor function that we pass in. And as it executes this function here, it will do so by passing in two other arguments: resolve and reject functions.
// In order to set the promise as fulfilled, we use the resolve function. Now into the resolved function, we pass the fulfilled value of the promise so that it can later be consumed with the then method.
// Now to Mark the promise as rejected, we can call the reject function. Then into the reject function, we pass in the error message that we later want to be able to catch in the catch handler.
// Now this executor function will contain the asynchronous behavior that we're trying to handle with the promise. So this executor function should eventually produce a result value (the future value of the promise).

// Building a Promise:
const lotteryPromise = new Promise(function (resolve, reject) {
  // SHOW: console.log('Lottery is happening 💫');

  setTimeout(function () {
    if (Math.random() >= 0.5) {
      // SHOW: resolve('You Win!');
    } else {
      // SHOW:      reject(new Error('You Lose! Better Luck Next time.'));
    }
  }, 2000);
});
// Consuming a Promise:
/* SHOW: lotteryPromise
  .then(response => console.log(response))
  .catch(err => console.error(err)); */

// In practice, most of the time all we actually do is to consume promises. We usually only built promises to wrap old callback based functions into promises (microtask). This process is what we call PROMISIFYING, which means to convert callback based asynchronous behavior to promise based.

// PROMISIFYING setTimeout:
const wait = function (seconds) {
  return new Promise(function (resolve) {
    // no need for the reject
    setTimeout(resolve, seconds * 1000); // here the callback function that we want to be called after a certain time is resolve function. Nothing to be passed in it.
  });
};
/* SHOW: 
  wait(1)
  .then(() => {
    console.log('1 second passed');
    return wait(1);
  })
  .then(() => {
    console.log('2 second passed');
    return wait(1);
  })
  .then(() => {
    console.log('3 second passed');
    return wait(1);
  })
  .then(() => {
    console.log('4 second passed');
    return wait(1);
  });    


// Creating a fullfilled and rejected Promise:
Promise.resolve('abc').then(resp => console.log(resp));
Promise.reject('xyz').then(resp => console.error(resp));   */

// MARK: PROMISIFYING GEOLOCATION API:
// To use geolocation API, we use navigator.geolocation.getcurrentposition, and then this function here accepts two callbacks where the first is for the success and the second one is for the error.
// The first callback function actually gets access to the position object and the second callback with the error.
// JavaScript asks us for permission here and when we allow, then at some point when JavaScript actually figures out the location, then we get that data back.

navigator.geolocation.getCurrentPosition(
  position => console.log(/*position*/),
  err => console.log(/*err*/)
);
// This is actually asynchronous behavior because this function offloaded its work to the background. So this is very clearly a callback based API. So we would promisify this callback based API, to a promise based API:

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
// SHOW: getPosition().then(pos => console.log(pos.coords));

// Reversed Geocoding using these Coordinates:

const whereAmI2 = function () {
  getPosition()
    .then(pos => {
      const { latitude: lati, longitude: longi } = pos.coords;
      return fetch(`https://geocode.xyz/${lati},${longi}?geoit=json`);
    })
    .then(response => {
      console.log(response);
      if (!response.ok)
        throw new Error(`Problem with geocoding! ${response.status}`);
      return response.json();
    })
    .then(data => {
      return fetch(`https://restcountries.com/v3/name/${data.country}`);
    })
    .then(response => response.json())
    .then(data => {
      btn.classList.add('hidebtn');
      renderCountry(data[0]);
    })
    .catch(err => console.log(err.message))
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};
const whereAmI2button = function () {
  btn.classList.remove('hidebtn');
  btn.addEventListener('click', whereAmI2);
};
// SHOW: whereAmI2button();

/* MARK: CODING CHALLENGE #2

Your tasks:
PART 1
1. Create a function 'createImage' which receives 'imgPath' as an input. This function returns a promise which creates a new image (use document.createElement('img')) and sets the .src attribute to the provided image path
2. When the image is done loading, append it to the DOM element with the 'images' class, and resolve the promise. The fulfilled value should be the image element itself. In case there is an error loading the image (listen for the'error' event), reject the promise
3. If this part is too tricky for you, just watch the first part of the solution PART 2
4. Consume the promise using .then and also add an error handler
5. After the image has loaded, pause execution for 2 seconds using the 'wait' function we created earlier
6. After the 2 seconds have passed, hide the current image (set display CSS property to 'none'), and load a second image (Hint: Use the image element returned by the 'createImage' promise to hide the current image. You will need a global variable for that )
7. After the second image has loaded, pause execution for 2 seconds again
8. After the 2 seconds have passed, hide the current image 
Test data: Images in the img folder. Test the error handler by passing a wrong image path. Set the network speed to “Fast 3G” in the dev tools Network tab, otherwise images load too fast   */

const waitForImageDisappear = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

const imgContainer = document.querySelector('.images');

const createImage = function (imgPath) {
  return new Promise(function (resolve, reject) {
    const img = document.createElement('img');
    img.src = imgPath;
    img.addEventListener('load', function () {
      imgContainer.append(img);
      resolve(img);
    });
    img.addEventListener('error', function () {
      reject(new Error('Image not found'));
    });
  });
};
let currenImage;
/* SHOW: createImage('img/img-1.jpg')
  .then(img => {
    currenImage = img;
    console.log('Image 1 loaded');
    return waitForImageDisappear(2);
  })
  .then(() => {
    currenImage.style.display = 'none';
    return createImage('img/img-2.jpg');
  })
  .then(img => {
    currenImage = img;
    console.log('Image 2 loaded');
    return waitForImageDisappear(2);
  })
  .then(() => {
    currenImage.style.display = 'none';
    return createImage('img/img-3.jpg');
  })
  .then(img => {
    currenImage = img;
    console.log('Image 3 loaded');
    return waitForImageDisappear(2);
  })
  .catch(err => console.log(err));   */

// MARK: CONSUMING PROMISES WITH ASYNC/AWAIT:
// Since ES 2017, there is now an even better and easier way to consume promises, which is called as async/await.
// Here we will recreate the whereAmI function.
// We start by creating a special kind of function which is async function. This is an asynchronous function, that will basically keep running in the background while performing the code that inside of it.
// Inside async function, we can have one or more await statements where we need a promise.
// And so in async function, we can use the await keyword to basically await for the result of the promise. So basically await will stop decode execution at this

// point of the function until the premise is fulfilled.

const whereAmIasync = async function (country) {
  await fetch(`https://restcountries.com/v3/name/${country}`);
};
