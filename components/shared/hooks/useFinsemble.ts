/*
Examples of FSBL types usage:
import { FSBL } from "@chartiq/finsemble/src/globals";
/// <reference types="@chartiq/finsemble" />
*/
import { useState, useReducer } from "react";

const FSBL = window.FSBL;

const { LauncherClient, WindowClient } = FSBL.Clients;

export default function useFinsemble() {
  /*
	Why use hooks?
	- reduce code footprint
	- keep state
	*/
  const [fsblState, useFsblState] = useState();

  const setWindowId = async () => {
    const windowId = await LauncherClient.getMyWindowIdentifier();
    dispatch({
      type: types.SET_WINDOW_ID,
      payload: {
        windowId
      }
    });
  };

  const setWindowPosition = async (
    windowId: WindowIdentifier,
    position: {}
  ) => {
    const { data } = await LauncherClient.showWindow(windowId, position);
    const { windowDescriptor: windowPosition } = data;
    dispatch({
      type: types.SET_WINDOW_POSITION,
      payload: {
        windowPosition
      }
    });
  };

  const fitToDom = (): void => {
    WindowClient.fitToDOM();
  };

  const getMonitorInfo = (windowIdentifier: WindowIdentifier) =>
    LauncherClient.getMonitorInfo({ windowIdentifier });

  return {
    getMonitorInfo,
    fitToDom,
    setWindowId,
    setWindowPosition
    // ...useDistributedStore(),
  };
}
