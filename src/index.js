/* eslint-env browser */
import './scss/main.scss';

const _ = require('underscore');

const board = document.querySelector('.board');
const music = new Audio('dist/audio/theme.mp3');
const win = new Audio('dist/audio/win.mp3');
const mute = document.querySelector('.mute');


const game = {
  tiles: ['1up', 'bowser', 'feather', 'flower', 'mario', 'mushroom', 'star', 'what',
    '1up', 'bowser', 'feather', 'flower', 'mario', 'mushroom', 'star', 'what'],
  muted: false,
  selected: [],
  playing: false,
  watchTiles() {
    document.querySelector('.board').addEventListener('click', (e) => {
      console.log(this.selected)
      if (this.selected.length === 2) {
        return;
      }
      this.justClicked = true;
      setTimeout(() => {
        this.justClicked = false;
      }, 500);
      const tile = e.target.parentElement;
      const id = tile.dataset.id;
      const type = e.target.dataset.type;
      if (tile.classList.contains('hidden')) {
        this.displayTile(tile);
        if (this.selected.length === 0) {
          this.selected.push(tile);
        } else {
          this.selected.push(tile);
          if (this.selected[0].children[0].dataset.type === type) {
            this.matches += 1;
            setTimeout(() => {
              this.selected = [];
            }, 1000);
            if (this.matches === 8) {
              this.wonGame();
            }
            return;
          }
          setTimeout(() => {
            this.hideTile(tile);
            this.hideTile(this.selected[0]);
            this.selected = [];
          }, 1000);
        }
      }
    });
  },
  mute() {
    this.muted = !this.muted;
    if (this.muted) {
      music.pause();
    } else if (this.playing) {
      music.play();
    }
  },
  wonGame() {
    if (!this.muted) {
      win.play();
    }
    board.innerHTML = '<div class="winner">Finally!</div>';
    setTimeout(() => {
      board.innerHTML = '<button class="start">Play Again!</button>';
    }, 5000);
  },
  startGame() {
    this.firstClick = true;
    this.firstType = null;
    this.firstClicked = null;
    this.matches = 0;
    this.playing = true;
    if (!this.muted) {
      music.play();
    }

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
                      <div class="tile__inner question-mark" data-type="${tile}" style="background-image: url('dist/images/qmark.jpg')"></div>
                      <div class="tile__inner" style="background-image: url('dist/images/${tile}.jpg')"></div>
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

mute.addEventListener('click', () => game.mute());
