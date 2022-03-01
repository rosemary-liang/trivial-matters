/* global data */
/* exported data */

function getClues() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://jservice.io/api/random/?count=9');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    for (var i = 0; i < xhr.response.length; i++) {
      var clueData = {
      };
      clueData.question = xhr.response[i].question;
      clueData.answer = xhr.response[i].answer;
      clueData.points = xhr.response[i].value;
      clueData.entryId = data.nextEntryId;
      data.clues.push(clueData);
      data.nextEntryId++;
    }

  });
  xhr.send();
}

getClues();

var $buttonContainer = document.querySelector('.button-container');
$buttonContainer.addEventListener('click', openModal);

var $modal = document.querySelector('.modal-off');

function openModal(event) {
  $modal.classList.remove('modal-off');
  $modal.classList.add('modal-on');
  displayClue();
}

var $clue = document.querySelector('.clue-text');
var $answer = document.querySelector('.answer');
var $points = document.querySelector('.points');

function displayClue() {
  for (var i = 0; i < data.clues.length; i++) {
    if (parseInt(event.target.textContent) === data.clues[i].entryId) {
      $clue.textContent = data.clues[i].question;
      $answer.textContent = 'Answer: ' + data.clues[i].answer;
      $points.textContent = 'Score: ' + data.clues[i].points;
      return;
    }
  }
}
