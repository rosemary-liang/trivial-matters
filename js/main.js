/* global data */
/* exported data */

// dom queries

const $gridButtonContainer = document.querySelector('.button-container');
const $buttons = document.querySelectorAll('button.clue');
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

// let { clues, currentlyAnswering, score, nextEntryId } = data;

const getClues = () => {
  let { clues, nextEntryId } = data;
  const validatedClues = [];
  if (clues.length === 0) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://jservice.io/api/random/?count=36');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      for (let i = 0; i < xhr.response.length; i++) {
        const clue = xhr.response[i];
        if (clue.question !== null && clue.question !== '' &&
        clue.answer !== null && clue.answer !== '' &&
        clue.value !== null && clue.value !== '') {
          validatedClues.push(clue);
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
        clueData.entryId = nextEntryId;
        clues.push(clueData);
        nextEntryId++;
      }
    });
    xhr.send();
  }
};

const loadFromStorage = () => {
  const { score } = data;
  grayClue();
  countCorrect();
  $pointsHeader.textContent = score;
};

const navToClue = event => {
  const { clues } = data;
  for (let i = 0; i < $navViews.length; i++) {
    const view = $navViews[i];
    if (view.getAttribute('data-view') === 'clue') {
      view.classList.remove('hidden');
    } else {
      view.classList.add('hidden');
    }
  }

  buttonTarget = event.target;
  for (let k = 0; k < clues.length; k++) {
    if (clues[k].entryId === parseInt(buttonTarget.textContent)) {
      data.currentlyAnswering = clues[k];
    }
  }
  for (let j = 0; j < $buttons.length; j++) {
    if (buttonTarget === $buttons[j]) {
      if (clues[j].completed === true) {
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
  const { clues } = data;
  grayStar($starIcon);
  for (let i = 0; i < clues.length; i++) {
    const clue = clues[i];
    if (parseInt(event.target.textContent) === clue.entryId) {
      $questionNumber.innerHTML = 'QUESTION ' + clue.entryId;
      $clue.innerHTML = clue.question;
      $answer.innerHTML = 'Answer: ' + clue.answer;
      $points.textContent = 'Points: ' + clue.points;
      return;
    }
  }
};

const showAnswer = () => {
  for (let i = 0; i < $views.length; i++) {
    const views = $views[i];
    if (views.getAttribute('data-clue') === 'answer') {
      views.classList.remove('hidden');
    } else if (views.getAttribute('data-clue') === 'see-answer') {
      views.classList.add('hidden');
    }
  }
  showStar();
};

const alreadyAnswered = () => {
  for (let i = 0; i < $views.length; i++) {
    const views = $views[i];
    if (views.getAttribute('data-clue') === 'return') {
      views.classList.remove('hidden');
    } else {
      views.classList.add('hidden');
    }
  }
};

const showStar = () => {
  $favoriteContainer.classList.remove('hidden');
};

const hideStar = () => {
  $favoriteContainer.classList.add('hidden');
};

const countCorrect = () => {
  const { clues } = data;
  let counter = 0;
  for (let i = 0; i < clues.length; i++) {
    if (clues[i].correct === true) {
      counter += 1;
    }
  }
  $qCorrectHeader.textContent = counter;
  counter = 0;
};

const handleYesOrNo = (event, yesOrNo) => {
  let { clues, currentlyAnswering, score } = data;
  buttonTarget = event.target;
  currentlyAnswering.completed = true;
  if (yesOrNo === 'yes') {
    currentlyAnswering.correct = true;
    score += currentlyAnswering.points;
    countCorrect();
    $pointsHeader.textContent = score;
  } else if (yesOrNo === 'no') {
    currentlyAnswering.correct = false;
  }

  currentlyAnswering = null;
  grayClue();
  const completedArray = [];
  for (var i = 0; i < clues.length; i++) {
    if (clues[i].completed === true) {
      completedArray.push(clues[i]);
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
    const views = $views[i];
    if (views.getAttribute('data-clue') === 'question' || views.getAttribute('data-clue') === 'see-answer') {
      views.classList.remove('hidden');
    } else {
      views.classList.add('hidden');
    }
  }
  hideStar();
};

const grayClue = () => {
  const { clues } = data;
  for (let i = 0; i < clues.length; i++) {
    if (clues[i].completed === true) {
      $buttons[i].setAttribute('id', 'answered');
    }
  }
};

const yellowStar = icon => {
  icon.classList.add('fa-star-yellow');
  icon.classList.remove('fa-star-gray');
  icon.classList.remove('fa-star-white');
};

const grayStar = icon => {
  icon.classList.add('fa-star-gray');
  icon.classList.remove('fa-star-yellow');
};

const whiteStar = icon => {
  icon.classList.add('fa-star-white');
  icon.classList.remove('fa-star-yellow');
};

const handleFavorite = () => {
  const { clues } = data;
  const icon = $starIcon;
  const buttonTargetId = parseInt(buttonTarget.textContent);
  for (let i = 0; i < clues.length; i++) {
    const clue = clues[i];
    if (clue.entryId === buttonTargetId) {
      if (clue.favorite !== true) {
        clue.favorite = true;
        yellowStar(icon);
      } else {
        clues.favorite = null;
        grayStar(icon);
      }
    }
  }
};

const handleFavoriteinCardList = (event, type) => {
  const { clues } = data;
  const icon = event.target;
  const buttonTargetId = getIdType(event, type);
  for (let i = 0; i < clues.length; i++) {
    const clue = clues[i];
    if (clue.entryId === buttonTargetId) {
      if (clue.favorite !== true) {
        clue.favorite = true;
        yellowStar(icon);
        return;
      } else {
        clue.favorite = false;
        whiteStar(icon);
        return;
      }
    }
  }
};

const getIdType = (event, type) => {
  if (type === 'favorite') {
    const buttonTargetId = parseInt(event.target.getAttribute('data-entryid-fav'));
    return buttonTargetId;
  } else if (type === 'correct') {
    const buttonTargetId = parseInt(event.target.getAttribute('data-entryid-correct'));
    return buttonTargetId;
  }
};

const renderCard = (clue, type) => {
  const divCard = document.createElement('div');
  divCard.setAttribute('class', 'container card-in-list margin-v-1-rem border-radius-10-px bg-light-gray');

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
    divCard.setAttribute('data-entryid-fav', clue.entryId);
    $cardContainerFavorites.appendChild(divCard);
    iStar.setAttribute('data-entryid-fav', clue.entryId);
  } else if (type === 'correct') {
    divCard.setAttribute('data-entryid-correct', clue.entryId);
    $cardContainerQCorrect.appendChild(divCard);
    iStar.setAttribute('data-entryid-correct', clue.entryId);
  }

  if (clue.favorite === true) {
    yellowStar(iStar);
  } else {
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
  pClueText.innerHTML = clue.question;
  divCardContent.appendChild(pClueText);

  const pAnswer = document.createElement('p');
  pAnswer.setAttribute('class', 'answer roboto font-weight-500 font-purple margin-v-025-rem');
  pAnswer.innerHTML = 'Answer: ' + clue.answer;
  divCardContent.appendChild(pAnswer);

  const pPoints = document.createElement('p');
  pPoints.setAttribute('class', 'points roboto font-weight-500  font-purple margin-0');
  pPoints.textContent = 'Points: ' + clue.points;
  divCardContent.appendChild(pPoints);
};

const renderCards = type => {
  const { clues } = data;
  for (let i = 0; i < clues.length; i++) {
    if (type === 'favorite') {
      if (clues[i].favorite === true) {
        renderCard(clues[i], type);
      }
    } else if (type === 'correct') {
      if (clues[i].correct === true) {
        renderCard(clues[i], type);
      }
    }
  }
};

const navToGrid = () => {
  for (let i = 0; i < $navViews.length; i++) {
    const view = $navViews[i];
    if (view.getAttribute('data-view') === 'grid') {
      view.classList.remove('hidden');
    } else {
      view.classList.add('hidden');
    }
  }
  resetClueView();
};

const navToQuestionsCorrect = () => {
  for (let i = 0; i < $navViews.length; i++) {
    const view = $navViews[i];
    if (view.getAttribute('data-view') === 'questions-correct') {
      view.classList.remove('hidden');
    } else if (view.getAttribute('data-view') !== 'questions-correct') {
      view.classList.add('hidden');
    }
  }
  reRenderFavorites();
  reRenderStarIcons('favorite');
  reRenderStarIcons('correct');
  reRenderQuestionsCorrect();
};

const reRenderStarIcons = type => {
  const { clues } = data;
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

  for (let k = 0; k < clues.length; k++) {
    if (type === 'correct') {
      if (entryIdsFavoriteArray.includes(clues[k].entryId)) {
        for (let m = 0; m < $entryIdsCorrect.length; m++) {
          if (parseInt($entryIdsCorrect[m].getAttribute('data-entryid-correct')) === clues[k].entryId) {
            yellowStar($entryIdsCorrect[m]);
          }
        }
      } else {
        for (let n = 0; n < $entryIdsCorrect.length; n++) {
          if (parseInt($entryIdsCorrect[n].getAttribute('data-entryid-correct')) === clues[k].entryId) {
            whiteStar($entryIdsCorrect[n]);
          }
        }
      }
    } else if (type === 'favorite') {
      if (entryIdsFavoriteArray.includes(clues[k].entryId)) {
        for (let p = 0; p < $entryIdsFavorite.length; p++) {
          if (parseInt($entryIdsFavorite[p].getAttribute('data-entryid-fav')) === clues[k].entryId) {
            yellowStar($entryIdsFavorite[p]);
          }
        }
      } else {
        for (let q = 0; q < $entryIdsFavorite.length; q++) {
          if (parseInt($entryIdsFavorite[q].getAttribute('data-entryid-fav')) === clues[k].entryId) {
            whiteStar($entryIdsFavorite[q]);
          }
        }
      }
    }
  }
};

const reRenderQuestionsCorrect = () => {
  const { clues } = data;
  const existingCardArray = [];
  const $existingCards = document.querySelectorAll('div[data-entryid-correct]');
  for (let j = 0; j < $existingCards.length; j++) {
    const existingEntryId = parseInt($existingCards[j].getAttribute('data-entryid-correct'));
    existingCardArray.push(existingEntryId);
  }
  const anyCorrectArray = [];
  for (let i = 0; i < clues.length; i++) {
    if (clues[i].correct === true) {
      anyCorrectArray.push(clues[i]);
      if (!(existingCardArray.includes(clues[i].entryId))) {
        renderCard(clues[i], 'correct');
      }
    } else {
      if (existingCardArray.includes(clues[i].entryId)) {
        for (let k = 0; k < $existingCards.length; k++) {
          if (clues[i].entryId === parseInt($existingCards[k].getAttribute('data-entryid-correct'))) {
            $existingCards[k].remove();
          }
        }
      }
    }
  }

  if (anyCorrectArray.length === 0) {
    $noneYetCorrect.classList.remove('hidden');
  } else {
    $noneYetCorrect.classList.add('hidden');
  }

};

const navToFavorites = () => {
  for (let i = 0; i < $navViews.length; i++) {
    const view = $navViews[i];
    if (view.getAttribute('data-view') === 'favorites') {
      view.classList.remove('hidden');
    } else {
      view.classList.add('hidden');
    }
  }
  reRenderFavorites();
  reRenderStarIcons('favorite');

};

const reRenderFavorites = () => {
  const { clues } = data;
  const existingCardArray = [];
  const $existingCards = document.querySelectorAll('div[data-entryid-fav]');
  for (let j = 0; j < $existingCards.length; j++) {
    const existingEntryId = parseInt($existingCards[j].getAttribute('data-entryid-fav'));
    existingCardArray.push(existingEntryId);
  }

  const anyFavoritedArray = [];

  for (let i = 0; i < clues.length; i++) {
    if (clues[i].favorite === true) {
      anyFavoritedArray.push(clues[i]);
      if (!(existingCardArray.includes(clues[i].entryId))) {
        renderCard(clues[i], 'favorite');
      }
    } else {
      if (existingCardArray.includes(clues[i].entryId)) {
        for (let k = 0; k < $existingCards.length; k++) {
          if (clues[i].entryId === parseInt($existingCards[k].getAttribute('data-entryid-fav'))) {
            $existingCards[k].remove();
          }
        }
      }
    }
  }
  if (anyFavoritedArray.length === 0) {
    $noneYetFavorite.classList.remove('hidden');
  } else {
    $noneYetFavorite.classList.add('hidden');
  }
};

const resetAll = () => {
  let { clues, score, nextEntryId } = data;
  resetExistingCards('correct');
  resetExistingCards('favorite');
  clues = [];
  data.clues = clues;
  score = 0;
  nextEntryId = 1;
  data.nextEntryId = nextEntryId;
  countCorrect();
  $pointsHeader.textContent = score;
  getClues();
  removeClueId();
  grayStar($starIcon);
  navToGrid();
};

const resetExistingCards = type => {
  if (type === 'correct') {
    const $existingCards = document.querySelectorAll('div[data-entryid-correct]');
    for (let i = 0; i < $existingCards.length; i++) {
      $existingCards[i].remove();
    }
  } else if (type === 'favorite') {
    const $existingCards = document.querySelectorAll('div[data-entryid-fav]');
    for (let i = 0; i < $existingCards.length; i++) {
      $existingCards[i].remove();
    }
  }
};

const removeClueId = () => {
  for (let i = 0; i < $buttons.length; i++) {
    $buttons[i].removeAttribute('id');
  }
};

const checkIfAllAnswered = () => {
  const { clues } = data;
  let allAnswered;
  for (let i = 0; i < clues.length; i++) {
    if (clues[i].completed !== true) {
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
  const { score } = data;
  for (let i = 0; i < $views.length; i++) {
    if ($views[i].getAttribute('data-clue') === 'reset') {
      $views[i].classList.remove('hidden');
    } else {
      $views[i].classList.add('hidden');
    }
  }
  hideStar();

  $finalScore.textContent = score;
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
