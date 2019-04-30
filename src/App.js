import React, { Component } from "react";
import { render } from "react-dom";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route,Redirect,} from "react-router-dom";
import Smartcar from '@smartcar/auth'
// import { Plugins } from "@capacitor/core";
// const { Geolocation } = Plugins;
import ReactTable from "react-table";
import "react-table/react-table.css";
import { makeData, Logo, Tips } from "./Utils";
const smartcar = new Smartcar({
    clientId: '8ba9f9bf-e8aa-48a7-9142-7a3077de0fea',
    redirectUri: 'http://localhost:8000',
    scope: ['read_vehicle_info', 'read_odometer'],
    onComplete: function(err, code) {
        if (err) {
            // handle errors from the authorization flow (i.e. user denies access)
        }
        // handle the returned code by sending it to your back-end server
        sendToBackend(code);
    },
});
var moment = require("moment");

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(event) {
    //https://uttpic.tech/checkcar/vin=value1&password=value2
    event.preventDefault();
    const vin = event.target.elements[0].value;
    const password = event.target.elements[1].value;

    // fetch(`https://uttpic.tech/checkcar/${vin}/${password}`, res => {
    //   if (res.OK){

    //   }
    // })
    this.props.history.push("/dashboard");
  }
  render() {
    return (
      <div>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <form onSubmit={this.handleSubmit}>
            <label>
              Enter your VIN:
              <input type="text" id="username" placeholder="VIN" />
            </label>

            <br />
            <label>
              Enter you passcode:
              <input
                type="password"
                id="password"
                placeholder="Choose Password"
              />
              <br />
            </label>
            <button>Login</button>
          </form>
        </header>
      </div>
    );
  }
}

class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      data: makeData()
    };
  }
  render() {
    const { data } = this.state;
    const cmake = "Toy";
    const cmodel = "X Type";
    const cyear = "2019";
    const cmileage = "654";

    return (
      <div>
        <br />
        <h2>Car Information:</h2>
        <p>
          Make: {cmake} | Model: {cmodel} | Year: {cyear} <br />
          vin:1GHBA3216511 | Mileage: {cmileage}
        </p>
        <br />

        <ReactTable
          data={data}
          columns={[
            {
              id: "updatedAt",
              Header: "Date (MM-DD-YYYY)",
              render: props => (
                <span>{moment.utc(props.value).format("MM-DD-YYYY")}</span>
              )
              // accessor: d => {
              //   return Moment(d.updated_at)
              //     .local()
              //     .format("MM-DD-YYYY hh:mm:ss a");
              // }
            },
            // {
            //   Header: "Name",
            //   columns: [
            //     {
            //       Header: "First Name",
            //       accessor: "firstName"
            //     },
            //     {
            //       Header: "Last Name",
            //       id: "lastName",
            //       accessor: d => d.lastName
            //     },
            {
              Header: "Speed (Mph)",
              accessor: "speed"
              // Cell: row => (
              //   <span
              //     style={{
              //       color:
              //         row.value > 75
              //           ? "#ff2e00"
              //           : row.value > 65
              //           ? "#ffbf00"
              //           : "#57d500",
              //       transition: "all .3s ease"
              //     }}
              //   >
              //     &#x25cf;
              //   </span>
              // )
            },

            {
              Header: "Info",
              columns: [
                {
                  Header: "Profile Progress",
                  accessor: "speed",
                  Cell: row => (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#dadada",
                        borderRadius: "2px"
                      }}
                    >
                      <div
                        style={{
                          width: `${row.value}%`,
                          height: "100%",
                          backgroundColor:
                            row.value < 65
                              ? "#85cc00"
                              : row.value < 80
                              ? "#ffbf00"
                              : "#ff2e00",
                          borderRadius: "2px",
                          transition: "all .2s ease-out"
                        }}
                      />
                    </div>
                  )
                },
                {
                  Header: "Status",
                  accessor: "status",
                  Cell: row => (
                    <span>
                      <span
                        style={{
                          color:
                            row.value === "dangerous"
                              ? "#ff2e00"
                              : row.value === "warning"
                              ? "#ffbf00"
                              : "#57d500",
                          transition: "all .3s ease"
                        }}
                      >
                        &#x25cf;
                      </span>{" "}
                      {row.value === "dangerous"
                        ? "You got a ticket"
                        : row.value === "warning"
                        ? `First Warning`
                        : "Your cool"}
                    </span>
                  )
                }
              ]
            }
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
        <br />
        <Logo />
      </div>
    );
  }
}
//setInterval(render(<Dashboard />, document.getElementById("root")), 1000);

render(<App />, document.getElementById("root"));

function App(props) {
  return (
    <BrowserRouter>
      <div>
          <Route exact path="/" render={() => (
              <Redirect to="/login" />
          )}/>
        <Route path="/login" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
      </div>
    </BrowserRouter>
  );
}

export default App;
