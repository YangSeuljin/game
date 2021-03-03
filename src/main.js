"use strict";
import PopUp from "./popup.js";
import {GameBuilder,  Reason } from "./game.js";

const game = new GameBuilder()
  .withGameDuration(5)
  .withCarrotcount(3)
  .withBugCount(3)
  .build();

const gameFinishBanner = new PopUp();
gameFinishBanner.setClickListener(() => {
    game.start();
});

game.setGameStopListener((reason)=>{
  let message;
  switch(reason){
    case Reason.cancel:
      message = 'Replay?';
      break;
      case Reason.win:
        message = 'YOU WON!';
        break;
        case Reason.lose:
          message = 'YOU LOST!';
          break;
          default:
            throw new Error('not valid reason');
  }
  gameFinishBanner.showWithText(message);
})



