# react-metro 🚇

> A tiny configurable wrapper for animating dom elements as they mount or unmount

* Optional hooks for binding methods to sequence end and start.
* Comes with a simple fade animation but everything can be overriden by providing a custom animaionsMap

#### Codesandbox demo
https://codesandbox.io/s/w0orz7j5p8

#### Usage
Install
```javascript
npm install react-metro
```
Import
```javascript
import Metro from 'react-metro'
```
Create a sequence, map it:
```javascript
// in method renderMetroComponents:

// mount / unmount
if(!this.state.showMetroComponents)
{
  return null
}

return Metro.sequence(someArray, animationsMap).map((data, index) => {

/* Setup Metro props */
const props = {
  index,
  sequence: data.sequence,
  ...data.props,
  wrapperType: 'div', // div, ul whatever...
  clickHandler: this.yourClickMethod.bind(this),
  mountSequenceComplete: this.yourMountComplete.bind(this), 
  unmountSequenceComplete: this.yourUnmountComplete.bind(this)
}

return (
<Metro.animation key={i} props={...props} /> }
  <YourComponent content={data.props.content}/>
<Metro.animation />)})
```
& render it:
```javascript
<TransitionGroupPlus> <- pass in component="li/div/ul..."
{ this.renderMetroComponents() } 
</TransitionGroupPlus>
```

#### Disclaimer: GSAP tools are subject to their own license (www.greensock.com)
