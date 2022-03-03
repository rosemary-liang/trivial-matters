/* global data */
/* exported data */

// dom queries

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
var $favoriteContainer = document.querySelector('.favorite');
var $favoriteButton = document.querySelector('button.fa');
var $starIcon = document.querySelector('.fa-star');
var $returnButton = document.querySelector('#return');
var $navViews = document.querySelectorAll('.nav-view');
var $cardContainerQCorrect = document.querySelector('.container-questions-correct');
var $backToQuestionsButton = document.querySelector('button.back-to-questions');
var $qCorrectButton = document.querySelector('#nav-questions-correct');
var headerLinkClicked;

// event listeners

window.addEventListener('load', loadFromStorage);
$buttonContainer.addEventListener('click', openModal);
$modal.addEventListener('click', handleModal);
$yesButton.addEventListener('click', handleYes);
$noButton.addEventListener('click', handleNo);
$returnButton.addEventListener('click', closeModal);
$favoriteButton.addEventListener('click', handleFavorite);
$backToQuestionsButton.addEventListener('click', navToGrid);
$backToQuestionsButton.addEventListener('click', blackHeaderLink);
$qCorrectButton.addEventListener('click', navToQuestionsCorrect);
$qCorrectButton.addEventListener('click', blueHeaderLink);

// function calls

closeModal();
getClues();
renderQuestionsCorrect();
navToGrid();

// function definitions

function getClues() {
  if (data.clues.length === 0) {
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
        clueData.favorite = null;
        clueData.correct = null;
        clueData.entryId = data.nextEntryId;
        data.clues.push(clueData);
        data.nextEntryId++;
      }
    });
    xhr.send();
  }
}

function loadFromStorage() {
  grayClue();
  countCorrect();
  $pointsHeader.textContent = data.score;
}

function openModal(event) {
  $modal.classList.remove('modal-off');
  $modal.classList.add('modal-on');
  buttonTarget = event.target;
  for (var i = 0; i < $buttons.length; i++) {
    if (buttonTarget === $buttons[i]) {
      if (data.clues[i].completed === true) {
        returnToQuestions();
        return;
      } else {
        displayClue();
        return;
      }
    }
  }
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

function handleModal(event) {
  var $modalOn = document.querySelector('.modal-on');
  if (event.target !== $modalOn) {
    for (var i = 0; i < $buttons.length; i++) {
      if (buttonTarget === $buttons[i] &&
      data.clues[i].completed === null) {
        showAnswer();
        return;
      }
    }
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
  if ($favoriteContainer.classList.contains('hidden')) {
    $favoriteContainer.classList.remove('hidden');
  }
}

function returnToQuestions() {
  for (var i = 0; i < $views.length; i++) {
    if ($views[i].getAttribute('data-modal') === 'return') {
      $views[i].classList.remove('hidden');
    } else if ($views[i].getAttribute('data-modal') === 'question' ||
      $views[i].getAttribute('data-modal') === 'click-to-see-answer' ||
      $views[i].getAttribute('data-modal') === 'answer') {
      $views[i].classList.add('hidden');
    }
  }
}

function handleYes() {
  data.currentlyAnswering.completed = true;
  data.currentlyAnswering.correct = true;
  data.score += data.currentlyAnswering.points;
  countCorrect();
  $pointsHeader.textContent = data.score;
  data.currentlyAnswering = null;
  grayClue();
  closeModal();

}

function countCorrect() {
  var counter = 0;
  for (var i = 0; i < data.clues.length; i++) {
    if (data.clues[i].correct === true) {
      counter += 1;
    }
  }
  $qCorrectHeader.textContent = counter;
  counter = 0;
}

function handleNo() {
  data.currentlyAnswering.completed = true;
  data.currentlyAnswering.correct = false;
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
    } else if ($views[i].getAttribute('data-modal') === 'return') {
      $views[i].classList.add('hidden');
    }
  }

  if (!($favoriteContainer.classList.contains('hidden'))) {
    $favoriteContainer.classList.add('hidden');
  }
}

function grayClue() {
  for (var i = 0; i < data.clues.length; i++) {
    if (data.clues[i].completed === true) {
      $buttons[i].setAttribute('id', 'answered');
    }
  }
}

function yellowStar() {
  if (!($starIcon.classList.contains('fa-star-yellow'))) {
    $starIcon.classList.add('fa-star-yellow');
  }
  if ($starIcon.classList.contains('fa-star-gray')) {
    $starIcon.classList.remove('fa-star-gray');
  }
}

