import LightState from "../../src";

export const InputMessage = new LightState({text: "Default text"});

export const setInputMessage = data => InputMessage.setState(data);
