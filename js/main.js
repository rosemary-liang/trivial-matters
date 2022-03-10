/* global data */
/* exported data */

// dom queries

var $gridButtonContainer = document.querySelector('.button-container');
var $buttons = document.querySelectorAll('button.clue');
var $clueContainer = document.querySelector('[data-view="clue"]');
var $views = document.querySelectorAll('.view');
var $backButton = document.querySelector('.back-to-grid');
var $backButtonCardListCorrect = document.querySelector('.back-to-questions-correct');
var $backButtonCardListFavorites = document.querySelector('.back-to-questions-fav');
var $seeAnswerButton = document.querySelector('button.see-answer');
var $questionNumber = document.querySelector('p.question-number');
var $clue = document.querySelector('.clue-text');
var $answer = document.querySelector('.clue-answer');
var $points = document.querySelector('.clue-points');
var $yesButton = document.querySelector('#yes');
var $noButton = document.querySelector('#no');
var $qCorrectHeader = document.querySelector('span.q-correct');
var $pointsHeader = document.querySelector('span.score');
var buttonTarget;
var $favoriteContainer = document.querySelector('.favorite');
var $starButton = document.querySelector('button.fa');
var $starIcon = document.querySelector('.fa-star');
var $navViews = document.querySelectorAll('.nav-view');
var $cardContainerQCorrect = document.querySelector('.container-questions-correct');
var $qCorrectButton = document.querySelector('#nav-questions-correct');
var $cardContainerFavorites = document.querySelector('.container-favorites');
var $favoritesButton = document.querySelector('#nav-favorites');
var $resetButton = document.querySelector('#reset');
var $finalScore = document.querySelector('#final-score');

// event listeners

window.addEventListener('load', loadFromStorage);
$gridButtonContainer.addEventListener('click', navToClue);
$seeAnswerButton.addEventListener('click', showAnswer);
$yesButton.addEventListener('click', function (event) { handleYesOrNo(event, 'yes'); });
$noButton.addEventListener('click', function (event) { handleYesOrNo(event, 'no'); });
$backButton.addEventListener('click', navToGrid);
$backButtonCardListCorrect.addEventListener('click', navToGrid);
$backButtonCardListFavorites.addEventListener('click', navToGrid);
$starButton.addEventListener('click', handleFavorite);
$qCorrectButton.addEventListener('click', navToQuestionsCorrect);
$favoritesButton.addEventListener('click', navToFavorites);
$cardContainerFavorites.addEventListener('click', function (event) { handleFavoriteinCardList(event, 'favorite'); });
$cardContainerQCorrect.addEventListener('click', function (event) { handleFavoriteinCardList(event, 'correct'); });
$resetButton.addEventListener('click', resetAll);

// function calls

getClues();
renderCards('favorite');
renderCards('correct');
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

function navToClue(event) {
  if ($clueContainer.classList.contains('hidden')) {
    $clueContainer.classList.remove('hidden');
  }

  for (var i = 0; i < $navViews.length; i++) {
    if ($navViews[i].getAttribute('data-view') === 'questions-correct' && (!$navViews[i].classList.contains('hidden'))) {
      $navViews[i].classList.add('hidden');
    } else if ($navViews[i].getAttribute('data-view') === 'grid' && (!$navViews[i].classList.contains('hidden'))) {
      $navViews[i].classList.add('hidden');
    } else if ($navViews[i].getAttribute('data-view') === 'favorites' && (!$navViews[i].classList.contains('hidden'))) {
      $navViews[i].classList.add('hidden');
    }
  }

  buttonTarget = event.target;
  for (var k = 0; k < data.clues.length; k++) {
    if (data.clues[k].entryId === parseInt(buttonTarget.textContent)) {
      data.currentlyAnswering = data.clues[k];
    }
  }
  for (var j = 0; j < $buttons.length; j++) {
    if (buttonTarget === $buttons[j]) {
      if (data.clues[j].completed === true) {
        checkIfAllAnswered();
        return;
      } else {
        displayClue();
        return;
      }
    }
  }

}

function displayClue() {
  grayStar($starIcon);
  for (var i = 0; i < data.clues.length; i++) {
    if (parseInt(event.target.textContent) === data.clues[i].entryId) {
      $questionNumber.textContent = 'QUESTION ' + data.clues[i].entryId;
      $clue.textContent = data.clues[i].question;
      $answer.textContent = 'Answer: ' + data.clues[i].answer;
      $points.textContent = 'Points: ' + data.clues[i].points;
      return;
    }
  }
}

function showAnswer() {
  for (var i = 0; i < $views.length; i++) {
    if ($views[i].getAttribute('data-clue') === 'answer') {
      $views[i].classList.remove('hidden');
    } else if ($views[i].getAttribute('data-clue') === 'see-answer') {
      $views[i].classList.add('hidden');
    }
  }
  if ($favoriteContainer.classList.contains('hidden')) {
    $favoriteContainer.classList.remove('hidden');
  }
}

