let currentSign = 'cross';
let table = document.querySelector('#playing-field-table');
let crossOutContainer = document.querySelector('.cross-out');
let accountImgBackground = document.querySelector('.account-img-background');
let accountPlayer1 = document.querySelector('.account-player1');
let accountPlayer2Robot = document.querySelector('.account-player2-robot');
let whoGoes = document.querySelector('.who-goes');
let gameMode = 'human-human';
let numberStep = 0;
let stopGame = 'no';

function nextMoveHuman(event) {
  let target = event.target;

  if (target.tagName === 'TD' && target.classList.length === 0) {
    if (currentSign === 'cross') {
      target.classList.add('cross');
    currentSign = 'zero';
  } else {
      target.classList.add('zero');
    currentSign = 'cross';
  }
  } else return;
  
  numberStep++;
  
  calcResult(target);
  
  if (stopGame === 'yes' || numberStep === 9) return;
  
  if (gameMode === 'human-robot' && numberStep < 8) {
    table.onclick = null;
    setTimeout(nextMoveRobot, 700, target);
  }
    
  if (numberStep % 2 && gameMode === 'human-robot') {
    whoGoes.style.background = 'url(img/rob.png) center center no-repeat';
  } else if (numberStep % 2) {
    whoGoes.style.background = 'url(img/hum2.png) left center no-repeat';
  } else {
    whoGoes.style.background = 'url(img/hum1.png) left center no-repeat';
  }
}

function nextMoveRobot(event) {
  let randomCell = null;
  let rowIndex = 0;
  let cellIndex = 0;
  
  function getRandomArbitary(min, max) {
  return (Math.random() * (max - min)).toFixed(0);
  }
  
  while (randomCell === null) {
    rowIndex = getRandomArbitary(0, 2.5);
    cellIndex = getRandomArbitary(0, 2.5);
  randomCell = table.rows[rowIndex].cells[cellIndex];
  
  if (randomCell.className !== '') {
    randomCell = null;
  }
  }
  
  randomCell.classList.add('zero');
  currentSign = 'cross';
  numberStep++;
  
  calcResult(randomCell);
  table.onclick = nextMoveHuman;
  
  if (stopGame === 'no') {
    whoGoes.style.background = 'url(img/hum1.png) left center no-repeat';
  }
}

function calcResult(target) {
  let targetClass = target.className;
  let rowIndex = target.parentElement.rowIndex;
  let cellIndex = target.cellIndex;
  let checkCellsH_V_DUpDown = ['-2', '-1', '0', '+1', '+2'];
  let checkCells_DDownUp = [['+2', '-2'], ['+1', '-1'], ['0', '0'], ['-1', '+1'], ['-2', '+2']];
  let currentCell = {};
  let numberSame = 0;
  let arrForCrossOut = [];
  
  //проверка по горизонтали слева направо
  for (let i = 0; i < checkCellsH_V_DUpDown.length; i++) {
    currentCell = table.rows[rowIndex].cells[cellIndex + +checkCellsH_V_DUpDown[i]];
    
    checkResult(currentCell);
  }
  
  numberSame = 0;
  arrForCrossOut = [];
  
  //проверка по вертикали сверху вниз
  for (let i = 0; i < checkCellsH_V_DUpDown.length; i++) {
    if (!table.rows[rowIndex + +checkCellsH_V_DUpDown[i]]) {
      continue;
    } else {
      currentCell = table.rows[rowIndex + +checkCellsH_V_DUpDown[i]].cells[cellIndex];
    }
  
    checkResult(currentCell);
  }
  
  numberSame = 0;
  arrForCrossOut = [];
  
  //проверка по диагонали слева направо, сверху вниз
  for (let i = 0; i < checkCellsH_V_DUpDown.length; i++) {
    if (!table.rows[rowIndex + +checkCellsH_V_DUpDown[i]]) {
      continue;
    } else {
      currentCell = table.rows[rowIndex + +checkCellsH_V_DUpDown[i]].cells[cellIndex + +checkCellsH_V_DUpDown[i]];
    }
  
    checkResult(currentCell);
  }
  
  numberSame = 0;
  arrForCrossOut = [];
  
  //проверка по диагонали слева направо, снизу вверх
  for (let i = 0; i < checkCells_DDownUp.length; i++) {
    if (!table.rows[rowIndex + +checkCells_DDownUp[i][0]]) {
      continue;
    } else {
      currentCell = table.rows[rowIndex + +checkCells_DDownUp[i][0]].cells[cellIndex + +checkCells_DDownUp[i][1]];
    }
  
    checkResult(currentCell);
  }

  function checkResult(currentCell) {
    if (!currentCell) {
      return;
    }
  
    if (currentCell.className === targetClass) {
      numberSame += 1;
      if (arrForCrossOut.indexOf(currentCell) === -1) {
        arrForCrossOut.push(currentCell);
      }
    } else {
      numberSame = 0;
      arrForCrossOut = [];
    }
    
    if (numberSame === 3) {
      setCrossOut(currentCell, arrForCrossOut);
      stopGame = 'yes';
      
      if (numberStep % 2) {
        ++accountPlayer1.textContent;
      } else {
        ++accountPlayer2Robot.textContent;
      }
    }
  }
}

