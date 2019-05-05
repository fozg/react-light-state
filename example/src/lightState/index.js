import LightState from "../react-light-state";

export const InputMessage = new LightState({text: "phong"});

export const setInputMessage = data => InputMessage.setState(data);
