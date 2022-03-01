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
      clueData.completed = null;
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

function closeModal(event) {
  $modal.classList.remove('modal-on');
  $modal.classList.add('modal-off');
}

var $clue = document.querySelector('.clue-text');
var $answer = document.querySelector('.answer');
var $points = document.querySelector('.points');

function displayClue() {
  for (var i = 0; i < data.clues.length; i++) {
    if (parseInt(event.target.textContent) === data.clues[i].entryId) {
      $clue.textContent = data.clues[i].question;
      $answer.textContent = 'Answer: ' + data.clues[i].answer;
      $points.textContent = 'Points: ' + data.clues[i].points;
      return;
    }
  }
}

// return to questions if overlay clicked
$modal.addEventListener('click', handleModal);

// var $views = document.querySelectorAll('.view');
// var $
// function showAnswer() {

// }

function handleModal(event) {
  // console.log('event.target', event.target);
  var $modalOn = document.querySelector('.modal-on');
  if (event.target !== $modalOn) {
    // showAnswer();
  } else {
    closeModal();
  }
}
