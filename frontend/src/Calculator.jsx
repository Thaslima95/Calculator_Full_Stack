import * as React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import { BoxProps } from "@mui/material/Box";
import { useReducer, useState, useEffect, useRef } from "react";

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

const Item1 = styled(Paper)(({ theme }) => ({
  textAlign: "right",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "flex-end",
  borderRadius: 0,
  color: theme.palette.text.secondary,
  height: 50,
  lineHeight: "60px",
}));

const darkTheme = createTheme({ palette: { mode: "dark" } });

function Item(props: BoxProps) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#101010" : "#fff",
        color: (theme) =>
          theme.palette.mode === "dark" ? "grey.300" : "grey.800",
        borderBottom: "2px solid red",
        borderColor: "red",
        p: 1,
        borderRadius: 1,
        textAlign: "center",
        fontSize: "0.875rem",
        fontWeight: "700",
        ...sx,
      }}
      {...other}
    />
  );
}

export default function Calculator() {
  const [{ firstValue = "0", previousvalue, operation, history }, dispatch] =
    useReducer(reducer, {});
  const [historydata, setHistory] = useState([]);
  const [calcdata, setCalcdata] = useState([]);
  useEffect(() => {
    history && setHistory(history);
  }, []);

  // useEffect(() => {
  //   console.log(localStorage.getItem("history"));
  //   setHistory(JSON.parse(localStorage.getItem("history")));
  // }, []);
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

  // useEffect(() => {
  //   console.log("useEffect");
  //   const fetchHistory = async () => {
  //     const res = await axios.get(`/get`);
  //     console.log(res);
  //     console.log(res.data);
  //     setCalcdata(res.data);
  //   };
  //   fetchHistory();
  // }, []);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box
            sx={{
              width: "57%",
              p: 2,
              bgcolor: "background.default",
              display: "grid",
              gridTemplateColumns: "1fr",
            }}
          >
            <ThemeProvider theme={darkTheme}>
              <Item1 key={3} elevation={3}>
                {previousvalue} {operation}
              </Item1>
              <Item1 key={3} elevation={3}>
                {firstValue}
              </Item1>
            </ThemeProvider>
          </Box>
        </Grid>
      </Grid>
      <div style={{ width: "30%" }}>
        <Box
          sx={{
            p: 2,
            display: "grid",
            gridAutoFlow: "row",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "repeat(1, 35px)",
            gap: 1,
          }}
        >
          <Item
            onClick={() => dispatch({ type: "Operation-Digit", payload: "%" })}
          >
            %
          </Item>
          <Item onClick={() => dispatch({ type: "Clear" })}>CE</Item>
          <Item>C</Item>
          <Item>x</Item>
        </Box>
        <Box
          sx={{
            display: "grid",
            p: 2,
            gridAutoFlow: "row",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "repeat(1, 35px)",
            gap: 1,
          }}
        >
          <Item>1/x</Item>
          <Item onClick={() => dispatch({ type: "Square", payload: "square" })}>
            x2
          </Item>
          <Item
            onClick={() =>
              dispatch({ type: "SquareRoot", payload: "squareRoot" })
            }
          >
            3
          </Item>
          <Item
            onClick={() => dispatch({ type: "Operation-Digit", payload: "/" })}
          >
            /
          </Item>
        </Box>
        <Box
          sx={{
            display: "grid",
            p: 2,
            gridAutoFlow: "row",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "repeat(1, 35px)",
            gap: 1,
          }}
        >
          <Item onClick={() => dispatch({ type: "Add-Digit", payload: 7 })}>
            7
          </Item>
          <Item onClick={() => dispatch({ type: "Add-Digit", payload: 8 })}>
            8
          </Item>
          <Item onClick={() => dispatch({ type: "Add-Digit", payload: 9 })}>
            9
          </Item>
          <Item
            onClick={() => dispatch({ type: "Operation-Digit", payload: "*" })}
          >
            X
          </Item>
        </Box>
        <Box
          sx={{
            display: "grid",
            p: 2,
            gridAutoFlow: "row",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "repeat(1, 35px)",
            gap: 1,
          }}
        >
          <Item onClick={() => dispatch({ type: "Add-Digit", payload: 4 })}>
            4
          </Item>
          <Item onClick={() => dispatch({ type: "Add-Digit", payload: 5 })}>
            5
          </Item>
          <Item onClick={() => dispatch({ type: "Add-Digit", payload: 6 })}>
            6
          </Item>
          <Item
            onClick={() => dispatch({ type: "Operation-Digit", payload: "-" })}
          >
            -
          </Item>
        </Box>
        <Box
          sx={{
            display: "grid",
            p: 2,
            gridAutoFlow: "row",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "repeat(1, 35px)",
            gap: 1,
          }}
        >
          <Item onClick={() => dispatch({ type: "Add-Digit", payload: 1 })}>
            1
          </Item>
          <Item onClick={() => dispatch({ type: "Add-Digit", payload: 2 })}>
            2
          </Item>
          <Item onClick={() => dispatch({ type: "Add-Digit", payload: 3 })}>
            3
          </Item>
          <Item
            onClick={() => dispatch({ type: "Operation-Digit", payload: "+" })}
          >
            +
          </Item>
        </Box>
        <Box
          sx={{
            display: "grid",
            p: 2,
            gridAutoFlow: "row",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "repeat(1, 35px)",
            gap: 1,
          }}
        >
          <Item>+/-</Item>
          <Item onClick={() => dispatch({ type: "Add-Digit", payload: 0 })}>
            0
          </Item>
          <Item onClick={() => dispatch({ type: "Add-Digit", payload: "." })}>
            .
          </Item>
          <Item onClick={() => dispatch({ type: "Evaluate", payload: "=" })}>
            =
          </Item>
        </Box>
      </div>
    </>
  );
}
