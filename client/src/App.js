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
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      user: null, // 로그인한 사용자 정보를 저장
      logoutMessage: "", // 로그아웃 메시지를 저장
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

    // 사용자가 로그인했는지 확인하고 사용자 정보를 가져옵니다.
    const token = localStorage.getItem("token");
    if (token) {
      this.setState({ user: { username: localStorage.getItem("username") } });
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
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

  handleLogin = async () => {
    const { username, password } = this.state;

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      alert("로그인 성공");
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", username); // 사용자 이름 저장
      this.setState({ user: { username } }); // 로그인 상태 업데이트
      this.handleLoginClose();
    } else {
      alert("로그인 실패");
    }
  };

  handleSignUp = async () => {
    const { username, password, confirmPassword, email } = this.state;

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }),
      });

      if (response.ok) {
        alert("회원가입 성공");
        this.handleSignUpClose();
      } else {
        const message = await response.text();
        alert(`회원가입 실패: ${message}`);
      }
    } catch (error) {
      console.error("회원가입 요청 오류:", error);
      alert("회원가입 요청 중 오류가 발생했습니다.");
    }
  };

  handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    this.setState({ user: null });
    alert("로그아웃되었습니다.");
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

    const {
      completed,
      username,
      password,
      confirmPassword,
      email,
      user,
      logoutMessage,
    } = this.state;
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
            {user ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body1" style={{ marginRight: 15 }}>
                  {user.username}
                </Typography>
                <Button color="inherit" onClick={this.handleLogout}>
                  로그아웃
                </Button>
              </div>
            ) : (
              <Button color="inherit" onClick={this.handleLoginOpen}>
                로그인
              </Button>
            )}
            <SearchStyled>
              <SearchIconStyled />
              <InputBaseStyled
                placeholder="검색하기"
                name="searchKeyword"
                value={this.state.searchKeyword}
                onChange={this.handleValueChange}
              />
            </SearchStyled>
          </ToolbarStyled>
        </AppBarStyled>
        {logoutMessage && (
          <div style={{ textAlign: "center", marginTop: 10, color: "green" }}>
            {logoutMessage}
          </div>
        )}
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
                {cellList.map((c) => (
                  <TableCell key={c}>{c}</TableCell>
                ))}
              </TableRow>
            </TableHeadStyled>
            <TableBody>
              {this.state.customers ? (
                filteredComponents(this.state.customers)
              ) : (
                <TableRow>
                  <TableCell colSpan="6" align="center">
                    <StyledProgress variant="determinate" value={completed} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </StyledTable>
        </StyledPaper>

        {/* 로그인 다이얼로그 */}
        <Dialog open={this.state.loginOpen} onClose={this.handleLoginClose}>
          <DialogTitle>로그인</DialogTitle>
          <DialogContent>
            <TextField
              label="아이디"
              type="text"
              name="username"
              value={username}
              onChange={this.handleValueChange}
              fullWidth
            />
            <TextField
              label="비밀번호"
              type="password"
              name="password"
              value={password}
              onChange={this.handleValueChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleLoginClose} color="primary">
              취소
            </Button>
            <Button onClick={this.handleLogin} color="primary">
              로그인
            </Button>
            <Button onClick={this.handleSignUpOpen} color="primary">
              회원가입
            </Button>
          </DialogActions>
        </Dialog>

        {/* 회원가입 다이얼로그 */}
        <Dialog open={this.state.signUpOpen} onClose={this.handleSignUpClose}>
          <DialogTitle>회원가입</DialogTitle>
          <DialogContent>
            <TextField
              label="아이디"
              type="text"
              name="username"
              value={username}
              onChange={this.handleValueChange}
              fullWidth
            />
            <TextField
              label="비밀번호"
              type="password"
              name="password"
              value={password}
              onChange={this.handleValueChange}
              fullWidth
            />
            <TextField
              label="비밀번호 확인"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={this.handleValueChange}
              fullWidth
            />
            <TextField
              label="이메일"
              type="email"
              name="email"
              value={email}
              onChange={this.handleValueChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleSignUpClose} color="primary">
              취소
            </Button>
            <Button onClick={this.handleSignUp} color="primary">
              회원가입
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default App;
