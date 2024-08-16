import React, { Component } from "react";
import Customer from "./components/Customer";
import CustomerAdd from "./components/CustomerAdd";
import "./App.css";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import { alpha } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
  width: "100%",
  minWidth: 1080,
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
}));

const StyledTable = styled(Table)(({ theme }) => ({
  minWidth: 1080,
}));

const StyledProgress = styled(CircularProgress)(({ theme }) => ({
  margin: theme.spacing(2),
}));

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  position: "static",
}));

const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
}));

const SearchStyled = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconStyled = styled(SearchIcon)(({ theme }) => ({
  width: theme.spacing(7),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const InputBaseStyled = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(7),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: 120,
      "&:focus": {
        width: 200,
      },
    },
  },
}));

const TableHeadStyled = styled(TableHead)(({ theme }) => ({
  fontSize: "1.0rem",
}));

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: null,
      completed: 0,
      searchKeyword: "",
      loginOpen: false,
      signUpOpen: false,
    };
  }

  stateRefresh = () => {
    this.setState({
      customers: null,
      completed: 0,
      searchKeyword: "",
    });
    this.callApi()
      .then((res) => this.setState({ customers: res }))
      .catch((err) => console.log(err));
  };

  componentDidMount() {
    this.timer = setInterval(this.progress, 20);
    this.callApi()
      .then((res) => this.setState({ customers: res }))
      .catch((err) => console.log(err));
  }

  callApi = async () => {
    const response = await fetch("/api/customers");
    const body = await response.json();
    return body;
  };

  progress = () => {
    const { completed } = this.state;
    this.setState({ completed: completed >= 100 ? 0 : completed + 1 });
  };

  handleValueChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleLoginOpen = () => {
    this.setState({ loginOpen: true });
  };

  handleLoginClose = () => {
    this.setState({ loginOpen: false });
  };

  handleSignUpOpen = () => {
    this.setState({ signUpOpen: true, loginOpen: false });
  };

  handleSignUpClose = () => {
    this.setState({ signUpOpen: false });
  };

  render() {
    const filteredComponents = (data) => {
      data = data.filter((c) =>
        c.name.toLowerCase().includes(this.state.searchKeyword.toLowerCase())
      );
      return data.map((c) => (
        <Customer
          stateRefresh={this.stateRefresh}
          key={c.id}
          id={c.id}
          number={c.number}
          image={c.image}
          name={c.name}
          birthday={c.birthday}
          gender={c.gender}
          position={c.position}
        />
      ));
    };

    const { completed } = this.state;
    const cellList = [
      "등번호",
      "프로필 이미지",
      "이름",
      "생년월일",
      "성별",
      "포지션",
      "설정",
    ];

    return (
      <div>
        <AppBarStyled>
          <ToolbarStyled>
            <img
              src={`${process.env.PUBLIC_URL}/madridicon.png`}
              alt="Madrid Icon"
              style={{ width: 40, height: 40, marginRight: 15 }}
            />
            <Typography variant="h6" color="inherit" sx={{ flexGrow: 1 }}>
              선수 관리 시스템
            </Typography>
            <SearchStyled>
              <SearchIconStyled />
              <InputBaseStyled
                placeholder="검색하기"
                name="searchKeyword"
                value={this.state.searchKeyword}
                onChange={this.handleValueChange}
              />
            </SearchStyled>
            <Button color="inherit" onClick={this.handleLoginOpen}>
              로그인
            </Button>
          </ToolbarStyled>
        </AppBarStyled>
        <div
          style={{
            marginTop: 15,
            marginBottom: 15,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CustomerAdd stateRefresh={this.stateRefresh} />
        </div>
        <StyledPaper>
          <StyledTable>
            <TableHeadStyled>
              <TableRow>
                {cellList.map((cell, index) => (
                  <TableCell key={index}>{cell}</TableCell>
                ))}
              </TableRow>
            </TableHeadStyled>
            <TableBody>
              {this.state.customers ? (
                filteredComponents(this.state.customers)
              ) : (
                <TableRow>
                  <TableCell colSpan="7" align="center">
                    <StyledProgress variant="determinate" value={completed} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </StyledTable>
        </StyledPaper>

        <Dialog open={this.state.loginOpen} onClose={this.handleLoginClose}>
          <DialogTitle>로그인</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="username"
              label="아이디"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              margin="dense"
              id="password"
              label="비밀번호"
              type="password"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleSignUpOpen}
              color="primary"
              style={{ marginRight: "auto" }}
            >
              회원가입
            </Button>
            <Button onClick={this.handleLoginClose} color="primary">
              취소
            </Button>
            <Button onClick={this.handleLoginClose} color="primary">
              로그인
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={this.state.signUpOpen} onClose={this.handleSignUpClose}>
          <DialogTitle>회원가입</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="newUsername"
              label="아이디"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              margin="dense"
              id="newPassword"
              label="비밀번호"
              type="password"
              fullWidth
              variant="standard"
            />
            <TextField
              margin="dense"
              id="confirmPassword"
              label="비밀번호 확인"
              type="password"
              fullWidth
              variant="standard"
            />
            <TextField
              margin="dense"
              id="email"
              label="이메일"
              type="email"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleSignUpClose} color="primary">
              취소
            </Button>
            <Button onClick={this.handleSignUpClose} color="primary">
              회원가입
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default App;
