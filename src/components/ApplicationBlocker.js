import React, { Component } from "react";
class ApplicationBlocker extends Component {
  render() {
    return (
      <>
        <div
          className="modal fade show finexx-application-busy-wrapper"
          tabIndex="-1"
          role="dialog"
          data-backdrop="static"
          data-background="false"
        >
          <div
            className="modal-dialog finexx-application-busy-wrapper "
            role="document"
          >
            <div
              className="modal-content border border-danger finexx-application-busy-wrapper"
              style={{ marginTop: "50%" }}
            >
              <div className="modal-header">
                <h5 className="modal-title text-success">{this.props.title}</h5>
                {this.props.showCloseButton ? (
                  <button
                    type="button"
                    className="close"
                    aria-label="Close"
                    onClick={this.props.unsetFinexxBusyState}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                ) : (
                  false
                )}
              </div>
              <div className="modal-body">
                <h6 className="text-danger">{this.props.description}</h6>
                {this.props.showLoadingSpinner && (
                  <div className="text-center">
                    <div
                      className="spinner-border text-warning text-center"
                      role="status"
                    >
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <p className="text-info text-left justify-content-start">
                  {this.props.extraInfo}
                </p>
                {this.props.showCloseButton ? (
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={this.props.unsetFinexxBusyState}
                  >
                    Close
                  </button>
                ) : (
                  false
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default ApplicationBlocker;
