import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';

// Business Logic
function crypto(currency) {
  let promise = new Promise(function(resolve, reject){
    let request = new XMLHttpRequest();
    const url = `https://api.nomics.com/v1/currencies/ticker?key=${process.env.API_KEY}&ids=${currency}&interval=1d,30d&convert=EUR&per-page=100&page=1`;
    request.addEventListener("loadend", function(){
      const response = JSON.parse(this.responseText);
      if (this.status === 200) {
        resolve([response, currency,]);
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

// UI Logic 
function printElements(data) {
  console.log(data[0][0].logo_url);

  document.querySelector('div#response').innerText = `Data (price) =  ${data[0][0].price}`;
  document.getElementById("image").setAttribute("src",`${data[0][0].logo_url}`);  
}

function printError(errorMsg) {
  document.getElementById('response').innerText = `You have the following Error:  ${errorMsg}`;
} 

function handleFormSubmission(event) {
  event.preventDefault();
  const currency = document.querySelector('input#uIn1').value;
  document.querySelector('input#uIn1').value = null;
  crypto(currency); 
}

window.addEventListener("load", function() {
  document.querySelector('form#crypto-input-form').addEventListener("submit", handleFormSubmission);
});