function grayStar() {
  if (!($starIcon.classList.contains('fa-star-gray'))) {
    $starIcon.classList.add('fa-star-gray');
  }
  if ($starIcon.classList.contains('fa-star-yellow')) {
    $starIcon.classList.remove('fa-star-yellow');
  }
}

function handleFavorite() {
  var buttonTargetId = parseInt(buttonTarget.textContent);
  for (var i = 0; i < data.clues.length; i++) {
    if (data.clues[i].entryId === buttonTargetId &&
        data.clues[i].favorite !== true) {
      data.clues[i].favorite = true;
      yellowStar();
    } else if (data.clues[i].entryId === buttonTargetId &&
      data.clues[i].favorite === true) {
      data.clues[i].favorite = null;
      grayStar();
    }
  }
}

function renderQuestionsCorrect() {
  for (var i = 0; i < data.clues.length; i++) {
    if (data.clues[i].correct === true) {

      var divCard = document.createElement('div');
      divCard.setAttribute('class', 'container card-in-list bg-white margin-b-1-rem margin-t-05-rem padding-1-rem border-solid border-thin box-shadow ');
      $cardContainerQCorrect.appendChild(divCard);

      var divCardContent = document.createElement('div');
      divCardContent.setAttribute('class', 'card-content padding-2-rem');
      divCard.appendChild(divCardContent);

      var divFavorite = document.createElement('div');
      divFavorite.setAttribute('class', 'favorite display-flex flex-end');
      divCard.prepend(divFavorite);

      var buttonFa = document.createElement('button');
      buttonFa.setAttribute('class', 'fa');
      divFavorite.appendChild(buttonFa);

      var iStar = document.createElement('i');
      // set attribute based on whether is favorite or not
      iStar.setAttribute('class', 'fa-solid fa-star font-size-15-rem grow fa-star-gray');
      buttonFa.appendChild(iStar);

      var divCardTextContent = document.createElement('div');
      divCardTextContent.setAttribute('class', 'card-text-content padding-right-05-rem');
      divCardContent.appendChild(divCardTextContent);

      var pClueText = document.createElement('p');
      pClueText.setAttribute('class', 'clue-text roboto font-weight-500 margin-b-2-rem');
      pClueText.textContent = data.clues[i].question;
      divCardContent.appendChild(pClueText);

      var pAnswer = document.createElement('p');
      pAnswer.setAttribute('class', 'answer roboto font-weight-500');
      pAnswer.textContent = 'Answer: ' + data.clues[i].answer;
      divCardContent.appendChild(pAnswer);

      var pPoints = document.createElement('p');
      pPoints.setAttribute('class', 'points roboto font-weight-500 margin-b-2-rem');
      pPoints.textContent = 'Points: ' + data.clues[i].points;
      divCardContent.appendChild(pPoints);
    }
  }
}

function navToGrid() {
  for (var i = 0; i < $navViews.length; i++) {
    if ($navViews[i].getAttribute('data-view') === 'grid' && $navViews[i].classList.contains('hidden')) {
      $navViews[i].classList.remove('hidden');
    } else if ($navViews[i].getAttribute('data-view') === 'questions-correct' && (!$navViews[i].classList.contains('hidden'))) {
      $navViews[i].classList.add('hidden');
    } else if ($navViews[i].getAttribute('data-view') === 'favorites' && (!$navViews[i].classList.contains('hidden'))) {
      $navViews[i].classList.add('hidden');
    }
  }
}

function navToQuestionsCorrect() {
  for (var i = 0; i < $navViews.length; i++) {
    if ($navViews[i].getAttribute('data-view') === 'questions-correct' && $navViews[i].classList.contains('hidden')) {
      $navViews[i].classList.remove('hidden');
    } else if ($navViews[i].getAttribute('data-view') === 'grid' && (!$navViews[i].classList.contains('hidden'))) {
      $navViews[i].classList.add('hidden');
    } else if ($navViews[i].getAttribute('data-view') === 'favorites' && (!$navViews[i].classList.contains('hidden'))) {
      $navViews[i].classList.add('hidden');
    }
  }
}

function blueHeaderLink(event) {
  headerLinkClicked = event.target;
  headerLinkClicked.classList.remove('font-black');
  headerLinkClicked.classList.add('font-light-blue');

}

function blackHeaderLink() {
  headerLinkClicked.classList.remove('font-light-blue');
  headerLinkClicked.classList.add('font-black');
  headerLinkClicked = null;
}
