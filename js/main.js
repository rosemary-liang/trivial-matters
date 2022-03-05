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
var $starButton = document.querySelector('button.fa');
var $starIcon = document.querySelector('.fa-star');
var $returnButton = document.querySelector('#return');
var $navViews = document.querySelectorAll('.nav-view');
var $cardContainerQCorrect = document.querySelector('.container-questions-correct');
var $backToQuestionsButton = document.querySelector('button.back-to-questions-1');
var $backToQuestionsButton2 = document.querySelector('button.back-to-questions-2');
var $qCorrectButton = document.querySelector('#nav-questions-correct');
var $cardContainerFavorites = document.querySelector('.container-favorites');
var $favoritesButton = document.querySelector('#nav-favorites');
var $resetButton = document.querySelector('#reset');
var $finalScore = document.querySelector('#final-score');

// event listeners

window.addEventListener('load', loadFromStorage);
$buttonContainer.addEventListener('click', openModal);
$modal.addEventListener('click', handleModal);
$yesButton.addEventListener('click', handleYes);
$noButton.addEventListener('click', handleNo);
$returnButton.addEventListener('click', closeModal);
$starButton.addEventListener('click', handleFavorite);
$backToQuestionsButton.addEventListener('click', navToGrid);
$backToQuestionsButton2.addEventListener('click', navToGrid);
$qCorrectButton.addEventListener('click', navToQuestionsCorrect);
$favoritesButton.addEventListener('click', navToFavorites);
$cardContainerFavorites.addEventListener('click', handleFavoriteinFavCardList);
$cardContainerQCorrect.addEventListener('click', handleFavoriteinQCardList);
$resetButton.addEventListener('click', resetAll);

// function calls

