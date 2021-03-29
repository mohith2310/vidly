import React, { Component } from "react";

class ListGroup extends Component {
  render() {
    return (
      <React.Fragment>
        <ul className="list-group">
          <li
            style={{ cursor: "pointer" }}
            className={
              this.props.curGenre === "All Genres"
                ? "list-group-item list-group-item-action active"
                : "list-group-item list-group-item-action"
            }
            onClick={() => this.props.onGenreChange("All Genres")}
          >
            All Genres
          </li>
          {this.props.items.map((item) => (
            <li
              style={{ cursor: "pointer" }}
              key={item._id}
              className={
                this.props.curGenre === item.name
                  ? "list-group-item list-group-item-action active"
                  : "list-group-item list-group-item-action"
              }
              onClick={() => this.props.onGenreChange(item.name)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </React.Fragment>
    );
  }
}

export default ListGroup;
