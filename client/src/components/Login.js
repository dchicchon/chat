import React, { useState } from "react";
import {
  Container,
  TextField,
  Typography,
  makeStyles,
  Box,
  Button,
} from "@material-ui/core";

import { useHistory } from 'react-router-dom'


const Login = (props) => {
  const [userName, setUserName] = useState("");

  const useStyles = makeStyles((theme) => ({
    container: {
      spacing: 2,
      marginTop: "50px",
    },
    input: {
      margin: "25px 0",
    },
  }));
  const history = useHistory()

  const login = (e) => {
    e.preventDefault();
    console.log("User loggin on ");
    console.log(props)
    props.setUser(userName)
    history.push("/")
  };

  const classes = useStyles();

  return (
    <Container maxWidth="md" className={classes.container}>
      <Box
        display="flex"
        justifyContent="center"
        flexDirection="column"
        width="50%"
        margin="0 auto"
      >
        <Typography variant="h5">Login</Typography>
        <TextField
          className={classes.input}
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={login}>
          Submit
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
