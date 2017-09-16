import React from 'react'
import { render } from 'react-dom'
import TransitionGroupPlus from 'react-transition-group-plus'
import DemoComponent from './DemoComponent'
import Info from './Info'
import { Twemoji } from 'react-emoji-render'
import { Metro } from './Metro'

// override Metro´s default animations settings for each unique item in your items
// array, see greensock tweenmax for reference.
// helper functions to create animation maps coming soon
const animationMap = [
	{
		in: {
			time: 3,
			delay: 0
		},
		out: {
			time: 1.4,
			delay: 1
		},
		willEnter: {
			from: { opacity: 0, y: 120, x: 30 },
			to: { opacity: 1, y: 0, x: 0, ease: 'easeInOutElastic' }
		}
	},
	{
		in: {
			time: 3,
			delay: 0
		}
	},
	{
		out: {
			time: 1.4,
			delay: 0
		},
		willEnter: {
			from: { opacity: 0, y: 120, x: -30 },
			to: { opacity: 1, y: 0, x: 0, ease: 'easeInOutElastic' }
		}
	}
]

// Metro comes with a simple, fade in / out default. This object passed
// in as the third argument in the Metro.sequence overrides the default settings.
const defaultAnimationOverride = {
	animation: {
		out: {
			time: 0.5,
			delay: 0
		},
		in: {
			time: 1,
			delay: 0
		},
		willEnter: {
			from: { opacity: 0, y: 50 },
			to: { opacity: 1, y: 0, ease: 'easeInOutQuad' }
		},
		willLeave: {
			from: {
				opacity: 1,
				y: 0
			},
			to: { opacity: 0, y: 50, ease: 'easeInOutQuad' }
		}
	}
}

class Page extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			show: false,
			mountComplete: false,
			unmountComplete: false
		}

		this.toggle = this.toggle.bind(this)
	}

	toggle() {
		this.setState({
			show: !this.state.show,
			mountComplete: false,
			unmountComplete: false
		})
	}

	mountSequenceComplete() {
		console.log('mountSequenceComplete')
		this.setState({ mountComplete: true, unmountComplete: false })
	}

	unmountSequenceComplete() {
		console.log('unmountSequenceComplete')
		this.setState({ mountComplete: false, unmountComplete: true })
	}

	componentClickCallback(props, index) {
		console.log('component clicked - props:', props, 'index:', index)
	}

	renderButtons() {
		return (
			<div>
				<div
					className="buttonStyle"
					style={{
						background: this.state.show === true ? 'red' : 'black'
					}}
					onClick={() => this.toggle()}
				>
					{this.state.show === true ? 'unmount components' : '-> MOUNT!!!!'}
				</div>
			</div>
		)
	}

	//////////////////////////////////// METRO START ////////////////////////////////////

	renderMetroComponents() {
		if (!this.state.show) {
			return null
		}

		const data = [
			{ name: 'monkey', emoji: '🐵' },
			{ name: 'dog', emoji: '🐶' },
			{ name: 'cow', emoji: '🐮' }
		]

		return Metro.sequence(
			data,
			animationMap,
			defaultAnimationOverride
		).map((data, index) => {
			const props = {
				index,
				...data.props,
				sequence: data.sequence,
				wrapperType: 'div',
				clickHandler: this.componentClickCallback.bind(this),
				mountSequenceComplete: this.mountSequenceComplete.bind(this),
				unmountSequenceComplete: this.unmountSequenceComplete.bind(this)
			}

			return (
				<Metro.animation key={index} {...props}>
					<DemoComponent {...data.props.content} />
				</Metro.animation>
			)
		})
	}

	//////////////////////////////////// METRO END ////////////////////////////////////

	getText() {
		if (this.state.unmountComplete === true) {
			return '(unmount sequence complete)'
		} else if (this.state.mountComplete === true) {
			return '(mount sequence complete)'
		}
		return '...'
	}

	render() {
		return (
			<div className="wrapper">
				<Twemoji text={'React Metro 🚇'} style={{ fontSize: 40 }} />
				<h3>
					<p>{'Demo -> status = ' + this.getText()}</p>
				</h3>

				<div className="container">
					{this.renderButtons()}
					<TransitionGroupPlus component="div">
						{this.renderMetroComponents()}
					</TransitionGroupPlus>
				</div>
				<Info />
			</div>
		)
	}
}

render(<Page />, document.getElementById('root'))
