/* global data */
/* exported data */
var $buttonContainer = document.querySelector('.button-container');
var $buttons = document.querySelectorAll('button.clue');
var $modal = document.querySelector('.modal-off');
var $views = document.querySelectorAll('.view');
var $clue = document.querySelector('.clue-text');
var $answer = document.querySelector('.answer');
var $points = document.querySelector('.points');
var $yesButton = document.querySelector('#yes');
var $noButton = document.querySelector('#no');
var $qCorrectHeader = document.querySelector('span.q-correct');
var $pointsHeader = document.querySelector('span.score');
var buttonTarget;

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

$buttonContainer.addEventListener('click', openModal);

function openModal(event) {
  $modal.classList.remove('modal-off');
  $modal.classList.add('modal-on');
  buttonTarget = event.target;
  displayClue();
}

function closeModal(event) {
  $modal.classList.remove('modal-on');
  $modal.classList.add('modal-off');
  resetView();
}

function displayClue() {
  for (var i = 0; i < data.clues.length; i++) {
    if (parseInt(event.target.textContent) === data.clues[i].entryId) {
      $clue.textContent = data.clues[i].question;
      $answer.textContent = 'Answer: ' + data.clues[i].answer;
      $points.textContent = 'Points: ' + data.clues[i].points;
      data.currentlyAnswering = data.clues[i];
      return;
    }
  }
}

$modal.addEventListener('click', handleModal);

function handleModal(event) {
  var $modalOn = document.querySelector('.modal-on');
  if (event.target !== $modalOn) {
    // if you click inside the white card of the modal, then run this loop
    for (var i = 0; i < $buttons.length; i++) {
      if (buttonTarget === $buttons[i]) {
        if (data.clues[i].completed === 'yes') {
          returnToQuestions();
        }
      }
    }
    showAnswer();
  } else {
    closeModal();

  }
}

function showAnswer() {
  for (var i = 0; i < $views.length; i++) {
    if ($views[i].getAttribute('data-modal') === 'answer') {
      $views[i].classList.remove('hidden');
    } else if ($views[i].getAttribute('data-modal') === 'click-to-see-answer') {
      $views[i].classList.add('hidden');
    }
  }
}

function returnToQuestions() {
  for (var i = 0; i < $views.length; i++) {
    if ($views[i].getAttribute('data-modal') === 'return') {
      $views[i].classList.remove('hidden');
    } else if ($views[i].getAttribute('data-modal') === 'question' ||
      $views[i].getAttribute('data-modal') === 'click-to-see-answer') {
      $views[i].classList.add('hidden');
    }
  }
}

function handleYes() {
  data.currentlyAnswering.completed = 'yes';
  data.questionsCorrect.push(data.currentlyAnswering);
  data.score += data.currentlyAnswering.points;
  $qCorrectHeader.textContent = data.questionsCorrect.length;
  $pointsHeader.textContent = data.score;
  data.currentlyAnswering = null;
  grayClue();
  closeModal();

}

function handleNo() {
  data.currentlyAnswering.completed = 'yes';
  data.currentlyAnswering = null;
  grayClue();
  closeModal();

}

function resetView() {
  for (var i = 0; i < $views.length; i++) {
    if ($views[i].getAttribute('data-modal') === 'question') {
      $views[i].classList.remove('hidden');
    } else if ($views[i].getAttribute('data-modal') === 'click-to-see-answer') {
      $views[i].classList.remove('hidden');
    } else if ($views[i].getAttribute('data-modal') === 'answer') {
      $views[i].classList.add('hidden');
    }
  }
}

$yesButton.addEventListener('click', handleYes);
$noButton.addEventListener('click', handleNo);

function grayClue() {
  for (var i = 0; i < data.clues.length; i++) {
    if (data.clues[i].completed === 'yes') {
      $buttons[i].setAttribute('id', 'answered');
    }
  }
}
