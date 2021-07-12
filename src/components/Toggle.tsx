import { InputHTMLAttributes } from 'react'
import '../styles/toggle-button.scss'

export function ToggleButton({...props }: InputHTMLAttributes<HTMLInputElement>){
	return (
		<div className="toggle-switch">
			<input type="checkbox" className="toggle-switch-checkbox" name="toggleSwitch" id="toggleSwitch"
			{...props}
			/>
			<label className="toggle-switch-label" htmlFor="toggleSwitch">
				<span className="toggle-switch-inner"></span>
				<span className="toggle-switch-switch"></span>
			</label>
		</div>)
}