function alreadyAnswered() {
  for (var i = 0; i < $views.length; i++) {
    if ($views[i].getAttribute('data-clue') === 'return') {
      $views[i].classList.remove('hidden');
    } else if ($views[i].getAttribute('data-clue') !== 'return') {
      $views[i].classList.add('hidden');
    }
  }
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

function handleYesOrNo(event, yesOrNo) {
  buttonTarget = event.target;
  data.currentlyAnswering.completed = true;
  if (yesOrNo === 'yes') {
    data.currentlyAnswering.correct = true;
    data.score += data.currentlyAnswering.points;
    countCorrect();
    $pointsHeader.textContent = data.score;
  } else if (yesOrNo === 'no') {
    data.currentlyAnswering.correct = false;
  }

  data.currentlyAnswering = null;
  grayClue();
  var completedArray = [];
  for (var i = 0; i < data.clues.length; i++) {
    if (data.clues[i].completed === true) {
      completedArray.push(data.clues[i]);
    }
  }
  if (completedArray.length !== 9) {
    navToGrid();
  } else {
    checkIfAllAnswered();
  }

}

function resetClueView() {
  for (var i = 0; i < $views.length; i++) {
    if ($views[i].getAttribute('data-clue') === 'question' || $views[i].getAttribute('data-clue') === 'see-answer') {
      $views[i].classList.remove('hidden');
    } else if ($views[i].getAttribute('data-clue') === 'answer') {
      $views[i].classList.add('hidden');
    } else if ($views[i].getAttribute('data-clue') === 'return') {
      $views[i].classList.add('hidden');
    } else if ($views[i].getAttribute('data-clue') === 'reset') {
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

function whiteStar(icon) {
  if (!(icon.classList.contains('fa-star-white'))) {
    icon.classList.add('fa-star-white');
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

function handleFavoriteinCardList(event, type) {
  var icon = event.target;

  if (type === 'favorite') {
    var buttonTargetIdFav = parseInt(event.target.getAttribute('data-entryid-fav'));
    for (var i = 0; i < data.clues.length; i++) {
      if (data.clues[i].entryId === buttonTargetIdFav && data.clues[i].favorite !== true) {
        data.clues[i].favorite = true;
        yellowStar(icon);
      } else if (data.clues[i].entryId === buttonTargetIdFav && data.clues[i].favorite === true) {
        data.clues[i].favorite = false;
        whiteStar(icon);
      }
    }
  } else if (type === 'correct') {
    var buttonTargetIdCorrect = parseInt(event.target.getAttribute('data-entryid-correct'));
    for (var j = 0; j < data.clues.length; j++) {
      if (data.clues[j].entryId === buttonTargetIdCorrect && data.clues[j].favorite !== true) {
        data.clues[j].favorite = true;
        yellowStar(icon);
      } else if (data.clues[j].entryId === buttonTargetIdCorrect && data.clues[j].favorite === true) {
        data.clues[j].favorite = false;
        whiteStar(icon);
      }
    }
  }
}

// starbutton node list
// combine handle favorites function

// type = string "favorite" or "correct"
function renderCard(clue, type) {
  var divCard = document.createElement('div');
  divCard.setAttribute('class', 'container card-in-list margin-v-1-rem border-radius-10-px bg-light-gray');

  if (type === 'favorite') {
    divCard.setAttribute('data-entryid-fav', clue.entryId);
    $cardContainerFavorites.appendChild(divCard);
  } else if (type === 'correct') {
    divCard.setAttribute('data-entryid-correct', clue.entryId);
    $cardContainerQCorrect.appendChild(divCard);
  }

  var divFavorite = document.createElement('div');
  divFavorite.setAttribute('class', 'favorite display-flex space-between padding-left-1-rem  ');
  divCard.prepend(divFavorite);

  var pQuestionNumber = document.createElement('p');
  pQuestionNumber.setAttribute('class', 'question-number roboto font-gray font-size-08-rem');
  pQuestionNumber.textContent = 'QUESTION ' + clue.entryId;
  divFavorite.appendChild(pQuestionNumber);

  var buttonFa = document.createElement('button');
  buttonFa.setAttribute('class', 'button-cards padding-right-05-rem border-none cursor-pointer border-radius-10-px');
  divFavorite.appendChild(buttonFa);

  var iStar = document.createElement('i');
  iStar.setAttribute('class', 'fa-solid fa-star font-size-125-rem grow favorites-page fa-star-white');

  if (type === 'favorite') {
    iStar.setAttribute('data-entryid-fav', clue.entryId);
  } else if (type === 'correct') {
    iStar.setAttribute('data-entryid-correct', clue.entryId);
  }

  if (clue.favorite === true) {
    yellowStar(iStar);
  } else if (clue.favorite !== true) {
    whiteStar(iStar);
  }

  buttonFa.appendChild(iStar);

  var divCardContent = document.createElement('div');
  divCardContent.setAttribute('class', 'card-content padding-card-content');
  divCard.appendChild(divCardContent);

  var divCardTextContent = document.createElement('div');
  divCardTextContent.setAttribute('class', 'card-text-content padding-right-05-rem');
  divCardContent.appendChild(divCardTextContent);

  var pClueText = document.createElement('p');
  pClueText.setAttribute('class', 'clue-text roboto font-weight-500 margin-b-2-rem  margin-t-0');
  pClueText.textContent = clue.question;
  divCardContent.appendChild(pClueText);

  var pAnswer = document.createElement('p');
  pAnswer.setAttribute('class', 'answer roboto font-weight-500 font-purple margin-v-025-rem');
  pAnswer.textContent = 'Answer: ' + clue.answer;
  divCardContent.appendChild(pAnswer);

  var pPoints = document.createElement('p');
  pPoints.setAttribute('class', 'points roboto font-weight-500  font-purple margin-0');
  pPoints.textContent = 'Points: ' + clue.points;
  divCardContent.appendChild(pPoints);
}

function renderCards(type) {
  for (var i = 0; i < data.clues.length; i++) {
    if (type === 'favorite') {
      if (data.clues[i].favorite === true) {
        renderCard(data.clues[i], type);
      }
    } else if (type === 'correct') {
      if (data.clues[i].corredct === true) {
        renderCard(data.clues[i], type);
      }
    }
  }
}

function navToGrid() {
  for (var i = 0; i < $navViews.length; i++) {
    if ($navViews[i].getAttribute('data-view') === 'grid' && $navViews[i].classList.contains('hidden')) {
      $navViews[i].classList.remove('hidden');
    } else if ($navViews[i].getAttribute('data-view') !== 'grid' && (!$navViews[i].classList.contains('hidden'))) {
      $navViews[i].classList.add('hidden');
    }
  }
  resetClueView();
}

function navToQuestionsCorrect() {
  for (var i = 0; i < $navViews.length; i++) {
    if ($navViews[i].getAttribute('data-view') === 'questions-correct' && $navViews[i].classList.contains('hidden')) {
      $navViews[i].classList.remove('hidden');
    } else if ($navViews[i].getAttribute('data-view') !== 'questions-correct' && (!$navViews[i].classList.contains('hidden'))) {
      $navViews[i].classList.add('hidden');
    }
  }

  reRenderQuestionsCorrect();
  reRenderStarIcons('correct');

}

function reRenderStarIcons(type) {
  var $entryIds;
  if (type === 'correct') {
    $entryIds = document.querySelectorAll('i[data-entryid-correct]');
  } else if (type === 'favorite') {
    $entryIds = document.querySelectorAll('i[data-entryid-favorite]');
  }
  var entryIdsArray = [];
  for (var j = 0; j < $entryIds.length; j++) {
    entryIdsArray.push($entryIds[j]);
  }
  for (var k = 0; k < data.clues.length; k++) {
    if (entryIdsArray.includes(data.clues[k].entryId)) {
      for (var m = 0; m < $entryIds.length; m++) {
        if (data.clues[k].favorite === true) {
          yellowStar($entryIds[m]);
        } else if (data.clues[k].favorite === null) {
          whiteStar($entryIds[m]);
        }
      }
    }
  }
}

function reRenderQuestionsCorrect() {
  var existingCardArray = [];
  var $existingCards = document.querySelectorAll('div[data-entryid-correct]');
  for (var j = 0; j < $existingCards.length; j++) {
    var existingEntryId = parseInt($existingCards[j].getAttribute('data-entryid-correct'));
    existingCardArray.push(existingEntryId);
  }

  for (var i = 0; i < data.clues.length; i++) {
    if (data.clues[i].completed === true) {
      if (!(existingCardArray.includes(data.clues[i].entryId))) {
        renderCard(data.clues[i], 'correct');
      }
    } else if (data.clues[i].completed !== true) {
      if (existingCardArray.includes(data.clues[i].entryId)) {
        for (var k = 0; k < $existingCards.length; k++) {
          if (data.clues[i].entryId === parseInt($existingCards[k].getAttribute('data-entryid-correct'))) {
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
    } else if ($navViews[i].getAttribute('data-view') !== 'favorites' && (!$navViews[i].classList.contains('hidden'))) {
      $navViews[i].classList.add('hidden');
    }
  }
  reRenderFavorites();
  reRenderStarIcons('favorite');

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
        renderCard(data.clues[i], 'favorite');
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

function resetAll() {
  data.clues = [];
  data.score = 0;
  data.nextEntryId = 1;
  countCorrect();
  $pointsHeader.textContent = data.score;
  getClues();
  blueAllClues();
  navToGrid();
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
        alreadyAnswered();
        break;
      } else if (buttonTarget === $yesButton || buttonTarget === $noButton) {
        break;
      }
    }
  }
}

function showReset() {
  for (var i = 0; i < $views.length; i++) {
    if ($views[i].getAttribute('data-clue') === 'reset') {
      $views[i].classList.remove('hidden');
    } else if ($views[i].getAttribute('data-clue') !== 'reset' && !($views[i].classList.contains('hidden'))) {
      $views[i].classList.add('hidden');
    }
  }
  if (!($favoriteContainer.classList.contains('hidden'))) {
    $favoriteContainer.classList.add('hidden');
  }

  $finalScore.textContent = data.score;

}
