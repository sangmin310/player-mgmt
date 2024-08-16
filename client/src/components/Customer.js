import React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import CustomerDelete from "./CustomerDelete";

class Customer extends React.Component {
  render() {
    return (
      <TableRow>
        <TableCell>{this.props.number}</TableCell>
        <TableCell>
          <img
            src={this.props.image}
            alt="profile"
            style={{ width: "128px", height: "162px" }}
          />
        </TableCell>
        <TableCell>{this.props.name}</TableCell>
        <TableCell>{this.props.birthday}</TableCell>
        <TableCell>{this.props.gender}</TableCell>
        <TableCell>{this.props.position}</TableCell>
        <TableCell>
          <CustomerDelete
            stateRefresh={this.props.stateRefresh}
            id={this.props.id}
          />
        </TableCell>
      </TableRow>
    );
  }
}

export default Customer;
