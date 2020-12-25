import React, { Component } from "react";
import MainLogo from "../assets/MainLogo.png";
import ApplicationBlocker from "./ApplicationBlocker";
import moment from "moment";
import { postRequest } from "../services/HttpService";

class RegistrationComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activePage: 1,
            states: [],
            cities: [],
            genders: [],
            showLoading: false,
            loadingTitle: "Loading State",
            showCloseButton: true,
            formOpacity: 1,
            addStateModalOpacity: 1,
            loadingDescription: "",
            showLoadingSpinner: false,
            extraInfo: "",
            termsAndConditionAccepted: false,
            registrationForm: {
                playerName: "",
                gender: {
                    _id: "",
                    name: ""
                },
                dateOfBirth: "",
                state: {
                    _id: "",
                    name: ""
                },
                city: {
                    _id: "",
                    name: "",
                },
                aadhaarCardNumber: "",
                formFilledBy: "Father",
                formFillerName: "",
                formFillerAadhaarCardNumber: "",
                mobileNumber: "",
            },
            registrationFormError: {
                playerName: "",
                gender: "",
                state: "",
                city: "",
                playerAadhaarCardNumber: "",
                formFillerName: "",
                mobileNumber: "",
                formFillerAadhaarCardNumber: "",
                termsAndConditions: "",
                dateOfBirth: ""
            },
            postRegistration: { url: "", mid: "", txnToken: "", orderId: "" },
            const: { FATHER: "Father", MOTHER: "Mother", GUARDIAN: "Guardian" },
        }
    }

    async componentDidMount() {
        this.setState({ showCloseButton: false, showLoadingSpinner: true, showLoading: true, loadingTitle: "Loading ...", formOpacity: 0.3, addStateModalOpacity: 0.3, loadingDescription: "Fetching States, Please Wait ...", extraInfo: "Do Not Refesh !" });
        try {
            let request = { payload: {}, options: { uri: "/fetch-all-states" } }
            let response = await postRequest("/public/query", request);
            response = response.data;
            if (response.code && response.code === 417) {
                this.setState({ loadingTitle: "Failed ...", showCloseButton: true, showLoadingSpinner: false, showLoading: true, loadingDescription: response.message || "Something Went Wrong,Please Try Again Later !", extraInfo: "Error !" });
            } else {
                let { data } = response;
                this.setState({ showCloseButton: false, showLoadingSpinner: false, showLoading: false, loadingDescription: "", extraInfo: "", formOpacity: 1, addStateModalOpacity: 1, states: data.states || [] });
            }
            request = { payload: {}, options: { uri: "/fetch-all-genders" } }
            response = await postRequest("/public/query", request);
            response = response.data;
            if (response.code && response.code === 417) {
                return this.setState({ loadingTitle: "Failed ...", showCloseButton: true, showLoadingSpinner: false, showLoading: true, loadingDescription: response.message || "Something Went Wrong,Please Try Again Later !", extraInfo: "Error !" });
            } else {
                let { data } = response;
                return this.setState({ showCloseButton: false, showLoadingSpinner: false, showLoading: false, loadingDescription: "", extraInfo: "", formOpacity: 1, addStateModalOpacity: 1, addCityModalOpacity: 1, genders: data.genders || [] });
            }
        } catch (error) {
            return this.setState({ showCloseButton: true, showLoadingSpinner: false, showLoading: true, loadingDescription: error.message || "Something Went Wrong,Please Try Again Later !", extraInfo: "Error !", loadingTitle: "Failed ..." });
        }
    }


    unsetFinexxBusyState = () => {
        this.setState({ showLoading: false, formOpacity: 1, addStateModalOpacity: 1, addCityModalOpacity: 1 });
    }
    nextPage = () => {
        let { activePage } = this.state;
        if (activePage < 3) {
            return this.setState({ activePage: activePage + 1 });
        }
    }
    previousPage = () => {
        let { activePage } = this.state;
        if (activePage > 1) {
            return this.setState({ activePage: activePage - 1 });
        }
    }
    handleSubmit = (e) => {
        return e.preventDefault();
    }

    allowCharactersForPlayerName = (e) => {
        let value = e.target.value;
        let regex = /[^A-za-z ]/;
        let { registrationForm, registrationFormError } = this.state;
        if (regex.exec(value)) {
            registrationFormError.playerName = "Use Only 'A-Z' And 'a-z' With Spaces !"
            return this.setState({ registrationFormError: registrationFormError });
        }
        registrationFormError.playerName = "";
        registrationForm.playerName = value;
        return this.setState({ registrationFormError: registrationFormError, registrationForm: registrationForm });
    }

    trimPlayerName = (e) => {
        let value = e.target.value.trim();
        let { registrationForm, registrationFormError } = this.state;
        if (value.length) {
            let array = value.split(" ");
            let string = "";
            for (let word of array) {
                if (word[0]) {
                    string += word[0].toUpperCase();
                    string += word.substr(1);
                    string += " ";
                }
            }
            string = string.trim();
            registrationFormError.playerName = "";
            registrationForm.playerName = string;
            return this.setState({ registrationFormError: registrationFormError, registrationForm: registrationForm });
        }
        registrationFormError.playerName = "Player Name Must Not Be Empty";
        registrationForm.playerName = value;
        return this.setState({ registrationFormError: registrationFormError, registrationForm: registrationForm });
    }

    checkGender = () => {
        let { registrationForm, registrationFormError } = this.state;
        if (!registrationForm.gender.name.length) {
            registrationFormError.dateOfBirth = "Select Gender First !";
            return this.setState({ registrationFormError: registrationFormError });
        }

    }

    setDateOfBirth = (e) => {
        let { registrationForm, registrationFormError } = this.state;
        if (registrationForm.gender.name.length) {
            let date = new Date(e.target.value);
            if (date === "Invalid Date") {
                registrationFormError.dateOfBirth = "Select Date From Browser Calender !";
                return this.setState({ registrationFormError: registrationFormError });
            }
            let age = moment(new Date()).diff(date, 'years');
            if (age >= 11 && age <= 16) {
                registrationFormError.dateOfBirth = "";
                registrationForm.dateOfBirth = e.target.value;
                return this.setState({ registrationForm: registrationForm, registrationFormError: registrationFormError });
            }
            registrationForm.dateOfBirth = "";
            registrationFormError.dateOfBirth = "Age Should Be Of 11 - 16 Years Old To Register !";
            return this.setState({ registrationFormError: registrationFormError });
        }
        registrationFormError.dateOfBirth = "Select Gender First !";
        return this.setState({ registrationFormError: registrationFormError });
    }

    setGender = (e) => {
        let value = e.target.value;
        let { genders, registrationFormError, registrationForm } = this.state;
        if (value.length && value !== "null") {
            for (let gender of genders) {
                if (gender["_id"] === value) {
                    registrationForm.gender = gender;
                    registrationFormError.gender = "";
                    registrationFormError.dateOfBirth = "";
                    return this.setState({ registrationFormError: registrationFormError, registrationForm: registrationForm });
                }
            }
        }
        registrationFormError.gender = "Select Valid Gender !";
        return this.setState({ registrationFormError: registrationFormError, registrationForm: registrationForm });
    }

    validateGender = (e) => {
        let { registrationForm, registrationFormError } = this.state;
        if (!registrationForm.gender._id || !registrationForm.gender._id.length || !registrationForm.gender.name || !registrationForm.gender.name.length) {
            registrationFormError.gender = "Select Valid Gender !";
            return this.setState({ registrationFormError: registrationFormError });
        }
    }

    setRegistrationState = async (e) => {
        let value = e.target.value;
        e.preventDefault();
        let { states, registrationFormError, registrationForm } = this.state;
        if (value.length && value !== "null") {
            for (let state of states) {
                if (state["_id"] === value) {
                    registrationForm.state = state;
                    registrationFormError.state = "";
                    registrationForm.city = { _id: "", name: "" };
                    if (document.getElementById('city').selectedIndex > 0)
                        registrationFormError.city = "Select City Again !";
                    this.setState({ showLoading: true, showLoadingSpinner: true, loadingDescription: `Fetching Cities For State ${state.name},Please Wait !`, loadingTitle: "Loading ...", extraInfo: "Do Not Refresh !", showCloseButton: false, formOpacity: 0.3 });
                    let request = { payload: { _id: value }, options: { uri: "/find-cities-by-state-id" } };
                    try {
                        let response = await postRequest("/public/query", request);
                        response = response.data;
                        if (response && response.code === 417)
                            throw new Error(response.message)
                        let { cities } = response.data;
                        return this.setState({ registrationFormError: registrationFormError, registrationForm: registrationForm, cities: cities, showLoading: false, showLoadingSpinner: false, formOpacity: 1 });
                    } catch (error) {
                        return this.setState({ showLoading: true, showLoadingSpinner: false, loadingDescription: error.message || "Unexpected Error !", loadingTitle: "Failed ...", extraInfo: "", showCloseButton: true });
                    }
                }
            }
        }
        registrationFormError.state = "Select Valid State !";
        return this.setState({ registrationFormError: registrationFormError, registrationForm: registrationForm });
    }

    validateRegistrationState = (e) => {
        let { registrationForm, registrationFormError } = this.state;
        if (!registrationForm.state._id || !registrationForm.state._id.length || !registrationForm.state.name || !registrationForm.state.name.length) {
            registrationFormError.state = "Select Valid State !";
            return this.setState({ registrationFormError: registrationFormError });
        }
    }

    setRegistrationCity = async (e) => {
        let value = e.target.value;
        e.preventDefault();
        let { cities, registrationFormError, registrationForm } = this.state;
        if (value.length && value !== "null") {
            for (let city of cities) {
                if (city["_id"] === value) {
                    registrationForm.city = city;
                    registrationFormError.city = "";
                    return this.setState({ registrationForm: registrationForm, registrationFormError: registrationFormError });
                }
            }
        }
        registrationFormError.city = "Select Valid City !";
        return this.setState({ registrationFormError: registrationFormError, registrationForm: registrationForm });
    }

    validateRegistrationCity = (e) => {
        let { registrationForm, registrationFormError } = this.state;
        if (!registrationForm.city._id || !registrationForm.city._id.length || !registrationForm.city.name || !registrationForm.city.name.length) {
            registrationFormError.city = "Select Valid City !";
            return this.setState({ registrationFormError: registrationFormError });
        }
    }

    allowPlayerAadhaarNumberChars = (e) => {
        let value = e.target.value;
        let { registrationForm, registrationFormError } = this.state;
        let regex = /[^0-9]/;
        if (regex.exec(value)) {
            registrationFormError.playerAadhaarCardNumber = "Use Only Numbers 0-9 !";
            return this.setState({ registrationFormError: registrationFormError });
        }
        if (value.length < 13) {
            registrationFormError.playerAadhaarCardNumber = "";
            registrationForm.aadhaarCardNumber = value;
            return this.setState({ registrationFormError: registrationFormError, registrationForm: registrationForm });
        }
    }

    validatePlayerAadhaarNumber = (e) => {
        let value = e.target.value;
        let { registrationFormError } = this.state;
        if (!value.length) {
            registrationFormError.playerAadhaarCardNumber = "Aadhaar Card Number Must Not Be Empty !";
            return this.setState({ registrationFormError: registrationFormError });
        }
        if (value.length < 12) {
            registrationFormError.playerAadhaarCardNumber = "Aadhaar Card Number Must Be Of 12 Digits !";
            return this.setState({ registrationFormError: registrationFormError });
        }
    }

    setFather = () => {
        let { registrationForm } = this.state;
        registrationForm.formFilledBy = this.state.const.FATHER;
        return this.setState({ registrationForm: registrationForm });
    }

    setMother = () => {
        let { registrationForm } = this.state;
        registrationForm.formFilledBy = this.state.const.MOTHER;
        return this.setState({ registrationForm: registrationForm });
    }

    setGuardian = () => {
        let { registrationForm } = this.state;
        registrationForm.formFilledBy = this.state.const.GUARDIAN;
        return this.setState({ registrationForm: registrationForm });
    }

    allowParentNameChars = (e) => {
        let value = e.target.value;
        let regex = /[^A-za-z ]/;
        let { registrationForm, registrationFormError } = this.state;
        if (regex.exec(value)) {
            registrationFormError.formFillerName = "Use Only 'A-Z' And 'a-z' With Spaces !"
            return this.setState({ registrationFormError: registrationFormError });
        }
        registrationFormError.formFillerName = "";
        registrationForm.formFillerName = value;
        return this.setState({ registrationFormError: registrationFormError, registrationForm: registrationForm });
    }

    trimParentName = (e) => {
        let value = e.target.value.trim();
        let { registrationForm, registrationFormError } = this.state;
        if (value.length) {
            let array = value.split(" ");
            let string = "";
            for (let word of array) {
                if (word[0]) {
                    string += word[0].toUpperCase();
                    string += word.substr(1);
                    string += " ";
                }
            }
            string = string.trim();
            registrationFormError.formFillerName = "";
            registrationForm.formFillerName = string;
            return this.setState({ registrationFormError: registrationFormError, registrationForm: registrationForm });
        }
        registrationFormError.formFillerName = "Parent Name Must Not Be Empty !";
        registrationForm.formFillerName = value;
        return this.setState({ registrationFormError: registrationFormError, registrationForm: registrationForm });
    }

    allowMobileNumber = (e) => {
        let value = e.target.value;
        let { registrationForm, registrationFormError } = this.state;
        let regex = /[^0-9]/;
        if (regex.exec(value)) {
            registrationFormError.mobileNumber = "Use Only Numbers 0-9 !";
            return this.setState({ registrationFormError: registrationFormError });
        }
        if (value.length < 11) {
            registrationForm.mobileNumber = value;
        }
        registrationFormError.mobileNumber = "";
        return this.setState({ registrationFormError: registrationFormError, registrationForm: registrationForm });

    }

    validateMobileNumber = (e) => {
        let value = e.target.value;
        let { registrationFormError } = this.state;
        if (!value.length) {
            registrationFormError.mobileNumber = "Mobile Number Must Not Be Empty !";
            return this.setState({ registrationFormError: registrationFormError });
        }
        if (value.length < 10) {
            registrationFormError.mobileNumber = "Mobile Number Must Be Of 10 Digits !";
            return this.setState({ registrationFormError: registrationFormError });
        }
    }

    allowParentAadhaarNumberChars = (e) => {
        let value = e.target.value;
        let { registrationForm, registrationFormError } = this.state;
        let regex = /[^0-9]/;
        if (regex.exec(value)) {
            registrationFormError.formFillerAadhaarCardNumber = "Use Only Numbers 0-9 !";
            return this.setState({ registrationFormError: registrationFormError });
        }
        if (value.length < 13) {
            registrationForm.formFillerAadhaarCardNumber = value;
        }
        registrationFormError.formFillerAadhaarCardNumber = "";
        return this.setState({ registrationFormError: registrationFormError, registrationForm: registrationForm });

    }

    validateParentAadhaarNumber = (e) => {
        let value = e.target.value;
        let { registrationFormError } = this.state;
        if (!value.length) {
            registrationFormError.formFillerAadhaarCardNumber = "Aadhaar Card Number Must Not Be Empty !";
            return this.setState({ registrationFormError: registrationFormError });
        }
        if (value.length < 12) {
            registrationFormError.formFillerAadhaarCardNumber = "Aadhaar Card Number Must Be Of 12 Digits !";
            return this.setState({ registrationFormError: registrationFormError });
        }
        registrationFormError.formFillerAadhaarCardNumber = "";
        return this.setState({ registrationFormError: registrationFormError });
    }

    handleAcceptance = (e) => {
        let { registrationFormError } = this.state;
        if (e.target.checked) {
            registrationFormError.termsAndConditions = "";
            return this.setState({ registrationFormError: registrationFormError, termsAndConditionAccepted: true });
        }
        registrationFormError.termsAndConditions = "Accept Terms And Conditions To Submit Form !";
        return this.setState({ registrationFormError: registrationFormError, termsAndConditionAccepted: false });
    }

    validateForm = () => {
        let { termsAndConditionAccepted, registrationForm, registrationFormError } = this.state;
        // TODO - Date Of Birth Check
        if (!termsAndConditionAccepted || !registrationForm.playerName.length || !registrationForm.playerName.length || !registrationForm.gender || !registrationForm.gender.name.length || !registrationForm.gender._id.length || !registrationForm.state || !registrationForm.state._id.length || !registrationForm.state.name.length || !registrationForm.city || !registrationForm.city._id.length || !registrationForm.city.name.length || !registrationForm.aadhaarCardNumber.length || !registrationForm.formFilledBy.length || !registrationForm.formFillerName.length || !registrationForm.mobileNumber.length || !registrationForm.formFillerAadhaarCardNumber.length || !registrationForm.dateOfBirth || !registrationForm.dateOfBirth.length)
            return true;
        if (registrationFormError.mobileNumber.length || registrationFormError.playerAadhaarCardNumber.length || registrationFormError.playerName.length || registrationFormError.state.length || registrationFormError.city.length || registrationFormError.formFillerName.length || registrationFormError.formFillerAadhaarCardNumber.length || registrationFormError.gender.length || registrationFormError.dateOfBirth.length)
            return true;
        return false;

    }

    register = async (e) => {
        this.setState({ showCloseButton: false, showLoadingSpinner: true, showLoading: true, loadingTitle: "Validating ...", loadingDescription: "Your Inputs Are Being Validated,Please Wait !", extraInfo: "Don't Refresh !", formOpacity: 0.3 });
        if (!this.validateForm)
            return this.setState({ showCloseButton: true, showLoadingSpinner: false, showLoading: true, loadingTitle: "Failed ...", loadingDescription: "Fill Form Properly,All Inputs Must Be Filled And No Warning Messages Should Active Below Inputs !", extraInfo: "Validation Error !", formOpacity: 0.3 });
        this.setState({ showCloseButton: false, showLoadingSpinner: true, showLoading: true, loadingTitle: "Registering ...", loadingDescription: "Your Registeration Process Is In Progress,Please Wait !", extraInfo: "Don't Refresh !", formOpacity: 0.3 });
        try {
            let request = { payload: this.state.registrationForm, options: { uri: "/insert-talent-id-registration" } };
            let response = await postRequest("/public/insert", request);
            response = response.data;
            if (response.code === 417) {
                return this.setState({ showCloseButton: true, showLoadingSpinner: false, showLoading: true, loadingTitle: "Failed ...", loadingDescription: response.message, extraInfo: "Server Error !", formOpacity: 0.3 });
            } else {
                let { data } = response;
                if (data.code && data.code === 301) {
                    let { postRegistration } = this.state;
                    postRegistration.url = data.url;
                    postRegistration.mid = data.mid;
                    postRegistration.orderId = data.orderId;
                    postRegistration.txnToken = data.txnToken;
                    this.setState({ postRegistration: postRegistration });
                    document.PaymentForm.submit();
                }
            }
        } catch (error) {
            return this.setState({ showCloseButton: true, showLoadingSpinner: false, showLoading: true, loadingTitle: "Error ...", loadingDescription: error.message, extraInfo: "Unexpected Error !" });
        }
    }

    render() {
        // if (document.getElementById('gender'))
        return (
            <React.Fragment>
                <div className="form-content" style={{ opacity: this.state.formOpacity }}>
                    <div className="container-fluid registration-container">
                        {/* static div remains same for three pages*/}
                        <div className="row">
                            <div className="col-6 text-left">
                                <div id="registration-page-logo-container" style={{ textAlign: "left" }}>
                                    <img
                                        src={MainLogo}
                                        alt=""
                                        width="150px"
                                    />
                                </div>
                            </div>
                            <div className="col-6">
                                <button className="btn btn-primary px-4 py-0 float-right mr-4 mt-3" disabled={this.state.activePage === 1} onClick={this.previousPage}>
                                    <span className="font-weight-bold arrow">
                                        <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                        {/*div of radio buttons to indicate active page */}
                        <div className="row w-100 ml-auto mr-auto p-2 mr-auto ml-auto mt-5">
                            <div className="col-4 text-center">
                                <div className="form-check">
                                    <input className="form-check-input position-static" type="radio" name="pageIndicator" id="page1" value="page1" checked={this.state.activePage === 1} readOnly />
                                </div>
                            </div>
                            <div className="col-4 text-center">
                                <div className="form-check">
                                    <input className="form-check-input position-static" type="radio" name="pageIndicator" id="page1" value="page1" checked={this.state.activePage === 2} readOnly />
                                </div>
                            </div>
                            <div className="col-4 text-center">
                                <div className="form-check">
                                    <input className="form-check-input position-static" type="radio" name="pageIndicator" id="page1" value="page1" checked={this.state.activePage === 3} readOnly />
                                </div>
                            </div>
                        </div>
                        {/* div to be rendered dynamicly */}
                    </div>
                    <div className="container-fluid bg-light pb-3 rounded mt-3 form-div">
                        <h5 className="text-center text-info pt-1">All Fields Are Mandatory To Submit Registration.</h5>
                        {this.state.activePage === 1 ? <div style={{ display: "block" }}>
                            <form className="w-100 ml-auto mr-auto" onSubmit={this.handleSubmit}>
                                <div className="form-row ">
                                    <div className="form-group col-12 mt-5">
                                        <label htmlFor="playerName" className="text-primary font-weight-bold">Player Name *</label>
                                        <input type="text" className="form-control form-control-sm" id="playerName" placeholder="Enter Name Of Player" onChange={this.allowCharactersForPlayerName} onBlur={this.trimPlayerName} value={this.state.registrationForm.playerName} autoComplete="off" />
                                        <small className='text-danger font-weight-bold'>{this.state.registrationFormError.playerName}</small>
                                    </div>
                                </div>
                                <div className="form-row ">
                                    <div className="form-group col-6 mt-2">
                                        <label htmlFor="gender" className="text-primary font-weight-bold">Gender *</label>
                                        <select className="form-control form-control-sm" id="gender" onChange={this.setGender} onBlur={this.validateGender} autoComplete="off">
                                            <option value="">--Select Gender--</option>
                                            {this.state.genders.map((gender) => {
                                                return <option key={gender._id} value={gender._id}>{gender.name}</option>
                                            })}
                                        </select>
                                        <small className='text-danger font-weight-bold'>{this.state.registrationFormError.gender}</small>
                                    </div>
                                    <div className="form-group col-6 mt-2">
                                        <label htmlFor="dateOfBirth" className="text-primary font-weight-bold">Date Of Birth *</label>
                                        <input type="date" className="form-control form-control-sm" id="dateOfBirth" placeholder="" value={this.state.registrationForm.dateOfBirth} onChange={this.setDateOfBirth} autoComplete="off" onFocus={this.checkGender} />
                                        <div>
                                            <small className='text-danger font-weight-bold'>{this.state.registrationFormError.dateOfBirth}</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-6 mt-2">
                                        <label htmlFor="state" className="text-primary font-weight-bold">State / Union Territory *</label>
                                        <select className="form-control form-control-sm" id="state" onChange={this.setRegistrationState} onBlur={this.validateRegistrationState} autoComplete="off">
                                            <option value="null" key="1">--Select State--</option>
                                            {this.state.states.map(state => {
                                                return <option value={state._id} key={state._id}>{state.name}</option>
                                            })}
                                        </select>
                                        <div>
                                            <small className='text-danger font-weight-bold'>{this.state.registrationFormError.state}</small>
                                        </div>
                                    </div>
                                    <div className="form-group col-6 mt-2">
                                        <label htmlFor="city" className="text-primary font-weight-bold">City *</label>
                                        <select className="form-control form-control-sm" id="city" onChange={this.setRegistrationCity} onBlur={this.validateRegistrationCity} autoComplete="off">
                                            <option>--Select City--</option>
                                            {this.state.cities.map(city => {
                                                return <option value={city._id} key={city._id}>{city.name}</option>
                                            })}
                                        </select>
                                        <div>
                                            <small className='text-danger font-weight-bold'>{this.state.registrationFormError.city}</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row ">
                                    <div className="form-group col-12 mt-2">
                                        <label htmlFor="aadhaarCardNumber" className="text-primary font-weight-bold">Aadhaar Card No. *</label>
                                        <input type="text" className="form-control form-control-sm" id="aadhaarCardNumber" placeholder="Enter Player's Aadhaar Number" autoComplete="off" onChange={this.allowPlayerAadhaarNumberChars} onBlur={this.validatePlayerAadhaarNumber} value={this.state.registrationForm.aadhaarCardNumber} />
                                        <div>
                                            <small className='text-danger font-weight-bold'>{this.state.registrationFormError.playerAadhaarCardNumber}</small>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div> : <div style={{ display: "none" }}>
                                <form className="w-100 ml-auto mr-auto" onSubmit={this.handleSubmit}>
                                    <div className="form-row ">
                                        <div className="form-group col-12 mt-5">
                                            <label htmlFor="playerName" className="text-primary font-weight-bold">Player Name *</label>
                                            <input type="text" className="form-control form-control-sm" id="playerName" placeholder="Enter Name Of Player" onChange={this.allowCharactersForPlayerName} onBlur={this.trimPlayerName} value={this.state.registrationForm.playerName} autoComplete="off" />
                                            <small className='text-danger font-weight-bold'>{this.state.registrationFormError.playerName}</small>
                                        </div>
                                    </div>
                                    <div className="form-row ">
                                        <div className="form-group col-6 mt-2">
                                            <label htmlFor="gender" className="text-primary font-weight-bold">Gender *</label>
                                            <select className="form-control form-control-sm" id="gender" onChange={this.setGender} onBlur={this.validateGender} autoComplete="off">
                                                <option value="">--Select Gender--</option>
                                                {this.state.genders.map((gender) => {
                                                    return <option key={gender._id} value={gender._id}>{gender.name}</option>
                                                })}
                                            </select>
                                            <small className='text-danger font-weight-bold'>{this.state.registrationFormError.gender}</small>
                                        </div>
                                        <div className="form-group col-6 mt-2">
                                            <label htmlFor="dateOfBirth" className="text-primary font-weight-bold">Date Of Birth *</label>
                                            <input type="date" className="form-control form-control-sm" id="dateOfBirth" placeholder="" value={this.state.registrationForm.dateOfBirth} onChange={this.setDateOfBirth} autoComplete="off" />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-6 mt-2">
                                            <label htmlFor="state" className="text-primary font-weight-bold">State *</label>
                                            <select className="form-control form-control-sm" id="state" onChange={this.setRegistrationState} onBlur={this.validateRegistrationState} autoComplete="off">
                                                <option value="null" key="1">--Select State--</option>
                                                {this.state.states.map(state => {
                                                    return <option value={state._id} key={state._id}>{state.name}</option>
                                                })}
                                            </select>
                                            <div>
                                                <small className='text-danger font-weight-bold'>{this.state.registrationFormError.state}</small>
                                            </div>
                                        </div>
                                        <div className="form-group col-6 mt-2">
                                            <label htmlFor="city" className="text-primary font-weight-bold">City *</label>
                                            <select className="form-control form-control-sm" id="city" onChange={this.setRegistrationCity} onBlur={this.validateRegistrationCity} autoComplete="off">
                                                <option>--Select City--</option>
                                                {this.state.cities.map(city => {
                                                    return <option value={city._id} key={city._id}>{city.name}</option>
                                                })}
                                            </select>
                                            <div>
                                                <small className='text-danger font-weight-bold'>{this.state.registrationFormError.city}</small>
                                            </div>
                                            {/* <button className="btn btn-info mt-2" data-toggle="modal" data-target="#addCityModal" >Add City To List</button> */}
                                        </div>
                                    </div>
                                    <div className="form-row ">
                                        <div className="form-group col-12 mt-2">
                                            <label htmlFor="aadhaarCardNumber" className="text-primary font-weight-bold">Aadhaar Card No. *</label>
                                            <input type="text" className="form-control form-control-sm" id="aadhaarCardNumber" placeholder="Enter Player's Aadhaar Number" autoComplete="off" onChange={this.allowPlayerAadhaarNumberChars} onBlur={this.validatePlayerAadhaarNumber} value={this.state.registrationForm.aadhaarCardNumber} />
                                            <div>
                                                <small className='text-danger font-weight-bold'>{this.state.registrationFormError.playerAadhaarCardNumber}</small>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>}
                        {this.state.activePage === 2 && <div>
                            <form className="w-100 ml-auto mr-auto">
                                <div className="form-row pl-4 ">
                                    <div className="form-group col-4 mt-5">
                                        <input className="form-check-input" type="radio" name="formFiller" id="father" value={this.state.const.FATHER} onChange={this.setFather} defaultChecked />
                                        <label htmlFor="father" className="text-primary font-weight-bold">Father</label>
                                    </div>
                                    <div className="form-group col-4 mt-5">
                                        <input className="form-check-input" type="radio" name="formFiller" id="mother" value={this.state.const.MOTHER} onChange={this.setMother} />
                                        <label htmlFor="mother" className="text-primary font-weight-bold">Mother</label>
                                    </div>
                                    <div className="form-group col-4 mt-5">
                                        <input className="form-check-input" type="radio" name="formFiller" id="guardian" value={this.state.const.GUARDIAN} onChange={this.setGuardian} />
                                        <label htmlFor="guardian" className="text-primary font-weight-bold">Guardian</label>
                                    </div>
                                </div>
                                <div className="form-row ">
                                    <div className="form-group col-12 mt-2">
                                        <label htmlFor="parentName" className="text-primary font-weight-bold">Parent Name*</label>
                                        <input type="text" className="form-control form-control-sm" id="parentName" placeholder="Name Of Parent" value={this.state.registrationForm.formFillerName} onChange={this.allowParentNameChars} onBlur={this.trimParentName} autoComplete="off" />
                                        <div>
                                            <small className='text-danger font-weight-bold'>{this.state.registrationFormError.formFillerName}</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row ">
                                    <div className="form-group col-12 mt-2">
                                        <label htmlFor="mobileNumber" className="text-primary font-weight-bold">Mobile No.*</label>
                                        <input type="text" className="form-control form-control-sm" id="mobileNumber" placeholder="Mobile No." value={this.state.registrationForm.mobileNumber} onChange={this.allowMobileNumber} onBlur={this.validateMobileNumber} autoComplete="off" />
                                        <div>
                                            <small className='text-danger font-weight-bold'>{this.state.registrationFormError.mobileNumber}</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row ">
                                    <div className="form-group col-12 mt-2">
                                        <label htmlFor="parentAadhaarCardNumber" className="text-primary font-weight-bold">Aadhaar Card No.*</label>
                                        <input type="text" className="form-control form-control-sm" id="parentAadhaarCardNumber" placeholder="Parent Aadhaar Card Number" onChange={this.allowParentAadhaarNumberChars} onBlur={this.validateParentAadhaarNumber} autoComplete="off" value={this.state.registrationForm.formFillerAadhaarCardNumber} />
                                        <div>
                                            <small className='text-danger font-weight-bold'>{this.state.registrationFormError.formFillerAadhaarCardNumber}</small>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>}
                        {this.state.activePage === 3 && <div>
                            <div className="mr-auto ml-auto w-100">
                                <label htmlFor="termsAndConditionCheckbox" className="mt-2 text-primary">Privacy/Terms &amp; condition/Refund and Cancellation policy</label>
                                <div className="terms-conditions mt-3 pl-2 pr-2 pt-2 text-primary" >
                                    <h6>1. PRIVACY OF CLIENT AND END USER DATA</h6>
                                    <p>The terms &quot;We&quot; / &quot;Us&quot; / &quot;Our&quot;/”Company” individually and collectively refer to IKF/EFS
and the terms &quot;You&quot; /&quot;Your&quot; / &quot;Yourself&quot; refer to the users.</p>
                                    <p>This Privacy Policy is an electronic record in the form of an electronic contract formed
                                    under the information Technology Act, 2000 and the rules made thereunder and the
                                    amended provisions pertaining to electronic documents / records in various statutes as
                                    amended by the information Technology Act, 2000. This Privacy Policy does not require
any physical, electronic or digital signature.</p>
                                    <p>
                                        This document is published and shall be construed in accordance with the provisions of
                                        the Information Technology (reasonable security practices and procedures and
                                        sensitive personal data of information) rules, 2011 under Information Technology Act,
                                        2000; that require publishing of the Privacy Policy for collection, use, storage and
                                        transfer of sensitive personal data or information.
                                    </p>
                                    <p>
                                        Please read this Privacy Policy carefully by using the Website, you indicate that you
                                        understand, agree and consent to this Privacy Policy. If you do not agree with the terms
                                        of this Privacy Policy, please do not use this Website.
                                    </p>
                                    <p>
                                        By providing us your Information or by making use of the facilities provided by the
                                        Website, You hereby consent to the collection, storage, processing and transfer of any
                                        or all of Your Personal Information and Non-Personal Information by us as specified
                                        under this Privacy Policy. You further agree that such collection, use, storage and
                                        transfer of Your Information shall not cause any loss or wrongful gain to you or any
                                        other person.
                                    </p>
                                    <p>India Khelo football cares about your privacy. For this reason, we collect and use
                                    personal data only as it might be needed for us to deliver to you our world-class
                                    products, services and websites (collectively, our “Services” and Services offered by our
Sponsors and Partners). Your personal data includes information such as:</p>
                                    <ul>
                                        <li>Name</li>
                                        <li>Date of birth</li>
                                        <li>Gender</li>
                                        <li>Aadhar card</li>
                                        <li>Parent Name</li>
                                        <li>Parent Aadhar card</li>
                                        <li>Other data collected that could directly or indirectly identify you.</li>
                                    </ul>
                                    <p>
                                        Our Privacy Policy is intended to describe to you how and what data we collect, and
                                        how and why we use your personal data. It also describes options we provide for you to
                                        access, update or otherwise take control of your personal data that we process.
                                        If at any time you have questions about our practices or any of your rights described
                                        below, you may reach our Data Protection Officer (“DPO”) and our dedicated team that
                                        supports this office by contacting us at indiakhelofootball@gmail.com. This inbox is
                                        actively monitored and managed so that we can deliver an experience that you can
                                        confidently trust.
                                </p>
                                    <h5>1.1 What information do we collect?</h5>
                                    <p>We collect information so that we can provide the best possible experience when you
                                    utilize our Services.  Much of what you likely consider personal data is collected directly
from you when you:</p>
                                    <ul>
                                        <li>Create an account</li>
                                        <li>Do the registration successfully</li>
                                        <li>Pay for the registration</li>
                                        <li>When you participate or play the tournament details like left foot, right foot, and
many other football factors would be updated.</li>
                                    </ul>
                                    <p>However, we also collect additional information when delivering our Services to you to
                                    ensure necessary and optimal performance.  These methods of collection may not be
                                    as obvious to you, so we wanted to highlight and explain below a bit more about what
these might be (as they vary from time to time) and how they work:</p>
                                    <p><span className="font-weight-bold">1.2 Account related information</span> are collected so that we have candidate information for
                                the tournaments or football matches. Parents details are collected so that we know
                                everything is done with parent or guardian permission, if anything else is required we
can contact the parent directly.</p>
                                    <p><span className="font-weight-bold">1.3 Data about Usage of Services</span> is automatically collected when you register and
interact with our Services, including metadata, log files, cookie/device IDs and location
information. This information includes specific data about your interactions with the
features, content and links (including those of third-parties, such as mobile verification,
Aadhar card verification , social media plugin and more) contained within the Services,
Internet Protocol (IP) address, browser type and settings, the date and time the
Services were used, information about browser configuration and plugins, language
preferences and cookie data, information about devices accessing the Services,
including type of device, what operating system is used, device settings, application IDs,
unique device identifiers and error data, and some of this data collected might be
capable of and be used to approximate your location.</p>
                                    <h5>1.4 How we utilize information</h5>
                                    <p>We strongly believe in both minimizing the data we collect and limiting its use and
                                    purpose to only that (1) for which we have been given permission, (2) as necessary to
                                    deliver the Services, or (3) as we might be required or permitted for legal compliance or
other lawful purposes. These uses include:</p>
                                    <h6>1.4.1 Delivering, improving, updating and enhancing the Services we and our partner’s
provide to you</h6>
                                    <p>We collect various information relating to your purchase, use and/or interactions with
our Services. We utilise this information to:</p>
                                    <ul>
                                        <li>Improve and optimize the operation and performance of our and our partner’s
                                        Services (again, including our websites and further may be followed by mobile
applications)</li>
                                        <li>Diagnose problems with and identify any security risks, errors, or needed
enhancements to the Services</li>
                                        <li>Detect and prevent fraud and abuse of our and our partner's Services and systems.</li>
                                        <li>Collecting aggregate statistics about use of the Services</li>
                                    </ul>
                                    <p>Often, much of the data collected is aggregated or statistical data about how individuals
                                    use our Services, and is not linked to any personal data, but to the extent it is itself
personal data, or is linked or linkable to personal data, we treat it accordingly.</p>
                                    <p><span className="font-weight-bold">1.4.2 Sharing with trusted third parties.</span> We may share your personal data with affiliated
companies within our corporate family, with third parties with which we have partnered
to allow you to integrate their services into our own Services, and with trusted third party
service providers as necessary for them to perform services on our behalf, such as:</p>
                                    <ul>
                                        <li>Processing credit card payments</li>
                                        <li>Serving advertisements</li>
                                        <li>Conducting contests or surveys</li>
                                        <li>Performing analysis of our Services and customers demographics</li>
                                        <li>Communicating with you, such as by way email or survey delivery</li>
                                        <li>Customer relationship management.</li>
                                    </ul>
                                    <h6>1.5 How we secure, store and retain your data</h6>
                                    <p>We follow generally accepted standards to store and protect the personal data we
                                    collect, both during transmission and once received and stored, including utilization of
encryption where appropriate.</p>
                                    <p>We retain personal data only for as long as necessary to provide the Services you have
                                    requested and thereafter for a variety of legitimate legal or business purposes. These
might include retention periods:</p>
                                    <ul>
                                        <li>mandated by law, contract or similar obligations applicable to our business operations;</li>
                                        <li>for preserving, resolving, defending or enforcing our legal/contractual rights; or</li>
                                        <li>needed to maintain adequate and accurate business and financial records.</li>
                                    </ul>
                                    <p>If you have any questions about the security or retention of your personal data, you can
                                    contact us at <u>indiakhelofootball@gmail.com.</u></p>
                                    <h6>1.6 Changes in our Privacy Policy.</h6>
                                    <p>We reserve the right to modify this Privacy Policy at any time. If we decide to change
                                    our Privacy Policy, we will post those changes to this Privacy Policy and any other
                                    places we deem appropriate, so that you are aware of what information we collect, how
                                    we use it, and under what circumstances, if any, we disclose it. If we make material
                                    changes to this Privacy Policy, we will notify you here, by email, or by means of a notice
on our home page, at least seven (7) days prior to the implementation of the changes.</p>
                                    <h6>2. Terms and conditions</h6>
                                    <p>This page states the Terms and Conditions under which you (Visitor) may visit this
                                    website (“Website”). Please read this page carefully. If you do not accept the Terms and
                                    Conditions stated here, we would request you to exit this site. The business, any of its
                                    business divisions and / or its subsidiaries, associate companies or subsidiaries to
                                    subsidiaries or such other investment companies (in India or abroad) reserve their
                                    respective rights to revise these Terms and Conditions at any time by updating this
                                    posting. You should visit this page periodically to re-appraise yourself of the Terms and
Conditions, because they are binding on all users of this Website.</p>
                                    <h6>2.1 USE OF CONTENT</h6>
                                    <p>All logos, brands, marks headings, labels, names, signatures, numerals, shapes or any
                                    combinations thereof, appearing in this site, except as otherwise noted, are properties
                                    either owned, or used under licence, by the business and / or its associate entities who
                                    feature on this Website. The use of these properties or any other content on this site,
                                    except as provided in these terms and conditions or in the site content, is strictly
                                    prohibited.
                                    You may not sell or modify the content of this Website or reproduce, display, publicly
                                    perform, distribute, or otherwise use the materials in any way for any public or
commercial purpose without the respective organisation’s or entity’s written permission.</p>
                                    <h6>2.2 ACCEPTABLE WEBSITE USE</h6>
                                    <h6>(A) Security Rules</h6>
                                    <p>Visitors are prohibited from violating or attempting to violate the security of the Web site,
                                    including, without limitation, (1) accessing data not intended for such user or logging
                                    into a server or account which the user is not authorised to access, (2) attempting to
                                    probe, scan or test the vulnerability of a system or network or to breach security or
                                    authentication measures without proper authorisation, (3) attempting to interfere with
                                    service to any user, host or network, including, without limitation, via means of
                                    submitting a virus or &quot;Trojan horse&quot; to the Website, overloading, &quot;flooding&quot;, &quot;mail
                                    bombing&quot; or &quot;crashing&quot;, or (4) sending unsolicited electronic mail, including promotions
                                    and/or advertising of products or services. Violations of system or network security may
                                    result in civil or criminal liability. The business and / or its associate entities will have the

                                    right to investigate occurrences that they suspect as involving such violations and will
                                    have the right to involve, and cooperate with, law enforcement authorities in prosecuting
users who are involved in such violations.</p>
                                    <h6>(B) General Rules</h6>
                                    <p>Visitors may not use the Web Site in order to transmit, distribute, store or destroy
                                    material (a) that could constitute or encourage conduct that would be considered a
                                    criminal offence or violate any applicable law or regulation, (b) in a manner that will
                                    infringe the copyright, trademark, trade secret or other intellectual property rights of
                                    others or violate the privacy or publicity of other personal rights of others, or (c) that is
libellous, defamatory, pornographic, profane, obscene, threatening, abusive or hateful.</p>
                                    <h6>2.3 INDEMNITY</h6>
                                    <p>The User unilaterally agree to indemnify and hold harmless, without objection, the
                                    Company, its officers, directors, employees and agents from and against any claims,
                                    actions and/or demands and/or liabilities and/or losses and/or damages whatsoever
                                    arising from or resulting from their use of  indiakhelofootball.com or their breach of the
terms .</p>
                                    <h6>2.4 LIABILITY</h6>
                                    <p>User agrees that neither Company nor its group companies, directors, officers or
                                    employee shall be liable for any direct or/and indirect or/and incidental or/and special
                                    or/and consequential or/and exemplary damages, resulting from the use or/and the
                                    inability to use the service or/and for cost of procurement of substitute goods or/and
                                    services or resulting from any goods or/and data or/and information or/and services
                                    purchased or/and obtained or/and messages received or/and transactions entered into
                                    through or/and from the service or/and resulting from unauthorized access to or/and
                                    alteration of user&#39;s transmissions or/and data or/and arising from any other matter
                                    relating to the service, including but not limited to, damages for loss of profits or/and use
                                    or/and data or other intangible, even if Company has been advised of the possibility of
                                    such damages.
                                    User further agrees that Company shall not be liable for any damages arising from
                                    interruption, suspension or termination of service, including but not limited to direct
                                    or/and indirect or/and incidental or/and special consequential or/and exemplary
                                    damages, whether such interruption or/and suspension or/and termination was justified
                                    or not, negligent or intentional, inadvertent or advertent.
                                    User agrees that Company shall not be responsible or liable to user, or anyone, for the
                                    statements or conduct of any third party of the service. In sum, in no event shall
                                    Company&#39;s total liability to the User for all damages or/and losses or/and causes of
                                    action exceed the amount paid by the User to Company, if any, that is related to the
cause of action.</p>
                                    <h6>2.5 DISCLAIMER OF CONSEQUENTIAL DAMAGES</h6>
                                    <p>In no event shall Company or any parties, organizations or entities associated with the
                                    corporate brand name us or otherwise, mentioned at this Website be liable for any
                                    damages whatsoever (including, without limitations, incidental and consequential
                                    damages, lost profits, or damage to computer hardware or loss of data information or
                                    business interruption) resulting from the use or inability to use the Website and the
                                    Website material, whether based on warranty, contract, tort, or any other legal theory,
                                    and whether or not, such organization or entities were advised of the possibility of such
damages.</p>
                                    <h6>3. Refund and Cancellation Policy</h6>
                                    <p className="font-weight-bold">
                                        Our focus is complete customer satisfaction. We do care about our customers.
                                        So, we want to be clear about our cancellation and refund policy.
                                    </p>
                                    <p className="font-weight-bold">
                                        As it is the simple registration form for the tournament, we cannot cancel your
                                        registration once you have registered with us. Similarly, no refund request will be
                                        entertained.
                                    </p>
                                    <h6>4. Contact us</h6>
                                    <p>If you have any questions, concerns or complaints about our Privacy Policy, our
practices or our Services, you may contact by email at indiakhelofootball@gmail.com</p>
                                    <h6>5. Grievance Redressal</h6>
                                    <p>Redressal Mechanism: Any complaints, abuse or concerns with regards to
                                    content and or comment or breach of these terms shall be immediately informed
                                    to the designated Grievance Officer as mentioned below via in writing or through
email signed with the electronic signature to (&quot;Grievance Officer&quot;).</p>
                                    <p>Mrs Nirja Shekhawat. <span className="font-weight-bold">(Grievance Officer)</span>
www.indiakhelofootball.com</p>
                                    <h6>Company Name &amp; Address</h6>
                                    <p>India khelo football</p>
                                    <p>3/50 jai shastri nagar, mulund colony, mulund west, 400082</p>
                                    <p>Email: Info@indiakhelofootball</p>
                                    <p>Ph: 8928669565</p>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-12">
                                    <div className="form-check form-check-inline  mt-3">
                                        <input className="form-check-input largerCheckbox" type="checkbox" id="termsAndConditionsBox" onChange={this.handleAcceptance} checked={this.state.termsAndConditionAccepted} />
                                        <label className="form-check-label text-primary font-weight-bold" htmlFor="termsAndConditionsBox">I agree with the terms and conditions and
                                        privacy policy .</label>
                                    </div>
                                    <div>
                                        <small className='text-danger font-weight-bold'>{this.state.registrationFormError.termsAndConditions}</small>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <button className="btn btn-primary px-4 py-0 float-right mr-2 mt-3" disabled={this.validateForm()} onClick={this.register} >
                                        Submit
                                    </button>
                                </div>
                            </div>

                        </div>}
                        {/* next button */}
                        {this.state.activePage !== 3 && <div className="row mt-3">
                            <div className="col-12">
                                <button className="btn btn-primary px-4 py-0 float-right mr-2 mt-3" onClick={this.nextPage} disabled={this.state.activePage === 3}>
                                    NEXT
                            </button>
                            </div>
                        </div>}
                    </div>

                </div>
                {this.state.showLoading && <ApplicationBlocker title={this.state.loadingTitle} showCloseButton={this.state.showCloseButton} unsetFinexxBusyState={this.unsetFinexxBusyState} description={this.state.loadingDescription} extraInfo={this.state.extraInfo} showLoadingSpinner={this.state.showLoadingSpinner} />}
                <form method="post" action={this.state.postRegistration.url} name="PaymentForm">
                    <table border="1">
                        <tbody>
                            <input type="hidden" name="mid" value={this.state.postRegistration.mid} />
                            <input type="hidden" name="orderId" value={this.state.postRegistration.orderId} />
                            <input
                                type="hidden"
                                name="txnToken"
                                value={this.state.postRegistration.txnToken}
                            />
                        </tbody>
                    </table>
                </form>
            </React.Fragment>
        );

    }
}

export default RegistrationComponent;
