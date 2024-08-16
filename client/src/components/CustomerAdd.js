import React from "react";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

const HiddenInput = styled("input")({
  display: "none",
});

class CustomerAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      userName: "",
      userNumber: "", // Add this to the state
      birthday: "",
      gender: "",
      position: "",
      fileName: "",
      open: false,
    };
  }

  handleFormSubmit = (e) => {
    e.preventDefault();
    this.addCustomer().then((response) => {
      console.log(response.data);
      this.props.stateRefresh();
    });
    this.setState({
      file: null,
      userName: "",
      userNumber: "", // Reset userNumber here
      birthday: "",
      gender: "",
      job: "",
      fileName: "",
      open: false,
    });
  };

  handleFileChange = (e) => {
    this.setState({
      file: e.target.files[0],
      fileName: e.target.files[0]?.name || "",
    });
  };

  handleValueChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: name === "userNumber" ? parseInt(value, 10) || "" : value,
    });
  };

  addCustomer = () => {
    const url = "/api/customers";
    const formData = new FormData();
    formData.append("image", this.state.file);
    formData.append("name", this.state.userName);
    formData.append("birthday", this.state.birthday);
    formData.append("gender", this.state.gender);
    formData.append("position", this.state.position);
    formData.append("number", this.state.userNumber); // Append userNumber to formData

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    return axios.post(url, formData, config);
  };

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = () => {
    this.setState({
      file: null,
      userName: "",
      userNumber: "", // Reset userNumber here
      birthday: "",
      gender: "",
      job: "",
      fileName: "",
      open: false,
    });
  };

  render() {
    return (
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleClickOpen}
        >
          선수 추가하기
        </Button>
        <Dialog open={this.state.open} onClose={this.handleClose}>
          <DialogTitle>선수 추가</DialogTitle>
          <DialogContent>
            <HiddenInput
              accept="image/*"
              id="raised-button-file"
              type="file"
              onChange={this.handleFileChange}
            />
            <label htmlFor="raised-button-file">
              <Button variant="contained" color="primary" component="span">
                {this.state.fileName === ""
                  ? "프로필 이미지 선택"
                  : this.state.fileName}
              </Button>
            </label>
            <br />
            <TextField
              label="이름"
              type="text"
              name="userName"
              value={this.state.userName}
              onChange={this.handleValueChange}
            />
            <TextField
              label="등번호"
              type="number"
              name="userNumber"
              value={this.state.userNumber}
              onChange={this.handleValueChange}
            />
            <br />
            <TextField
              label="생년월일"
              type="text"
              name="birthday"
              value={this.state.birthday}
              onChange={this.handleValueChange}
            />
            <br />
            <TextField
              label="성별"
              type="text"
              name="gender"
              value={this.state.gender}
              onChange={this.handleValueChange}
            />
            <br />
            <TextField
              label="포지션"
              type="text"
              name="position"
              value={this.state.position}
              onChange={this.handleValueChange}
            />
            <br />
            <DialogActions>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleFormSubmit}
              >
                추가
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={this.handleClose}
              >
                닫기
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default CustomerAdd;
