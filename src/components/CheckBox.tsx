export function CheckBox(props) {
  const { label, ...rest } = props;
  return (
    <div className="checkbox-wrapper-46">
      <input type="checkbox" id="cbx-46" className="inp-cbx" {...rest}/>
      <label htmlFor="cbx-46" className="cbx">
        <span>
          <svg viewBox="0 0 12 10" height="10px" width="12px">
            <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
          </svg>
        </span>
        <span>{label}</span>
      </label>
    </div>
  );
}
