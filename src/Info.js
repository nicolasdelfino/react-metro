import React from 'react'

class Info extends React.Component {
	render() {
		return (
			<div>
				<hr />
				<div>
					<p className="cool">
						React Metro is a tiny configurable wrapper for animating dom
						elements as they mount or unmount
					</p>
					* Optional hooks for binding methods to sequence end and start.<br />
					* Ships with a simple fade in/out animation but everything can be
					overriden by either providing generic default animation override or a
					index based animationMap<br />
				</div>

				<p className="code">import {'{ Metro }'} from './Metro'</p>

				<h3>Create a sequence and map it</h3>
				<p className="code">
					{'// in method renderMetroComponents:'}
					<br />
					<br />
					return Metro.sequence(someArray, animationsMap).map((data, index) =>{' '}
					{'{'}
					<br />
					<br />
					{'/* Setup Metro props */'}
					<br />
					const props = {'{'}
					<br />
					&nbsp;&nbsp;index,<br />
					&nbsp;&nbsp;sequence: data.sequence,<br />
					&nbsp;&nbsp;...data.props,<br />
					&nbsp;&nbsp;wrapperType: 'div', {'// div, ul whatever...'}
					<br />
					&nbsp;&nbsp;clickHandler: this.yourClickMethod.bind(this),<br />
					&nbsp;&nbsp;mountSequenceComplete: this.yourMountComplete.bind(this),{' '}
					<br />
					&nbsp;&nbsp;unmountSequenceComplete:
					this.yourUnmountComplete.bind(this)<br />
					{'}'}
					<br />
					<br />
					{'return ('}
					<br />
					{'<'}Metro.animation key={'{i}'} props={'{...props}'} {'/> }'}
					<br />
					&nbsp;&nbsp;{'<'}YourComponent content={'{data.props.content}/>'}
					<br />
					{'<'}Metro.animation {'/>)})'}
					<br />
				</p>

				<h3>& render it:</h3>
				<p className="code">
					{'<TransitionGroupPlus> <- pass in component="li/div/ul..."'}
					<br />
					{'{ this.renderMetroComponents() } '}
					<br />
					{'</TransitionGroupPlus>'}
				</p>
			</div>
		)
	}
}

export default Info
