import React from 'react';
import cnames from 'classnames/dedupe';

export const easy = 2;
export const normal = 4;
export const hard = 6;

const isHard = (diff) => diff >= hard;
const isNormal = (diff) => diff < hard && diff > easy;
const isEasy = (diff) => diff <= easy;

const getDifficultyName = (diff) => {
  if(isHard(diff)) return "Hard";
  if(isEasy(diff)) return "Easy";
  return "Normal";
}

const round2Places = (num) => Math.round(num * 100) / 100;

const classNames = {
  Action: {
    Hard: "btn-danger",
    Normal: "btn-warning",
    Easy: "btn-success",
  },
  Choice: {
    Hard: "bg-danger",
    Normal: "bg-warning",
    Easy: "bg-success",
  }
}

const DifficultyChoice = ({difficulty, setDifficulty}) => {
  const difficultyName = getDifficultyName(difficulty);
  const choiceClass = classNames.Choice[difficultyName];
  return (
    <li><a className={choiceClass} title={'0 - '+ difficulty +' dislikes per guest, average of ' + (difficulty/2) } onClick={() => {
        setDifficulty(difficulty);
      }}>{difficultyName}</a></li>
  );
}

const DifficultyChooser = ({difficulty = normal, setDifficulty, onClick, children}) => {

  const difficultyName = getDifficultyName(difficulty);
  const actionClass = classNames.Action[difficultyName];

  const actionContent = children || difficultyName;

  return (
    <div className={cnames("btn-group")}>
      <button type="button" className={cnames('btn', actionClass)} onClick={onClick}>{actionContent}</button>
      <button type="button" className={cnames("btn dropdown-toggle", actionClass)} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <span className="caret"></span>
        <span className="sr-only">Toggle Dropdown</span>
      </button>
      <ul className="dropdown-menu">
        <DifficultyChoice difficulty={easy} setDifficulty={setDifficulty} />
        <DifficultyChoice difficulty={normal} setDifficulty={setDifficulty} />
        <DifficultyChoice difficulty={hard} setDifficulty={setDifficulty} />
      </ul>
    </div>
  );
}

export default DifficultyChooser;
