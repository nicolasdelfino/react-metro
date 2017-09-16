import React from 'react'
import { Twemoji } from 'react-emoji-render'

const styles = {
	width: 300,
	height: 100,
	background: 'dodgerBlue',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	margin: 10,
	fontSize: 15,
	color: 'white'
}

class DemoComponent extends React.Component {
	render() {
		return (
			<div style={{ ...styles }}>
				{this.props.name}
				<Twemoji text={this.props.emoji} style={{ fontSize: 50 }} />
			</div>
		)
	}
}

export default DemoComponent
