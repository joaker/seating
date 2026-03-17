import React from 'react';
import styles from './StepperInput.module.scss';

interface StepperInputProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}

const StepperInput: React.FC<StepperInputProps> = ({
  value,
  min,
  max,
  step = 1,
  onChange,
}) => {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  const handleDecrement = () => {
    onChange(clamp(value - step));
  };

  const handleIncrement = () => {
    onChange(clamp(value + step));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseInt(e.target.value, 10);
    if (!isNaN(parsed)) {
      onChange(parsed);
    }
  };

  const handleBlur = () => {
    onChange(clamp(value));
  };

  return (
    <div className={styles.stepper}>
      <button
        type="button"
        className={styles.stepBtn}
        onClick={handleDecrement}
        disabled={value <= min}
        aria-label="Decrease"
      >
        &minus;
      </button>
      <input
        type="number"
        className={styles.stepInput}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <button
        type="button"
        className={styles.stepBtn}
        onClick={handleIncrement}
        disabled={value >= max}
        aria-label="Increase"
      >
        +
      </button>
    </div>
  );
};

export default StepperInput;
