import React from "react";
import "./style.css";

import { BONUS, score_labels } from "./const.js";
import Players from "./Players.js";
import ScoreRow from "./ScoreRow.js";
import Dice from "./Dice.js";

export default class Scores extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      score: [Array(13).fill(0), Array(13).fill(0)],
      canBePlayed: [Array(13).fill(true), Array(13).fill(true)],
      labels: score_labels,
      preview: Array(13).fill(""),
      names: ["P1", "P2"],
      diceRollArr: Array(5).fill(0),
      diceHoldsArr: Array(5).fill(false),
      tryNo: 3,
      playerTurnIndex: 0,
      beginingOfTurn: true,
      endGame: false
    };

    this.handleClickRoll = this.handleClickRoll.bind(this);
    this.handleClickHold = this.handleClickHold.bind(this);
    this.clickScore = this.clickScore.bind(this);
    this.switchClass = this.switchClass.bind(this);
  }

  handleClickRoll = e => {
    e.preventDefault( );
    const roll = (s) => s.diceRollArr;
    const myroll = (s) => roll(s).Roll(s.diceHoldsArr);

    if (this.state.tryNo > 0)
      this.setState(
        {
          diceRollArr: myroll(this.state),
          tryNo: this.state.tryNo - 1,
          beginingOfTurn: false
        });
     
  };

  switchClass = (i, trueCond, fromClass, toClass) => {
    const el = document.getElementById("d" + i);
    if (trueCond) {
      el.classList.remove(fromClass);
      el.classList.add(toClass);
    } else {
      el.classList.remove(toClass);
      el.classList.add(fromClass);
    }
  };

  handleClickHold = (e, i) => {
    const h = this.state.diceHoldsArr;

    e.preventDefault();

    h[i] = !h[i];

    this.switchClass(i, h[i] == true, "DiceRoll", "DiceHold");

    this.setState(state => ({ diceHoldsArr: h }), () => console.log(h));
    console.log(h);
    console.log(this.state.diceRollArr);
  };

  clickScore = (e, i, enableClick) => {
    const canBePlayed = this.state.canBePlayed;

    e.preventDefault();

    if (enableClick && canBePlayed[this.state.playerTurnIndex][i]) {

      const score = this.state.score;
      score[this.state.playerTurnIndex][i] = this.state.diceRollArr.Score()[i];

      canBePlayed[this.state.playerTurnIndex][i] = false;

      this.setState(
        state => ({
          score: score,
          canBePlayed: canBePlayed,
          playerTurnIndex:
            (this.state.playerTurnIndex + 1) % this.state.names.length,
          beginingOfTurn: true,
          diceRollArr: Array(5).fill(0),
          diceHoldsArr: Array(5).fill(false),
          tryNo: 3
        }),

        () => {
          const scr_arr=  this.state.score.map( (v,p)=>[this.state.names[p], v.Sum()+v.Bonus()]);
          const scr_sorted = scr_arr.sort( (a,b)=> b[1]-a[1]);
          console.log(scr_sorted);
        }
      );

      if (canBePlayed.every(v => v.every(u => u == false) == false)) {
        this.setState(state => ({
          endGame: true
        }));
      }
    }
  };

  render() {
    const bonus = p => (p.slice(0, BONUS).Sum() > 62 ? 35 : 0);
    const total = p => p.Sum() + bonus(p);
    const scoreArr = p => [
      ...p.slice(0, BONUS),
      bonus(p),
      ...p.slice(BONUS, p.length),
      total(p)
    ];

    const myroll = this.state.diceRollArr.slice();

    return (
      <>
        <table>
            <tbody>
            <Players key={this.state.names}
              players={this.state.names}
              handleClickRoll={this.handleClickRoll}
              activePlayerInd={this.state.playerTurnIndex}
            />

            {score_labels.map((l, r) => (
              <ScoreRow key={"sr"+r}
                labels={l}
                roll={this.state.diceRollArr}
                row={r}
                canBePlayed={this.state.canBePlayed[this.state.playerTurnIndex].IndToRow()[r]}
                handleClickScore={this.clickScore}
                beginingOfTurn={this.state.beginingOfTurn}
                scoreRow={this.state.score.map(p => scoreArr(p)[r])}
              />
              
            ))}
          </tbody>
        </table>

        <Dice key="Dice"
          roll={myroll} 
          handleClickHold={this.handleClickHold}
          display={this.state.tryNo < 3 ? true : false}
        />
      </>
    );
  }
}
