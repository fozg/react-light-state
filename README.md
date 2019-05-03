# React Light State
Light and simple React state management.

## Intro
Easy to manage global state with 2 functions:
  1. 

## Install
```sh
npm install react-light-state
```

## Usage
```js
const initialState = { text: "Phong" };
const InputMessage = new Doto(initialState);
export const withDoto = component => InputMessage.withDoto(component);
export const setInputMessage = data => InputMessage.setDoto(data);
```

