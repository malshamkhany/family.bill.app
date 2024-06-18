export default function ToggleSwitch(props: any) {
    return (
        <label className="toggle-switch">
            <input type="checkbox" {...props} />
            <div className="toggle-switch-background">
                <div className="toggle-switch-handle"></div>
            </div>
        </label>
    );
}
