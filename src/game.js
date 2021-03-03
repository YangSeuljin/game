import Field from './field.js';
import * as sound from './sound.js'

export let Started = false;

export const Reason = Object.freeze({
    win: 'win',
    lose: 'lose',
    cancel:'cancel',
})

export class GameBuilder{
    withGameDuration(duration){
        this.gameDuration = duration;
        return this;
    }

    withCarrotcount(num){
        this.carrotcount = num;
        return this;
    }
    withBugCount(num){
        this.bugCount = num;
        return this;
    }
    build(){
        return new Game(
            this.gameDuration,
            this.carrotcount,
            this.bugCount
        )
    }
}
  class Game {
    constructor(gameDuration, carrotCount, bugCount) {
        this.gameDuration = gameDuration;
        this.carrotCount = carrotCount;
        this.bugCount = bugCount;


        this.gameTimer = document.querySelector(".game__timer");
        this.gameScore = document.querySelector(".game__score");

        this.gameBtn = document.querySelector(".game__button");
        this.gameBtn.addEventListener("click", () => {
            if (Started) {
                this.stop();
            } else {
                this.start();
            }
        });

        this.score = 0;
        this.timer = undefined;

        this.gameField = new Field(carrotCount, bugCount);
        this.gameField.setClickListener(this.onItemClick);

    }
    setGameStopListener(onGameStop) {
        this.onGameStop = onGameStop;
    }
    start() {
        sound.playBackground();
        Started = true;
        this.initGame();
        this.showStopButton();
        this.showTimerAndScore();
        this.startGameTimer();
    }
    stop() {
        Started = false;
        this.stopGameTimer();
        this.hideGameButton();
        sound.playAlert();
        sound.stopBackground();
        this.onGameStop && this.onGameStop(Reason.lose);
    }
    finish(win) {
        Started = false;
        this.hideGameButton();
        sound.stopBackground();
        if (win) {
            sound.playWin();
        } else {
            sound.playBug();
        }
        this.stopGameTimer();
        clearInterval(this.timer);
        this.onGameStop && this.onGameStop(win ? Reason.win : Reason.lose);
    }

    onItemClick = (item) => {
        if (!Started) {
            return;
        }
        if (item === "carrot") {
            this.score++;
            this.updateScoreBoard();
            if (this.score === this.carrotCount) {
                this.finish(true);
            }
        } else if (item === "bug") {
            this.finish(false);
        }

    };
    showStopButton() {
        const icon = this.gameBtn.querySelector(".fas");
        icon.classList.add("fa-stop");
        icon.classList.remove("fa-play");
        this.gameBtn.style.visibility = "visible";
    }

    hideGameButton() {
        this.gameBtn.style.visibility = "hidden";
    }

    showTimerAndScore() {
        this.gameTimer.style.visibility = "visible";
        this.gameScore.style.visibility = "visible";
    }

    startGameTimer() {
        let remainingTimeSec = this.gameDuration;
        this.updateTimerText(remainingTimeSec);
        this.timer = setInterval(() => {
            if (remainingTimeSec <= 0) {
                clearInterval(this.timer);
                this.finish(this.carrotCount === this.score);
                return;
            }
            this.updateTimerText(--remainingTimeSec);
        }, 1000);
    }

    stopGameTimer() {
        clearInterval(this.timer);
    }

    updateTimerText(time) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        this.gameTimer.innerText = `${minutes}:${seconds}`;
    }

    initGame() {
        this.score = 0;
        // 벌레와 당근을 생성한 뒤 필드에 추가해준다.
        this.gameScore.innerText = this.carrotCount;
        this.gameField.init();
    }

    updateScoreBoard() {
        this.gameScore.innerText = this.carrotCount - this.score;
    }
}