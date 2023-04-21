// нет защиты от собранности 3th размерности на последнем шаге мешания!

let gameType = 15, // стартовая размерность пазла - 3(th),8(th),15(th)
  tiles,
  btnBoxs,
  NperEdge,
  eCell,
  Edge,
  N;

const edge = 100, //px
  moveSound = new Audio("start.wav"),
  winSound = new Audio("bal.wav"),
  board = document.createElement("div"),
  btnBox = document.createElement("div");

btnBox.setAttribute("id", "btnBox");
btnBox.innerHTML = `
  <button id="btn3" style="background-color: lightblue">3th</button>
  <button id="btn8" style="background-color: lightcyan">8th</button>
  <button id="btn15" style="background-color: lightskyblue">15th</button>
  <button id="btn24">24th</button>
`;

// ф-я, определяющая координаты ячейки в матрице "15к" по позиции
const defCoordByPos = pos => [
  Math.floor(pos / NperEdge) + (pos % NperEdge && 1),
  pos % NperEdge || NperEdge,
];

// ф-я обмена значений ячеек
const change = (T, E) => {
  const [top, left] = [T.style.top, T.style.left];

  eCell.top = top; //изменение служ.инфы о своб.ячейке в объекте
  eCell.left = left;
  eCell.pos = +T.dataset.pos; //по сути это позиция 1..16(для 15th)

  E.innerText = T.innerText; //перемещение числа по ячейкам
  T.innerText = "";

  E.classList.toggle("nopointer"); //изменение вида курсора над клетками
  T.classList.toggle("nopointer");

  moveSound.play();
};

// ф-я, для перемещений плитки (или сразу нескольких в ряду) (со звуком)
const move = T => {
  const E = tiles[eCell.pos - 1],
    [row, col] = defCoordByPos(T.dataset.pos),
    [eRow, eCol] = defCoordByPos(eCell.pos);

  if (eCol == col || eRow == row) {
    if (eCol == col) {
      if (row > eRow)
        for (let i = eRow; i < row; i++) {
          const idx = (i - 1) * NperEdge + col - 1, //move up
            idx2 = i * NperEdge + col - 1;
          change(tiles[idx2], tiles[idx]);
        }
      else
        for (let i = eRow; i > row; i--) {
          const idx = (i - 2) * NperEdge + col - 1, //move down
            idx2 = (i - 1) * NperEdge + col - 1;
          change(tiles[idx], tiles[idx2]);
        }
    } else {
      if (col > eCol)
        for (let i = eCol; i < col; i++) {
          const idx = (row - 1) * NperEdge + i - 1; //horiz.move
          change(tiles[idx + 1], tiles[idx]);
        }
      else
        for (let i = eCol; i > col; i--) {
          const idx = (row - 1) * NperEdge + i - 1; //move right
          change(tiles[idx - 1], tiles[idx]);
        }
    }

    E.style.border = "thick ridge lightgray"; //изменение стилей пустой ячейки
    E.style.backgroundColor = "white";

    T.style.backgroundColor = "lightyellow"; //изменение стилей толкнутой ячейки
    T.style.border = "none";
  }
};

// ф-я перемешивания. Кол-во повторений цикла - степень перемешивания
const shuffle = () => {
  const E = tiles[eCell.pos - 1];

  for (let i = 0; i < 20 * gameType; i++) {
    const randomIndex = Math.floor(Math.random() * tiles.length),
      randomTile = tiles[randomIndex];

    move(randomTile, E);
  }
  board.style.borderColor = "lightgray"; // Установка цвета рамки в исходное состояние
  tiles[N - 1].classList.remove("nopointer"); //возвращение вида курсора над клеткой появления кнопки
};

function build(type = gameType) {
  NperEdge = Math.sqrt(type + 1);
  N = NperEdge ** 2;
  Edge = NperEdge * edge;
  eCell = { top: `${Edge}px`, left: `${Edge}px`, pos: NperEdge ** 2 }; //extraCell 4,9,16

  if (arguments.length) {
    tiles.forEach(tile => tile.removeEventListener("click", handler)); //удаление слушателей перед рисованием поля новой размерности
    board.innerHTML = "";
  }

  for (let i = 0; i < N; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.style.width = `${edge}px`;
    tile.style.height = `${edge}px`;

    tile.style.top = `${Math.floor(i / NperEdge) * edge}px`;
    tile.style.left = `${(i % NperEdge) * edge}px`;
    tile.setAttribute("data-pos", `${i + 1}`);
    tile.innerText = i + 1;

    if (i == N - 1) {
      tile.setAttribute("id", "lastC"); //?????????

      tile.innerText = "";
    }

    board.appendChild(tile);
  }

  board.style.width = `${Edge}px`;
  board.style.height = `${Edge}px`;
  board.setAttribute("id", "board");
  board.style.fontSize = `${edge / 2}px`;

  document.body.appendChild(board);
  lastC.appendChild(btnBox); // board.style.pointerEvents = "none";

  tiles = document.querySelectorAll(".tile");
  btnBoxs = document.querySelectorAll("button");

  btnBoxs.forEach(btnBox => {
    btnBox.style.fontSize = `${edge / 4.1}px`;
  });

  tiles.forEach(tile => tile.addEventListener("click", handler));
}

function handler() {
  if (!this) return;
  move(this);

  for (let i = 0; i < tiles.length - 1; i++)
    if (+tiles[i].textContent != i + 1) return;

  // зеленая рамка в финале и отключение кликабельности плиток
  board.style.borderColor = "green"; // board.style.pointerEvents = "none";
  board.style.pointerEvents = "none";
  lastC.appendChild(btnBox);

  winSound.play(); // winSound.playbackRate = 4;
}

build();

// Добавление слушателей на каждый тайл
tiles.forEach(tile => tile.addEventListener("click", handler));

btnBox.addEventListener("click", evt => {
  board.style.pointerEvents = "auto";

  if (gameType != parseInt(evt.target.innerText))
    build(parseInt(evt.target.innerText));

  gameType = parseInt(evt.target.innerText);

  shuffle();
});
const buttons = document.querySelectorAll("button");
