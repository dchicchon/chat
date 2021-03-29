import axios from "axios";
const SERVER = "http://10.0.0.119:5000";

const getToken = () => {
  axios
    .get(SERVER + "/token")
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      console.log("After the initial call of get function");
    });
};
