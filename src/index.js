/* eslint-env browser */
import './scss/main.scss';

const _ = require('underscore');

const board = document.querySelector('.board');
const music = new Audio('/dist/audio/theme.mp3');
const win = new Audio('/dist/audio/win.mp3');


const game = {
  tiles: ['1up', 'bowser', 'feather', 'flower', 'mario', 'mushroom', 'star', 'what',
    '1up', 'bowser', 'feather', 'flower', 'mario', 'mushroom', 'star', 'what'],
  watchTiles() {
    document.querySelector('.board').addEventListener('click', (e) => {
      const tile = e.target.parentElement;
      const id = tile.dataset.id;
      const type = e.target.dataset.type;
      if (tile.classList.contains('hidden')) {
        this.displayTile(tile);
        if (this.firstClick) {
          this.firstClicked = tile;
          this.firstClick = false;
          this.firstType = type;
        } else {
          this.firstClick = true;
          if (this.firstType === type) {
            this.matches += 1;
            if (this.matches === 8) {
              this.wonGame();
            }
            return;
          }
          setTimeout(() => {
            this.hideTile(tile);
            this.hideTile(this.firstClicked);
          }, 1000);
        }
      }
    });
  },
  wonGame() {
    music.pause();
    win.play();
    board.innerHTML = '<button class="start">Start Game!</button>';
  },
  startGame() {
    this.firstClick = true;
    this.firstType = null;
    this.firstClicked = null;
    this.matches = 0;
    music.play();
    this.watchTiles();
    this.makeBoard();
  },
  displayTile(tile) {
    tile.classList.remove('hidden');
  },
  hideTile(tile) {
    tile.classList.add('hidden');
  },
  makeBoard() {
    this.tiles = _.shuffle(this.tiles);
    let tilesHTML = '';
    this.tiles.forEach((tile, i) => {
      tilesHTML += `<div class="tile hidden" data-id="${i}">
                      <div class="tile__inner question-mark" data-type="${tile}" style="background-image: url('/dist/images/qmark.jpg')"></div>
                      <div class="tile__inner" style="background-image: url('/dist/images/${tile}.jpg')"></div>
                    </div>`;
    });
    board.innerHTML = tilesHTML;
  },
};

document.body.addEventListener('click', (e) => {
  if (e.target.classList.contains('start')) {
    game.startGame();
  }
});

