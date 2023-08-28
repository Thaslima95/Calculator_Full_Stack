import React, { useReducer } from "react";
import styled from "styled-components";
import { Delete } from "@styled-icons/feather/Delete";
import { Divide } from "@styled-icons/fa-solid/Divide";
import { SquareRootVariable } from "styled-icons/fa-solid";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import HistoryIcon from "@mui/icons-material/History";
import HistoryComponent from "./HistoryComponent";
import { Dialog } from "@mui/material";
import { DialogTitle } from "@mui/material";
import { Button } from "@mui/material";
import { DialogContentText } from "@mui/material";
import { DialogContent } from "@mui/material";
import { DialogActions } from "@mui/material";

const reducer = (state, action) => {
  const sethistory = (state) => {
    console.log(state);
    console.log(JSON.parse(localStorage.getItem("history")));
    const getvalues = JSON.parse(localStorage.getItem("history")) || [];
    if (getvalues) {
      console.log(getvalues);
    }
    console.log(getvalues);
    getvalues.push({ values: state });

    localStorage.setItem("history", JSON.stringify(getvalues));
    return state;
  };
  const evaluate = (state) => {
    let previous = parseFloat(state.previousvalue);
    let current = parseFloat(state.firstValue);
    if (isNaN(previous) || isNaN(current)) return "";
    let calculate = "";
    switch (state.operation) {
      case "+":
        calculate = previous + current;
        break;
      case "-":
        calculate = previous - current;
        break;
      case "*":
        calculate = previous * current;
        break;
      case "/":
        calculate = previous / current;
        break;
      case "%":
        calculate = previous % current;
        break;
    }
    return calculate.toString();
  };
  switch (action.type) {
    case "Add-Digit":
      console.log(action.payload);
      if (action.payload == "0" && state.firstValue == "0") return state;
      if (action.payload == "." && state.firstValue.includes(".")) return state;
      if (state.overwrite) {
        return {
          firstValue: action.payload,
          overwrite: false,
        };
      }
      return {
        ...state,
        firstValue: `${state.firstValue || ""}${action.payload}`,
      };
    case "Operation-Digit":
      console.log(state.firstValue);
      console.log(action.payload);
      if (state.firstValue == null && state.previousvalue == null) return state;
      if (state.previousvalue == null) {
        return {
          ...state,
          operation: action.payload,
          previousvalue: state.firstValue,
          firstValue: null,
        };
      }
      if (state.firstValue == null) {
        return {
          ...state,
          operation: action.payload,
        };
      }
      return {
        ...state,
        previousvalue: evaluate(state),
        operation: action.payload,
        firstValue: null,
      };
    case "Evaluate":
      if (
        state.firstValue == null ||
        state.previousvalue == null ||
        state.operation == null
      )
        return state;
      return {
        ...state,
        overwrite: true,
        previousvalue:
          state.previousvalue +
          state.operation +
          state.firstValue +
          action.payload,
        operation: null,
        firstValue: evaluate(state),
        history: sethistory(
          state.previousvalue +
            state.operation +
            state.firstValue +
            action.payload +
            evaluate(state)
        ),
      };
    case "Clear":
      return {};
    case "Square":
      if (state.overwrite) {
        return {
          firstValue: action.payload,
          overwrite: false,
        };
      }
      return {
        ...state,
        operation: null,
        previousvalue: null,
        overwrite: true,
        firstValue: Number(state.firstValue) * Number(state.firstValue),
      };
    case "SquareRoot":
      if (state.overwrite) {
        return {
          firstValue: action.payload,
          overwrite: false,
        };
      }
      return {
        ...state,
        operation: null,
        previousvalue: null,
        overwrite: true,
        firstValue: Math.sqrt(state.firstValue).toFixed(2),
      };
  }
};
export default function Calc() {
  const [{ firstValue = "0", previousvalue, operation, history }, dispatch] =
    useReducer(reducer, {});
  const [historydata, setHistory] = useState([]);
  useEffect(() => {
    console.log(localStorage.getItem("history"));
    setHistory(JSON.parse(localStorage.getItem("history")));
  }, []);
  console.log(historydata);
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState("paper");

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const values = useRef(null);
  if (values.current) {
    console.log(values.current.textContent);
  }
  const values1 = useRef(null);
  if (values1.current) {
    console.log(values1.current.textContent);
  }

  return (
    <div className="maincontainer">
      {historydata.map((e) => console.log(e.values))}
      {console.log(localStorage.getItem("history"))}
      <div className="resultcontainer">
        {/* {historydata.map((e) => (
          <div className="">{e.values}</div>
        ))} */}
        <HistoryIcon onClick={handleClickOpen("paper")} />
        <div className=""></div>
        <div className="previous-value" ref={values}>
          {previousvalue} {operation}
        </div>
        <div className="current-values" ref={values1}>
          {firstValue}
        </div>
      </div>
      <div className="keyscontainer">
        <div className="grid-container">
          <button
            onClick={() => dispatch({ type: "Operation-Digit", payload: "%" })}
            name="%"
            className="grid-item"
            id="mod"
          >
            %
          </button>
          <button name="clears" className="grid-item" id="Clears">
            CE
          </button>
          <button
            onClick={() => dispatch({ type: "Clear" })}
            name="clear"
            className="grid-item"
            id="clear"
          >
            C
          </button>
          <button name="backspace" className="grid-item" id="backspace">
            <Delete size="12" />
          </button>
          <button name="1/x" className="grid-item" id="onebyx">
            <small>1/x</small>
          </button>
          <button
            onClick={() => dispatch({ type: "Square", payload: "square" })}
            name=""
            className="grid-item"
            id="sqaure"
          >
            x
            <sup>
              <small>2</small>
            </sup>
          </button>
          <button
            onClick={() =>
              dispatch({ type: "SquareRoot", payload: "squareRoot" })
            }
            name=""
            className="grid-item"
            id="squareroot"
          >
            <small>2</small>
            <SquareRootVariable className="sqaure" size="15" />
          </button>
          <button
            onClick={() => dispatch({ type: "Operation-Digit", payload: "/" })}
            name="/"
            className="grid-item"
            id="division"
          >
            <Divide size="14" />
          </button>
          <button
            onClick={() => dispatch({ type: "Add-Digit", payload: 7 })}
            name="7"
            className="grid-item"
            id="seven"
          >
            7
          </button>
          <button
            onClick={() => dispatch({ type: "Add-Digit", payload: 8 })}
            name="8"
            className="grid-item"
            id="eight"
          >
            8
          </button>
          <button
            onClick={() => dispatch({ type: "Add-Digit", payload: 9 })}
            name="9"
            className="grid-item"
            id="nine"
          >
            9
          </button>
          <button
            onClick={() => dispatch({ type: "Operation-Digit", payload: "*" })}
            name="*"
            className="grid-item"
            id="multiply"
          >
            x
          </button>
          <button
            onClick={() => dispatch({ type: "Add-Digit", payload: 4 })}
            name="4"
            className="grid-item"
            id="four"
          >
            4
          </button>
          <button
            onClick={() => dispatch({ type: "Add-Digit", payload: 5 })}
            name="5"
            className="grid-item"
            id="five"
          >
            5
          </button>
          <button
            onClick={() => dispatch({ type: "Add-Digit", payload: 6 })}
            name="6"
            className="grid-item"
            id="six"
          >
            6
          </button>
          <button
            onClick={() => dispatch({ type: "Operation-Digit", payload: "-" })}
            name="-"
            className="grid-item"
            id="minus"
          >
            -
          </button>
          <button
            onClick={() => dispatch({ type: "Add-Digit", payload: 1 })}
            name="1"
            className="grid-item"
            id="one"
          >
            1
          </button>
          <button
            onClick={() => dispatch({ type: "Add-Digit", payload: 2 })}
            name="2"
            className="grid-item"
            id="two"
          >
            2
          </button>
          <button
            onClick={() => dispatch({ type: "Add-Digit", payload: 3 })}
            name="3"
            className="grid-item"
            id="three"
          >
            3
          </button>
          <button
            onClick={() => dispatch({ type: "Operation-Digit", payload: "+" })}
            name="+"
            className="grid-item"
            id="plus"
          >
            +
          </button>
          <button
            onClick={() => dispatch({ type: "Add-Digit", payload: 1 })}
            name=""
            className="grid-item"
            id="plusminus"
          >
            +/-
          </button>
          <button
            onClick={() => dispatch({ type: "Add-Digit", payload: 0 })}
            name="0"
            className="grid-item"
            id="0"
          >
            0
          </button>
          <button
            onClick={() => dispatch({ type: "Add-Digit", payload: "." })}
            name="."
            className="grid-item"
            id="dot"
          >
            .
          </button>
          <button
            onClick={() => dispatch({ type: "Evaluate", payload: "=" })}
            name="euqal"
            className="grid-item"
            id="equal"
          >
            =
          </button>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">History</DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            {historydata.map((e) => (
              <div className="">{e.values}</div>
            ))}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Remove</Button>
          <Button onClick={handleClose}>History</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
