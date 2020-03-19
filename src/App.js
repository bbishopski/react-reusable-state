import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { ReusableProvider } from "reusable";
import { useState } from "react";
import { createStore } from "reusable";

// Store 2
const useCurrentUser = createStore(() => {
  return useState("Bill");
});

// Store 1 (createStore wraps a custom hook)
const useCounter = createStore(() => {
  const [counter, setCounter] = useState(0);

  // Expose/use another store inside this store
  const currentUser = useCurrentUser();

  return {
    currentUser, // expose store 2 here
    counter,
    increment: () => setCounter(prev => prev + 1),
    decrement: () => setCounter(prev => prev - 1)
  };
});

let headerRender = 0;
const Header = () => {
  const counter = useCounter();
  headerRender++;

  return (
    <>
      <div>Rendered {headerRender} times</div>
      <div>Header: Hello {counter.currentUser}</div>
      <div>{counter.counter}</div>
      <button onClick={counter.decrement}>decrement</button>
      <button onClick={counter.increment}>increment</button>
    </>
  );
};

let footerRender = 0;
const Footer = () => {
  const counter = useCounter();

  footerRender++;

  return (
    <>
      <hr></hr>
      <div>Rendered {footerRender} times</div>
      <div>Footer: Hello {counter.currentUser}</div>
      <div>{counter.counter}</div>
      <button onClick={counter.decrement}>decrement</button>
      <button onClick={counter.increment}>increment</button>
    </>
  );
};

// SELECTORS: selective re-rendering
let bodyRender = 0;
const Body = () => {
  // Selector...only re-render if counter is > 0
  const isPositive = useCounter(state => state.counter > 0);

  // NOTE: This does NOT work!  already using the useCounter store, cannot use a second store?  why?
  const { currentUser, setCurrentUser } = useCurrentUser();
  return (
    <>
      <hr />
      <div>BODY - Hello {currentUser}</div>
      <div>Rendered {++bodyRender} times</div>
      {isPositive ? <div>Is Positive!!</div> : <div></div>}
    </>
  );
};

App.propTypes = {};

function App() {
  return (
    <ReusableProvider>
      <Header />
      <Body />
      <Footer />
    </ReusableProvider>
  );
}

export default App;
