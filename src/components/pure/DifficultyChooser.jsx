import React from 'react';
import cnames from 'classnames/dedupe';
import { Dropdown } from 'react-bootstrap';

export const easy = 2;
export const normal = 8;
export const hard = 12;

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
    // Dropdown.Item replaces <li><a> — BS3 data-toggle is gone, react-bootstrap manages state
    <Dropdown.Item className={choiceClass} title={'0 - '+ difficulty +' dislikes per guest, average of ' + (difficulty/2) } onClick={() => {
        setDifficulty(difficulty);
      }}>{difficultyName}</Dropdown.Item>
  );
}

const DifficultyChooser = ({difficulty = normal, setDifficulty, onClick, children, className}) => {

  const difficultyName = getDifficultyName(difficulty);
  const actionClass = classNames.Action[difficultyName];

  const actionContent = children || difficultyName;

  return (
    // BS5 split-button dropdown via react-bootstrap: no data-toggle, no jQuery
    <Dropdown as="div" className={cnames("btn-group", className)}>
      <button type="button" className={cnames('btn', actionClass)} onClick={onClick}>{actionContent}</button>
      <Dropdown.Toggle split className={cnames('btn', actionClass)} id="difficulty-dropdown">
        <span className="visually-hidden">Toggle Dropdown</span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <DifficultyChoice difficulty={easy} setDifficulty={setDifficulty} />
        <DifficultyChoice difficulty={normal} setDifficulty={setDifficulty} />
        <DifficultyChoice difficulty={hard} setDifficulty={setDifficulty} />
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DifficultyChooser;
