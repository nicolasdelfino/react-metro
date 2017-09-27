<p align="center">
<img src="http://nicolasdelfino.com/metro_web_text.png" alt="metro logo" />
</p>

[![Build Status](https://travis-ci.org/nicolasdelfino/react-metro.svg?branch=master)](https://travis-ci.org/nicolasdelfino/react-metro) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/nicolasdelfino/react-metro/issues)

> A tiny configurable wrapper for animating dom elements as they mount or unmount

* Optional hooks for binding to mount / unmount sequence complete.
* Comes with a simple fade animation but everything can be overriden by providing a custom animationsMap

#### Codesandbox demo
<a href="https://codesandbox.io/s/w0orz7j5p8" target="_blank">
<img src="https://camo.githubusercontent.com/416c7a7433e9d81b4e430b561d92f22ac4f15988/68747470733a2f2f636f646573616e64626f782e696f2f7374617469632f696d672f706c61792d636f646573616e64626f782e737667" alt="edit metro on codesandbox" /></a>

### Important notes:
27/09: 1.4.0 introduces BREAKING CHANGES, improvements to the api, see docs below

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

return Metro.sequence(
data,
animationsMap, // optional 
defaultAnimation // optional
).map(data => {
  return (
    <Metro.animation
      {...data}
      wrapperType='div', // optional ul or whatever, defaults to div
      onClick={this.onClick.bind(this)} // optional
      onMount={this.onMountComplete.bind(this)} // optional
      onUnmount={this.onUnmountComplete.bind(this)}> // optional
      <YourComponent {...data.content} />
    </Metro.animation>
  )
})
```
& render it:
```javascript
<TransitionGroupPlus> // optional arg type="li/div/ul..."
{ this.renderMetroComponents() } 
</TransitionGroupPlus>
```
#### Customizing animations
```javascript
// override Metro´s default animations settings for each unique item in your items
// array, see greensock tweenmax for reference.
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
#### Methods
```javascript
wrapperType // dom element, defaults to div
onClick // receives props (original array data) and array index
onMount // fires when the mount sequence completes
onUnmount // fires when the unmount sequence completes
```
#### Advanced usage
The real power of Metro shines through it's use of dynamic animationMaps.

<a href="https://codesandbox.io/s/w0orz7j5p8" target="_blank">The second demo</a> demonstrates the concept of dynamic sequences. This is achieved by altering the sequence´s animationMap on user interaction.

We define an animatonMap to achieve the delayed entrance effect we want. Since the active animationMap is stored in our wrapper component´s local state we can replace our initial map on user interaction, thus making the animation interactive.

Even though the developer has total control of an animation through the use of custom animationMaps, we created a helper method called Metro.generateFocusMap for cases where you want to accentuate a specific item within your sequence without having to write logic.

These presets - today a total of 4: verticalDelayed, dominoForwards, dominoBackwards, dominoMulti, is something that you as a developer are more than welcome to contribute to. Ideas for upcoming presets are stuff like 'checkerBoard' / 'wave' / 'circular' etc...

Each preset should try to incorporate the focus-first logic as they are intended to accentuate a clicked component.
Current api for using the method is:
```javascript
const domino = Metro.generateFocusMap(
  index, //focus - index of clicked component
  6, // columns
  this.state.data.length, // length of sequence
  this.state.preset // preset - dynamic in state or put directly as string 'dominoMulti' 
  duration // optional (default 1 second)
)
this.setState({animationMap: domino}) // -> do unmount logic...
```

#### Contribute

##### PRs
PRs are welcomed, to contribute make sure that:
* Branch name references issue number if it adresses a feature / bug fix.
* Branch has already been [synced with the upstream repo](https://help.github.com/articles/syncing-a-fork/) and any merge-conflicts have been resolved.
* Install eslint and prettier to avoid lint issues while developing

##### Issues
Please be descriptive 

#### Disclaimer: GSAP tools are subject to their own license (www.greensock.com)
