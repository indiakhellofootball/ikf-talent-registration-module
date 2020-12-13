import React from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import HomeComponent from "./components/homeComponent";
import RegistrationFormComponent from "./components/registrationComponent";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="App">
        <Switch>
          <Route path="/register" component={RegistrationFormComponent} />
          <Route path="/status" component={RegistrationFormComponent} />
          <Route path="/" component={HomeComponent} />
        </Switch>
      </div>
    );
  }
}

export default App;
