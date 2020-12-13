import React, { Component } from "react";
import MainLogo from "../assets/MainLogo.png";
const Config = require("../config/ClientConfig").DEVELOPMENT;

class HomeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aadhaarNumber: "",
      aadhaarError: "",
    };
  }
  checkStatus = () => {
    window.location =
      Config.API_ENDPOINT +
      "/public/query/talent-registration-status-aadhaar/" +
      this.state.aadhaarNumber;
  };
  navigateToForm = () => {
    return this.props.history.push("/register");
  };
  statusAadhaarAllowedChars = (e) => {
    let value = e.target.value;
    let { aadhaarError, aadhaarNumber } = this.state;
    let regex = /[^0-9]/;
    if (regex.exec(value)) {
      aadhaarError = "Use Only Numbers 0-9 !";
      return this.setState({
        aadhaarError: aadhaarError,
        aadhaarNumber: aadhaarNumber,
      });
    }
    if (value.length < 13) {
      aadhaarError = "";
      aadhaarNumber = value;
      return this.setState({
        aadhaarError: aadhaarError,
        aadhaarNumber: aadhaarNumber,
      });
    }
  };
  render() {
    return (
      <React.Fragment>
        <div class="container-fluid home">
          <div className="row align-items-center">
            <div className="col-12">
              <div id="registration-page-logo-container">
                <img
                  src={MainLogo}
                  alt=""
                  class="img-responsive mx-auto"
                  width="300"
                />
              </div>
            </div>
            <div className="col-12">
              <div className="text-center pt-2 mt-2">
                <button
                  onClick={this.navigateToForm}
                  className="btn btn-light md w-75 p-3 text-info font-weight-bold button"
                >
                  <span>REGISTER NOW</span>
                </button>
              </div>
            </div>
            <div className="col-12 mt-5">
              <div className="text-center pt-2 mt-2">
                <button
                  className="btn btn-light md w-75 p-3 text-info font-weight-bold button"
                  data-toggle="modal"
                  data-target="#statusModal"
                >
                  <span>Check Registration Status</span>
                </button>
              </div>
            </div>
          </div>
          <div className="modal fade" tabIndex="-1" id="statusModal">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-info">Check Registration</h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body pb-0 mb-0">
                  <form>
                    <div className="form-row ">
                      <div className="form-group col-12">
                        <label
                          htmlFor="aadharNumber"
                          className="text-primary font-weight-bold"
                        >
                          Aadhaar Card No.*
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={this.state.aadhaarNumber}
                          id="aadharNumber"
                          placeholder="Aadhaar Card Number Of Player"
                          onChange={this.statusAadhaarAllowedChars}
                          required
                        />
                      </div>
                      <div className="form-group col-12 text-danger">
                        {this.state.aadhaarError}
                      </div>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-warning"
                    data-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-info"
                    onClick={this.checkStatus}
                    disabled={
                      this.state.aadhaarNumber.length &&
                      this.state.aadhaarNumber.length === 12
                        ? false
                        : true
                    }
                  >
                    Check
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default HomeComponent;
