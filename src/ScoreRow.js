import React from "react";
import "./style.css";
import {BONUS, TOTAL} from "./const.js";

export default function ScoreRow(props) {

  const i = props.row>=BONUS?
            props.row-1:props.row;

  const enableClick = (
                props.row!=BONUS && 
                props.row!=TOTAL && 
                props.beginingOfTurn
                ==false )?
                true:false;
  
  const allowHover = enableClick && props.canBePlayed;
  console.log(allowHover && enableClick);

  return ( <tr>
            <td key={"sctdh"}
                className={allowHover?"CanClick":"CannotClick"}
                onClick={(e) =>  props.handleClickScore(e,i,enableClick)}>
                <span>{props.labels}</span><em>{props.roll.Score().Preview()[props.row]}</em>
            </td>
            {props.scoreRow.map( (e,i) => <td key={"sctd"+i}>{e}</td>)}  
           </tr>  );
  }
