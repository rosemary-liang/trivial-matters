function getClues() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://jservice.io/api/random/?count=9');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    // console.log(xhr.status);
    // console.log(xhr.response);

  });
  xhr.send();
}

getClues();
