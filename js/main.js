/* global data */
/* exported data */

// dom queries

const $gridButtonContainer = document.querySelector('.button-container');
const $buttons = document.querySelectorAll('button.clue');
const $clueContainer = document.querySelector('[data-view="clue"]');
const $views = document.querySelectorAll('.view');
const $backButton = document.querySelector('.back-to-grid');
const $backButtonCardListCorrect = document.querySelector('.back-to-questions-correct');
const $backButtonCardListFavorites = document.querySelector('.back-to-questions-fav');
const $seeAnswerButton = document.querySelector('button.see-answer');
const $questionNumber = document.querySelector('p.question-number');
const $clue = document.querySelector('.clue-text');
const $answer = document.querySelector('.clue-answer');
const $points = document.querySelector('.clue-points');
const $yesButton = document.querySelector('#yes');
const $noButton = document.querySelector('#no');
const $qCorrectHeader = document.querySelector('span.q-correct');
const $pointsHeader = document.querySelector('span.score');
let buttonTarget;
const $favoriteContainer = document.querySelector('.favorite');
const $starButton = document.querySelector('button.fa');
const $starIcon = document.querySelector('.fa-star');
const $navViews = document.querySelectorAll('.nav-view');
const $cardContainerQCorrect = document.querySelector('.container-questions-correct');
const $qCorrectButton = document.querySelector('#nav-questions-correct');
const $cardContainerFavorites = document.querySelector('.container-favorites');
const $noneYetCorrect = document.querySelector('p.none-yet-correct');
const $noneYetFavorite = document.querySelector('p.none-yet-favorite');
const $favoritesButton = document.querySelector('#nav-favorites');
const $resetButton = document.querySelector('#reset');
const $finalScore = document.querySelector('#final-score');

// function definitions

const getClues = () => {
  const validatedClues = [];
  if (data.clues.length === 0) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://jservice.io/api/random/?count=36');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      for (let i = 0; i < xhr.response.length; i++) {
        if (xhr.response[i].question !== null && xhr.response[i].question !== '') {
          if (xhr.response[i].answer !== null && xhr.response[i].answer !== '') {
            if (xhr.response[i].value !== null && xhr.response[i].value !== '') {
              validatedClues.push(xhr.response[i]);
            }
          }
        }
      }

      for (let k = 0; k < 9; k++) {
        const clueData = {
        };
        clueData.question = validatedClues[k].question;
        clueData.answer = validatedClues[k].answer;
        clueData.points = validatedClues[k].value;
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
};

const loadFromStorage = () => {
  grayClue();
  countCorrect();
  $pointsHeader.textContent = data.score;
};

