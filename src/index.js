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
    //console.log("Data type of 'printElesRetval': " + typeof printElesRetval);  //Checking to see the type of value being returned here.
    //console.log(printElesRetval);
    /* return responseDataArray[0][0].price; */  
  }, function(errorMessage) {
    printError(errorMessage);
  });

}

// Business Logic for exchange
function exchange(to) {   //Calculates the current price of a given cryptocurrency in another currency like USD, Euro, etc. 
  let promise = new Promise(function(resolve, reject){
    let request = new XMLHttpRequest();
    const url = `https://api.exchangerate.host/convert?from=USD&to=${to}`;
    request.addEventListener("loadend", function(){
      const response = JSON.parse(this.responseText);
      if (this.status === 200) {
        //console.log("Data type of 'response.info.rate' is:  " + typeof response.info.rate);
        //console.log("Data type of 'price' is:  " + typeof price);
        //console.log(response.info.rate * price);
        resolve([response, to]);
      } else {
        reject([this, response, to]);
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
  document.getElementById("cryptoPrice").removeAttribute("class");
  const currCryptoPrice = parseFloat(document.getElementById("cryptoPrice").innerHTML);
  console.log("Data type of 'currCryptoPrice': " + typeof currCryptoPrice);
  let currRate = parseFloat(data[0].info.rate);
  let calculation = currRate * currCryptoPrice;
  console.log("Calculation" + calculation);
  document.getElementById("exchange-response").innerText = 
  `The exchange rate from USD to ${data[1]} is ${data[0].info.rate} 
  The price of this crypto currency in ${data[1]} is ${calculation}`;  
}

function printError1(errorMsg) {
  document.getElementById('exchange-response').innerText = `You have the following Error: ${errorMsg}`;
}  

function handleForm2Submission (event) {
  event.preventDefault();
  const to = document.getElementById("uIn2").value;
  exchange(to); 
}


// UI Logic (for 'crypto' Business Logic only)
function printElements(data) {
  let priceOfCrypto = Math.round(data[0][0].price *100) / 100;
  console.log("Type of priceOfCrypto:" + typeof priceOfCrypto);
  document.getElementById("cryptoPrice").innerHTML = priceOfCrypto;
  parseFloat(document.getElementById("cryptoPrice").innerHTML);
  console.log("Value of innerText" + document.getElementById("cryptoPrice").innerHTML);
  console.log("Type of priceOfCrypto as innerText: " + typeof parseFloat(document.getElementById("cryptoPrice").innerHTML) + document.getElementById("cryptoPrice").innerText);

  document.getElementById("responseContent").innerText = `
  Name: ${data[0][0].name}
  Rank: ${data[0][0].rank}

  Price: ${Math.round(data[0][0].price *100) / 100}
  Currency Status:  ${data[0][0].status}
  Number of currently-occurring trades for this currency:  ${data[0][0].num_exchanges}

  (Last updated: ${data[0][0].price_timestamp})
  `;

  document.getElementById("image").setAttribute("src",`${data[0][0].logo_url}`);
  // let retval = data[0][0].price; 
  // console.log("Data type of 'retval' in function 'printElements': " + typeof retval);  //Checking to see the type of value being returned here.
  // return data[0][0].price;
}

function printError(errorMsg) {
  document.getElementById('response').innerText = `You have the following Error:  ${errorMsg}`;
} 

function handleFormSubmission(event) {
  event.preventDefault();
  document.getElementById("response").removeAttribute("class");
  const currency = document.querySelector('input#uIn1').value;
  crypto(currency);
  //let retvalType = crypto(currency); 
  //let returnedPrice = printElements(data); 
  //console.log(typeof retvalType);  //Checking to see the type of value being returned by the crypto function.
}

window.addEventListener("load", function() {
  document.querySelector('form#crypto-input-form').addEventListener("submit", handleFormSubmission);
  document.querySelector('form#exchange-input-form').addEventListener("submit", handleForm2Submission);

});