closeModal();
getClues();
renderQuestionsCorrect();
renderFavorites();
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
        checkIfAllAnswered();
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
  if (event.target !== $modalOn && event.target !== $resetButton) {
    for (var i = 0; i < $buttons.length; i++) {
      if (buttonTarget === $buttons[i] &&
      data.clues[i].completed !== true) {
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
  buttonTarget = event.target;
  data.currentlyAnswering.completed = true;
  data.currentlyAnswering.correct = true;
  data.score += data.currentlyAnswering.points;
  countCorrect();
  $pointsHeader.textContent = data.score;
  data.currentlyAnswering = null;
  grayClue();
  checkIfAllAnswered();

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
  buttonTarget = event.target;
  data.currentlyAnswering.completed = true;
  data.currentlyAnswering.correct = false;
  data.currentlyAnswering = null;
  grayClue();
  checkIfAllAnswered();

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
    } else if ($views[i].getAttribute('data-modal') === 'reset') {
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

function yellowStar(icon) {
  if (!(icon.classList.contains('fa-star-yellow'))) {
    icon.classList.add('fa-star-yellow');
  }
  if (icon.classList.contains('fa-star-gray')) {
    icon.classList.remove('fa-star-gray');
  }
}

function grayStar(icon) {
  if (!(icon.classList.contains('fa-star-gray'))) {
    icon.classList.add('fa-star-gray');
  }
  if (icon.classList.contains('fa-star-yellow')) {
    icon.classList.remove('fa-star-yellow');
  }
}

function handleFavorite() {
  var icon = $starIcon;
  var buttonTargetId = parseInt(buttonTarget.textContent);
  for (var i = 0; i < data.clues.length; i++) {
    if (data.clues[i].entryId === buttonTargetId &&
        data.clues[i].favorite !== true) {
      data.clues[i].favorite = true;
      yellowStar(icon);
    } else if (data.clues[i].entryId === buttonTargetId &&
      data.clues[i].favorite === true) {
      data.clues[i].favorite = null;
      grayStar(icon);
    }
  }
  return icon;
}

// favorites & questions correct views

function handleFavoriteinQCardList(event) {
  var buttonTargetId = parseInt(event.target.getAttribute('data-entryid'));
  var icon = event.target;
  for (var i = 0; i < data.clues.length; i++) {
    if (data.clues[i].entryId === buttonTargetId &&
      data.clues[i].favorite !== true) {
      data.clues[i].favorite = true;
      yellowStar(icon);

    } else if (data.clues[i].entryId === buttonTargetId &&
      data.clues[i].favorite === true) {
      data.clues[i].favorite = null;
      grayStar(icon);
    }
  }
}

function handleFavoriteinFavCardList(event) {
  var buttonTargetId = parseInt(event.target.getAttribute('data-entryid-fav'));
  var icon = event.target;
  for (var i = 0; i < data.clues.length; i++) {
    if (data.clues[i].entryId === buttonTargetId &&
      data.clues[i].favorite !== true) {
      data.clues[i].favorite = true;
      yellowStar(icon);

    } else if (data.clues[i].entryId === buttonTargetId &&
      data.clues[i].favorite === true) {
      data.clues[i].favorite = null;
      grayStar(icon);
    }
  }
}

function renderQuestionsCorrect() {
  for (var i = 0; i < data.clues.length; i++) {
    if (data.clues[i].correct === true) {
      renderQuestionCorrect(data.clues[i]);
    }
  }
}

function renderQuestionCorrect(clue) {
  var divCard = document.createElement('div');
  divCard.setAttribute('class', 'container card-in-list bg-white margin-b-1-rem margin-t-05-rem padding-1-rem border-solid border-thin box-shadow ');
  divCard.setAttribute('data-entryid', clue.entryId);
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
  if (clue.favorite === true) {
    iStar.setAttribute('class', 'fa-solid fa-star font-size-15-rem grow favorites-page fa-star-yellow');
  } else {
    iStar.setAttribute('class', 'fa-solid fa-star font-size-15-rem grow favorites-page fa-star-gray');
  }
  iStar.setAttribute('data-entryid', clue.entryId);
  buttonFa.appendChild(iStar);

  var divCardTextContent = document.createElement('div');
  divCardTextContent.setAttribute('class', 'card-text-content padding-right-05-rem');
  divCardContent.appendChild(divCardTextContent);

  var pClueText = document.createElement('p');
  pClueText.setAttribute('class', 'clue-text roboto font-weight-500 margin-b-2-rem');
  pClueText.textContent = clue.question;
  divCardContent.appendChild(pClueText);

  var pAnswer = document.createElement('p');
  pAnswer.setAttribute('class', 'answer roboto font-weight-500');
  pAnswer.textContent = 'Answer: ' + clue.answer;
  divCardContent.appendChild(pAnswer);

  var pPoints = document.createElement('p');
  pPoints.setAttribute('class', 'points roboto font-weight-500 margin-b-2-rem');
  pPoints.textContent = 'Points: ' + clue.points;
  divCardContent.appendChild(pPoints);

}

function renderFavorite(clue) {
  var divCard = document.createElement('div');
  divCard.setAttribute('class', 'container card-in-list bg-white margin-b-1-rem margin-t-05-rem padding-1-rem border-solid border-thin box-shadow ');
  divCard.setAttribute('data-entryid-fav', clue.entryId);
  $cardContainerFavorites.appendChild(divCard);

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
  iStar.setAttribute('class', 'fa-solid fa-star font-size-15-rem grow favorites-page fa-star-yellow');
  iStar.setAttribute('data-entryid-fav', clue.entryId);
  buttonFa.appendChild(iStar);

  var divCardTextContent = document.createElement('div');
  divCardTextContent.setAttribute('class', 'card-text-content padding-right-05-rem');
  divCardContent.appendChild(divCardTextContent);

  var pClueText = document.createElement('p');
  pClueText.setAttribute('class', 'clue-text roboto font-weight-500 margin-b-2-rem');
  pClueText.textContent = clue.question;
  divCardContent.appendChild(pClueText);

  var pAnswer = document.createElement('p');
  pAnswer.setAttribute('class', 'answer roboto font-weight-500');
  pAnswer.textContent = 'Answer: ' + clue.answer;
  divCardContent.appendChild(pAnswer);

  var pPoints = document.createElement('p');
  pPoints.setAttribute('class', 'points roboto font-weight-500 margin-b-2-rem');
  pPoints.textContent = 'Points: ' + clue.points;
  divCardContent.appendChild(pPoints);
}

function renderFavorites() {
  for (var i = 0; i < data.clues.length; i++) {
    if (data.clues[i].favorite === true) {
      renderFavorite(data.clues[i]);
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
  navButtonBlack($favoritesButton);
  navButtonBlack($qCorrectButton);

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
  navButtonBlue($qCorrectButton);
  navButtonBlack($favoritesButton);
  reRenderQuestionsCorrect();

  var $qEntryIds = document.querySelectorAll('i[data-entryid]');
  var qEntryIdsArray = [];
  for (var j = 0; j < $qEntryIds.length; j++) {
    qEntryIdsArray.push($qEntryIds[j]);
  }
  for (var k = 0; k < data.clues.length; k++) {
    if (qEntryIdsArray.includes(data.clues[k].entryId)) {
      for (var m = 0; m < $qEntryIds.length; m++) {
        if (data.clues[k].favorite === true) {
          yellowStar($qEntryIds[m]);
        } else if (data.clues[k].favorite === null) {
          grayStar($qEntryIds[m]);
        }
      }
    }
  }
}

function reRenderQuestionsCorrect() {
  var existingCardArray = [];
  var $existingCards = document.querySelectorAll('div[data-entryid]');
  for (var j = 0; j < $existingCards.length; j++) {
    var existingEntryId = parseInt($existingCards[j].getAttribute('data-entryid'));
    existingCardArray.push(existingEntryId);
  }

  for (var i = 0; i < data.clues.length; i++) {
    if (data.clues[i].completed === true) {
      if (!(existingCardArray.includes(data.clues[i].entryId))) {
        renderQuestionCorrect(data.clues[i]);
      }
    } else if (data.clues[i].completed !== true) {
      if (existingCardArray.includes(data.clues[i].entryId)) {
        for (var k = 0; k < $existingCards.length; k++) {
          if (data.clues[i].entryId === parseInt($existingCards[k].getAttribute('data-entryid'))) {
            $existingCards[k].remove();
          }
        }
      }
    }
  }
}

function navToFavorites() {
  for (var i = 0; i < $navViews.length; i++) {
    if ($navViews[i].getAttribute('data-view') === 'favorites' && $navViews[i].classList.contains('hidden')) {
      $navViews[i].classList.remove('hidden');
    } else if ($navViews[i].getAttribute('data-view') === 'grid' && (!$navViews[i].classList.contains('hidden'))) {
      $navViews[i].classList.add('hidden');
    } else if ($navViews[i].getAttribute('data-view') === 'questions-correct' && (!$navViews[i].classList.contains('hidden'))) {
      $navViews[i].classList.add('hidden');
    }
  }
  navButtonBlue($favoritesButton);
  navButtonBlack($qCorrectButton);
  reRenderFavorites();

}

function reRenderFavorites() {
  var existingCardArray = [];
  var $existingCards = document.querySelectorAll('div[data-entryid-fav]');
  for (var j = 0; j < $existingCards.length; j++) {
    var existingEntryId = parseInt($existingCards[j].getAttribute('data-entryid-fav'));
    existingCardArray.push(existingEntryId);
  }

  for (var i = 0; i < data.clues.length; i++) {
    if (data.clues[i].favorite === true) {
      if (!(existingCardArray.includes(data.clues[i].entryId))) {
        renderFavorite(data.clues[i]);
      }
    } else if (data.clues[i].completed !== true) {
      if (existingCardArray.includes(data.clues[i].entryId)) {
        for (var k = 0; k < $existingCards.length; k++) {
          if (data.clues[i].entryId === parseInt($existingCards[k].getAttribute('data-entryid-fav'))) {
            $existingCards[k].remove();
          }
        }
      }
    }
  }
}

function navButtonBlue(button) {
  if (button.classList.contains('font-black')) {
    button.classList.remove('font-black');
    button.classList.add('font-light-blue');
  } else {
    button.classList.add('font-light-blue');
  }
}

function navButtonBlack(button) {
  if (button.classList.contains('font-light-blue')) {
    button.classList.remove('font-light-blue');
    button.classList.add('font-black');
  } else {
    button.classList.add('font-black');
  }
}

// reset - try more questions
// remove all DOM from favorites and questions correct
// reset header scores
function resetAll() {
  data.clues = [];
  data.score = 0;
  data.nextEntryId = 1;
  getClues();
  blueAllClues();
  closeModal();
}

function blueAllClues() {
  for (var i = 0; i < $buttons.length; i++) {
    $buttons[i].removeAttribute('id');
  }
}

function checkIfAllAnswered() {
  var allAnswered;
  for (var i = 0; i < data.clues.length; i++) {
    if (data.clues[i].completed !== true) {
      allAnswered = false;
      break;
    }
  }
  if (allAnswered !== false) {
    showReset();
  }
  if (allAnswered === false) {
    for (var j = 0; j < $buttons.length; j++) {
      if (buttonTarget === $buttons[j]) {
        returnToQuestions();
        break;
      } else if (buttonTarget === $yesButton || buttonTarget === $noButton) {
        closeModal();
        break;
      }
    }
  }
}

function showReset() {
  for (var i = 0; i < $views.length; i++) {
    if ($views[i].getAttribute('data-modal') === 'reset') {
      $views[i].classList.remove('hidden');
    } else if ($views[i].getAttribute('data-modal') === 'click-to-see-answer') {
      $views[i].classList.add('hidden');
    } else if ($views[i].getAttribute('data-modal') === 'question') {
      $views[i].classList.add('hidden');
    } else if ($views[i].getAttribute('data-modal') === 'answer') {
      $views[i].classList.add('hidden');
    } else if ($views[i].getAttribute('data-modal') === 'return') {
      $views[i].classList.add('hidden');
    }
  }
  if (!($favoriteContainer.classList.contains('hidden'))) {
    $favoriteContainer.classList.add('hidden');
  }

  $finalScore.textContent = data.score;

}
