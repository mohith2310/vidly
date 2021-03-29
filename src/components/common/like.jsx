import React, { Component } from "react";

class Like extends Component {
  render() {
    return (
      <React.Fragment>
        <span
          className="liked"
          onClick={this.props.onClick}
          style={{ cursor: "pointer" }}
        >
          {!this.props.liked ? (
            <i class="fa fa-heart-o" aria-hidden="true"></i>
          ) : (
            <i
              class="fa fa-heart"
              aria-hidden="true"
              style={{ color: "red" }}
            ></i>
          )}
        </span>
      </React.Fragment>
    );
  }
}

export default Like;