function setCrossOut(currentCell, arrForCrossOut) {
  let coordFirstElem = arrForCrossOut[0].getBoundingClientRect();
  let coordSecondElem = arrForCrossOut[1].getBoundingClientRect();
  let coordThirdElem = arrForCrossOut[2].getBoundingClientRect();
  let coordBeginX = Math.min(coordFirstElem.x, coordSecondElem.x, coordThirdElem.x);
  let coordBeginY = Math.min(coordFirstElem.y, coordSecondElem.y, coordThirdElem.y);
  
  if ( coordFirstElem.y === coordSecondElem.y ) {
    crossOutContainer.style.top = coordBeginY + pageYOffset + 'px';
    crossOutContainer.style.left = coordBeginX + pageXOffset - 30 + 'px';
    crossOutContainer.classList.add('cross-out_img-horizontal');
  
    return table.onclick = null;
  }	
  
  if ( coordFirstElem.x === coordSecondElem.x ) {
    crossOutContainer.style.top = coordBeginY + pageYOffset + 118 + 'px';
    crossOutContainer.style.left = coordBeginX + pageXOffset - 160 + 'px';
    crossOutContainer.classList.add('cross-out_img-vertical');

    return table.onclick = null;
  }
  
  if ( coordFirstElem.x !== coordSecondElem.x ) {
    crossOutContainer.style.top = coordBeginY + pageYOffset + 116 + 'px';
    crossOutContainer.style.left = coordBeginX + pageXOffset - 54 + 'px';
  
    if ( coordFirstElem.y > coordSecondElem.y ) {
      crossOutContainer.classList.add('cross-out_img-diagonal-down-up');
    } else {
      crossOutContainer.classList.add('cross-out_img-diagonal-up-down');
    }
  
    return table.onclick = null;
  }
}

function newGame(event) {
  previusGameMode = gameMode;
  gameMode = event.target.dataset.newGame;
  whoGoes.style.background = 'url(img/hum1.png) left center no-repeat';
  stopGame = 'no';
  numberStep = 0;
  
  for (let numbRow = 0; numbRow < table.rows.length; ++numbRow) {
    for (let i = 0; i < table.rows[numbRow].cells.length; ++i) {
      table.rows[numbRow].cells[i].className = '';
    }
  }
  
  if (gameMode === 'human-robot') {
    accountImgBackground.style.background = 'url(img/hum-rob2.png) left center / 100px no-repeat';
  } else {
    accountImgBackground.style.background = 'url(img/hum-hum.png) left center / 100px no-repeat';
  }
  
  if ( previusGameMode !== gameMode ) {
    accountPlayer1.textContent = '0';
    accountPlayer2Robot.textContent = '0';
  }
  
  crossOutContainer.classList.remove('cross-out_img-vertical', 
                 'cross-out_img-horizontal',
                 'cross-out_img-diagonal-up-down',
                 'cross-out_img-diagonal-down-up');
  currentSign = 'cross';
  table.onclick = nextMoveHuman;
}

table.onclick = nextMoveHuman;
document.querySelector('[data-new-game="human-human"]').onclick = newGame;
document.querySelector('[data-new-game="human-robot"]').onclick = newGame;