import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';

// Business Logic for crypto
function crypto(currency) {
  let promise = new Promise(function(resolve, reject){
    let request = new XMLHttpRequest();
    const url = `https://api.nomics.com/v1/currencies/ticker?key=${process.env.API_KEY}&ids=${currency}&interval=1d,30d&per-page=100&page=1`;
    request.addEventListener("loadend", function(){
      const response = JSON.parse(this.responseText);
      if (this.status === 200) {
        resolve([response, currency]);
      } else {
        reject([this, response, currency]);
      }
    });
    request.open("GET",url,true);
    request.send();
  });

  promise.then(function(responseDataArray){
    printElements(responseDataArray);
  }, function(errorMessage) {
    printError(errorMessage);
  });
}

// Business Logic for exchange
/* function exchange(from, to) {   //Calculates the current price of a given cryptocurrency in another currency like USD, Euro, etc. 
  let promise = new Promise(function(resolve, reject){
    let request = new XMLHttpRequest();
    const url = `https://api.exchangerate.host/convert?from=${from}&to=${to}`;
    request.addEventListener("loadend", function(){
      const response = JSON.parse(this.responseText);
      if (this.status === 200) {
        resolve([response, from, to]);
      } else {
        reject([this, response, from, to]);
      }
    });
    request.open("GET",url,true);
    request.send();
  });

  promise.then(function(responseDataArray){
    printElements1(responseDataArray);
  }, function(errorMessage) {
    printError1(errorMessage);
  });
}


// UI Logic (for 'exchange' Business Logic only)
function printElements1(data) {
  document.querySelector().innerText = 
  `from ${data[0].from} to ${data[0].to}:  ${data[0]}`;  
}

function printError1(errorMsg) {
  document.getElementById('response').innerText = `You have the following Error:  ${errorMsg}`;
}  */


// UI Logic (for 'crypto' Business Logic only)
function printElements(data) {
  document.getElementById("responseContent").innerText = `
  Name: ${data[0][0].name}
  Price: $${Math.round(data[0][0].price *100) / 100}    
  Rank: ${data[0][0].rank}


  Currency Status:  ${data[0][0].status}
  Number of currently-occurring trades for this currency:  ${data[0][0].num_exchanges}

  (Last updated: ${data[0][0].price_timestamp})
  `;

  document.getElementById("image").setAttribute("src",`${data[0][0].logo_url}`);  
}

function printError(errorMsg) {
  document.getElementById('response').innerText = `You have the following Error:  ${errorMsg}`;
} 

function handleFormSubmission(event) {
  event.preventDefault();
  document.getElementById("response").removeAttribute("class");
  const currency = document.querySelector('input#uIn1').value;
  crypto(currency); 
  //exchange();
}

window.addEventListener("load", function() {
  document.querySelector('form#crypto-input-form').addEventListener("submit", handleFormSubmission);
});