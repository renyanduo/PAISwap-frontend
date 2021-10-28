import { useEffect, useState } from "react";
import "./index.scss";

function Switch({ checked, onChange, ...props }) {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  function onInputChange(e) {
    const value = e.target.checked;
    setIsChecked(value);
    if (!onChange) {      
      return;
    }
    onChange(value);
  }

  return (
    <label className="switch">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onInputChange}
        className="switch-checkbox"
      />
      <div
        className={ 
          isChecked
            ? "switch-container switch-container-checked" 
            : "switch-container" 
         }
      ></div>
    </label>
  );
}

export default Switch;