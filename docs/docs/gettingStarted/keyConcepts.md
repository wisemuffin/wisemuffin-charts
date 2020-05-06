---
id: keyConcepts
title: Key Concepts
---

# Accessor

Accessors are functions that tell the visualisation how to access data elements within your data object.

Take this data object of pokemon:

```javascript
const data = [
    {
        name: 'dave'
        attack: 9000
        type: 'water'
    },
]
```

I want to plot pokemon by attack along my y axis.

Instead of hardcoding every time i want to use the attack attribute, i just tell the visulation to use attack attribute for the yAccessor:

```javascript
const yAccessor = d => d.attack;
const categoryAccessor = d => d.name;
```