const navToClue = event => {
  if ($clueContainer.classList.contains('hidden')) {
    $clueContainer.classList.remove('hidden');
  }

  for (let i = 0; i < $navViews.length; i++) {
    if ($navViews[i].getAttribute('data-view') === 'questions-correct' && (!$navViews[i].classList.contains('hidden'))) {
      $navViews[i].classList.add('hidden');
    } else if ($navViews[i].getAttribute('data-view') === 'grid' && (!$navViews[i].classList.contains('hidden'))) {
      $navViews[i].classList.add('hidden');
    } else if ($navViews[i].getAttribute('data-view') === 'favorites' && (!$navViews[i].classList.contains('hidden'))) {
      $navViews[i].classList.add('hidden');
    }
  }

  buttonTarget = event.target;
  for (let k = 0; k < data.clues.length; k++) {
    if (data.clues[k].entryId === parseInt(buttonTarget.textContent)) {
      data.currentlyAnswering = data.clues[k];
    }
  }
  for (let j = 0; j < $buttons.length; j++) {
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

};

const displayClue = () => {
  grayStar($starIcon);
  for (let i = 0; i < data.clues.length; i++) {
    if (parseInt(event.target.textContent) === data.clues[i].entryId) {
      $questionNumber.innerHTML = 'QUESTION ' + data.clues[i].entryId;
      $clue.innerHTML = data.clues[i].question;
      $answer.innerHTML = 'Answer: ' + data.clues[i].answer;
      $points.textContent = 'Points: ' + data.clues[i].points;
      return;
    }
  }
};

const showAnswer = () => {
  for (let i = 0; i < $views.length; i++) {
    if ($views[i].getAttribute('data-clue') === 'answer') {
      $views[i].classList.remove('hidden');
    } else if ($views[i].getAttribute('data-clue') === 'see-answer') {
      $views[i].classList.add('hidden');
    }
  }
  if ($favoriteContainer.classList.contains('hidden')) {
    $favoriteContainer.classList.remove('hidden');
  }
};

const alreadyAnswered = () => {
  for (let i = 0; i < $views.length; i++) {
    if ($views[i].getAttribute('data-clue') === 'return') {
      $views[i].classList.remove('hidden');
    } else if ($views[i].getAttribute('data-clue') !== 'return') {
      $views[i].classList.add('hidden');
    }
  }
};

const countCorrect = () => {
  let counter = 0;
  for (let i = 0; i < data.clues.length; i++) {
    if (data.clues[i].correct === true) {
      counter += 1;
    }
  }
  $qCorrectHeader.textContent = counter;
  counter = 0;
};

const handleYesOrNo = (event, yesOrNo) => {
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
  const completedArray = [];
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

};

const resetClueView = () => {
  for (let i = 0; i < $views.length; i++) {
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
};

const grayClue = () => {
  for (let i = 0; i < data.clues.length; i++) {
    if (data.clues[i].completed === true) {
      $buttons[i].setAttribute('id', 'answered');
    }
  }
};

const yellowStar = icon => {
  if (!(icon.classList.contains('fa-star-yellow'))) {
    icon.classList.add('fa-star-yellow');
  }
  if (icon.classList.contains('fa-star-gray')) {
    icon.classList.remove('fa-star-gray');
  }
  if (icon.classList.contains('fa-star-white')) {
    icon.classList.remove('fa-star-white');
  }
};

const grayStar = icon => {
  if (!(icon.classList.contains('fa-star-gray'))) {
    icon.classList.add('fa-star-gray');
  }
  if (icon.classList.contains('fa-star-yellow')) {
    icon.classList.remove('fa-star-yellow');
  }
};

const whiteStar = icon => {
  if (!(icon.classList.contains('fa-star-white'))) {
    icon.classList.add('fa-star-white');
  }
  if (icon.classList.contains('fa-star-yellow')) {
    icon.classList.remove('fa-star-yellow');
  }
};

const handleFavorite = () => {
  const icon = $starIcon;
  const buttonTargetId = parseInt(buttonTarget.textContent);
  for (let i = 0; i < data.clues.length; i++) {
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
};

const handleFavoriteinCardList = (event, type) => {
  const icon = event.target;

  if (type === 'favorite') {
    const buttonTargetIdFav = parseInt(event.target.getAttribute('data-entryid-fav'));
    for (let i = 0; i < data.clues.length; i++) {
      if (data.clues[i].entryId === buttonTargetIdFav && data.clues[i].favorite !== true) {
        data.clues[i].favorite = true;
        yellowStar(icon);
        return;
      } else if (data.clues[i].entryId === buttonTargetIdFav && data.clues[i].favorite === true) {
        data.clues[i].favorite = false;
        whiteStar(icon);
        return;
      }
    }
  } else if (type === 'correct') {
    const buttonTargetIdCorrect = parseInt(event.target.getAttribute('data-entryid-correct'));
    for (let j = 0; j < data.clues.length; j++) {
      if (data.clues[j].entryId === buttonTargetIdCorrect && data.clues[j].favorite !== true) {
        data.clues[j].favorite = true;
        yellowStar(icon);
        return;
      } else if (data.clues[j].entryId === buttonTargetIdCorrect && data.clues[j].favorite === true) {
        data.clues[j].favorite = false;
        whiteStar(icon);
        return;
      }
    }
  }
};

const renderCard = (clue, type) => {
  const divCard = document.createElement('div');
  divCard.setAttribute('class', 'container card-in-list margin-v-1-rem border-radius-10-px bg-light-gray');

  if (type === 'favorite') {
    divCard.setAttribute('data-entryid-fav', clue.entryId);
    $cardContainerFavorites.appendChild(divCard);
  } else if (type === 'correct') {
    divCard.setAttribute('data-entryid-correct', clue.entryId);
    $cardContainerQCorrect.appendChild(divCard);
  }

  const divFavorite = document.createElement('div');
  divFavorite.setAttribute('class', 'favorite display-flex space-between padding-left-1-rem  ');
  divCard.prepend(divFavorite);

  const pQuestionNumber = document.createElement('p');
  pQuestionNumber.setAttribute('class', 'question-number roboto font-gray font-size-08-rem');
  pQuestionNumber.textContent = 'QUESTION ' + clue.entryId;
  divFavorite.appendChild(pQuestionNumber);

  const buttonFa = document.createElement('button');
  buttonFa.setAttribute('class', 'button-cards padding-right-05-rem border-none cursor-pointer border-radius-10-px');
  divFavorite.appendChild(buttonFa);

  const iStar = document.createElement('i');
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

  const divCardContent = document.createElement('div');
  divCardContent.setAttribute('class', 'card-content padding-card-content');
  divCard.appendChild(divCardContent);

  const divCardTextContent = document.createElement('div');
  divCardTextContent.setAttribute('class', 'card-text-content padding-right-05-rem');
  divCardContent.appendChild(divCardTextContent);

  const pClueText = document.createElement('p');
  pClueText.setAttribute('class', 'clue-text roboto font-weight-500 margin-b-2-rem  margin-t-0');
  pClueText.textContent = clue.question;
  divCardContent.appendChild(pClueText);

  const pAnswer = document.createElement('p');
  pAnswer.setAttribute('class', 'answer roboto font-weight-500 font-purple margin-v-025-rem');
  pAnswer.textContent = 'Answer: ' + clue.answer;
  divCardContent.appendChild(pAnswer);

  const pPoints = document.createElement('p');
  pPoints.setAttribute('class', 'points roboto font-weight-500  font-purple margin-0');
  pPoints.textContent = 'Points: ' + clue.points;
  divCardContent.appendChild(pPoints);
};

const renderCards = type => {
  for (let i = 0; i < data.clues.length; i++) {
    if (type === 'favorite') {
      if (data.clues[i].favorite === true) {
        renderCard(data.clues[i], type);
      }
    } else if (type === 'correct') {
      if (data.clues[i].correct === true) {
        renderCard(data.clues[i], type);
      }
    }
  }
};

const navToGrid = () => {
  for (let i = 0; i < $navViews.length; i++) {
    if ($navViews[i].getAttribute('data-view') === 'grid' && $navViews[i].classList.contains('hidden')) {
      $navViews[i].classList.remove('hidden');
    } else if ($navViews[i].getAttribute('data-view') !== 'grid' && (!$navViews[i].classList.contains('hidden'))) {
      $navViews[i].classList.add('hidden');
    }
  }
  resetClueView();
};

const navToQuestionsCorrect = () => {
  for (let i = 0; i < $navViews.length; i++) {
    if ($navViews[i].getAttribute('data-view') === 'questions-correct' && $navViews[i].classList.contains('hidden')) {
      $navViews[i].classList.remove('hidden');
    } else if ($navViews[i].getAttribute('data-view') !== 'questions-correct' && (!$navViews[i].classList.contains('hidden'))) {
      $navViews[i].classList.add('hidden');
    }
  }
  reRenderFavorites();
  reRenderStarIcons('favorite');
  reRenderStarIcons('correct');
  reRenderQuestionsCorrect();
};

const reRenderStarIcons = type => {
  const entryIdsCorrectArray = [];
  const entryIdsFavoriteArray = [];

  const $entryIdsFavorite = document.querySelectorAll('i[data-entryid-fav]');
  for (let i = 0; i < $entryIdsFavorite.length; i++) {
    entryIdsFavoriteArray.push(parseInt($entryIdsFavorite[i].getAttribute('data-entryid-fav')));
  }

  const $entryIdsCorrect = document.querySelectorAll('i[data-entryid-correct]');
  for (let j = 0; j < $entryIdsFavorite.length; j++) {
    entryIdsCorrectArray.push(parseInt($entryIdsCorrect[j].getAttribute('data-entryid-correct')));
  }

  for (let k = 0; k < data.clues.length; k++) {
    if (type === 'correct') {
      if (entryIdsFavoriteArray.includes(data.clues[k].entryId)) {
        for (let m = 0; m < $entryIdsCorrect.length; m++) {
          if (parseInt($entryIdsCorrect[m].getAttribute('data-entryid-correct')) === data.clues[k].entryId) {
            yellowStar($entryIdsCorrect[m]);
          }
        }
      } else if (!(entryIdsFavoriteArray.includes(data.clues[k].entryId))) {
        for (let n = 0; n < $entryIdsCorrect.length; n++) {
          if (parseInt($entryIdsCorrect[n].getAttribute('data-entryid-correct')) === data.clues[k].entryId) {
            whiteStar($entryIdsCorrect[n]);
          }
        }
      }
    } else if (type === 'favorite') {
      if (entryIdsFavoriteArray.includes(data.clues[k].entryId)) {
        for (let p = 0; p < $entryIdsFavorite.length; p++) {
          if (parseInt($entryIdsFavorite[p].getAttribute('data-entryid-fav')) === data.clues[k].entryId) {
            yellowStar($entryIdsFavorite[p]);
          }
        }
      } else if (!(entryIdsFavoriteArray.includes(data.clues[k].entryId))) {
        for (let q = 0; q < $entryIdsFavorite.length; q++) {
          if (parseInt($entryIdsFavorite[q].getAttribute('data-entryid-fav')) === data.clues[k].entryId) {
            whiteStar($entryIdsFavorite[q]);
          }
        }
      }
    }
  }
};

const reRenderQuestionsCorrect = () => {
  const existingCardArray = [];
  const $existingCards = document.querySelectorAll('div[data-entryid-correct]');
  for (let j = 0; j < $existingCards.length; j++) {
    const existingEntryId = parseInt($existingCards[j].getAttribute('data-entryid-correct'));
    existingCardArray.push(existingEntryId);
  }
  const anyCorrectArray = [];
  for (let i = 0; i < data.clues.length; i++) {
    if (data.clues[i].correct === true) {
      anyCorrectArray.push(data.clues[i]);
      if (!(existingCardArray.includes(data.clues[i].entryId))) {
        renderCard(data.clues[i], 'correct');
      }
    } else if (data.clues[i].correct !== true) {
      if (existingCardArray.includes(data.clues[i].entryId)) {
        for (let k = 0; k < $existingCards.length; k++) {
          if (data.clues[i].entryId === parseInt($existingCards[k].getAttribute('data-entryid-correct'))) {
            $existingCards[k].remove();
          }
        }
      }
    }
  }

  if (anyCorrectArray.length > 0) {
    if (!($noneYetCorrect.classList.contains('hidden'))) {
      $noneYetCorrect.classList.add('hidden');
    }
  } else if (anyCorrectArray.length === 0) {
    if ($noneYetCorrect.classList.contains('hidden')) {
      $noneYetCorrect.classList.remove('hidden');
    }
  }
};

const navToFavorites = () => {
  for (let i = 0; i < $navViews.length; i++) {
    if ($navViews[i].getAttribute('data-view') === 'favorites' && $navViews[i].classList.contains('hidden')) {
      $navViews[i].classList.remove('hidden');
    } else if ($navViews[i].getAttribute('data-view') !== 'favorites' && (!$navViews[i].classList.contains('hidden'))) {
      $navViews[i].classList.add('hidden');
    }
  }
  reRenderFavorites();
  reRenderStarIcons('favorite');

};

const reRenderFavorites = () => {
  const existingCardArray = [];
  const $existingCards = document.querySelectorAll('div[data-entryid-fav]');
  for (let j = 0; j < $existingCards.length; j++) {
    const existingEntryId = parseInt($existingCards[j].getAttribute('data-entryid-fav'));
    existingCardArray.push(existingEntryId);
  }

  const anyFavoritedArray = [];

  for (let i = 0; i < data.clues.length; i++) {
    if (data.clues[i].favorite === true) {
      anyFavoritedArray.push(data.clues[i]);
      if (!(existingCardArray.includes(data.clues[i].entryId))) {
        renderCard(data.clues[i], 'favorite');
      }
    } else if (data.clues[i].favorite !== true) {
      if (existingCardArray.includes(data.clues[i].entryId)) {
        for (let k = 0; k < $existingCards.length; k++) {
          if (data.clues[i].entryId === parseInt($existingCards[k].getAttribute('data-entryid-fav'))) {
            $existingCards[k].remove();
          }
        }
      }
    }
  }
  if (anyFavoritedArray.length > 0) {
    if (!($noneYetFavorite.classList.contains('hidden'))) {
      $noneYetFavorite.classList.add('hidden');
    }
  } else if (anyFavoritedArray.length === 0) {
    if ($noneYetFavorite.classList.contains('hidden')) {
      $noneYetFavorite.classList.remove('hidden');
    }
  }
};

const resetAll = () => {
  data.clues = [];
  data.score = 0;
  data.nextEntryId = 1;
  countCorrect();
  $pointsHeader.textContent = data.score;
  getClues();
  removeClueId();
  grayStar($starIcon);
  navToGrid();
};

const removeClueId = () => {
  for (let i = 0; i < $buttons.length; i++) {
    $buttons[i].removeAttribute('id');
  }
};

const checkIfAllAnswered = () => {
  let allAnswered;
  for (let i = 0; i < data.clues.length; i++) {
    if (data.clues[i].completed !== true) {
      allAnswered = false;
      break;
    }
  }
  if (allAnswered !== false) {
    showReset();
  }
  if (allAnswered === false) {
    for (let j = 0; j < $buttons.length; j++) {
      if (buttonTarget === $buttons[j]) {
        alreadyAnswered();
        break;
      } else if (buttonTarget === $yesButton || buttonTarget === $noButton) {
        break;
      }
    }
  }
};

const showReset = () => {
  for (let i = 0; i < $views.length; i++) {
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

};

// function calls

getClues();
renderCards('favorite');
renderCards('correct');
navToGrid();

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
