<p align="center">
<img src="http://nicolasdelfino.com/metro_web_text.png" alt="metro logo" />
</p>

> A tiny configurable wrapper for animating dom elements as they mount or unmount

* Optional hooks for binding methods to sequence end and start.
* Comes with a simple fade animation but everything can be overriden by providing a custom animationsMap

#### Codesandbox demo
<a href="https://codesandbox.io/s/w0orz7j5p8" target="_blank">
<img src="https://camo.githubusercontent.com/416c7a7433e9d81b4e430b561d92f22ac4f15988/68747470733a2f2f636f646573616e64626f782e696f2f7374617469632f696d672f706c61792d636f646573616e64626f782e737667" alt="edit metro on codesandbox" /></a>


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

const data = ['cat', 'dog']

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
#### Customizing animations
```javascript
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
      to: { opacity: 1, y: 0, x: 0, ease: "easeInOutElastic" }
    }
  },
  {
    out: {
      time: 1.4,
      delay: 0
    },
    willEnter: {
      from: { opacity: 0, y: 120, x: -30 },
      to: { opacity: 1, y: 0, x: 0, ease: "easeInOutElastic" }
    }
  }
];

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
      to: { opacity: 1, y: 0, ease: "easeInOutQuad" }
    },
    willLeave: {
      from: {
        opacity: 1,
        y: 0
      },
      to: { opacity: 0, y: 50, ease: "easeInOutQuad" }
    }
  }
};
```
#### Callbacks
```javascript
clickHandler // receives props (original array data) and index
mountSequenceComplete
unmountSequenceComplete
```

#### Disclaimer: GSAP tools are subject to their own license (www.greensock.com)
