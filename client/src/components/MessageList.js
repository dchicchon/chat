import React, { useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Divider,
  Typography,
} from "@material-ui/core";
// const scrollableListRef = React.createRef();

const MessageList = (props) => {
  useEffect(() => {
    // console.log("Start Message List");
    // console.log(props.messages);
  }, [props.messages]);

  //   Do this later
  // const scrollTo = () => {
  // const listHeight = 200;
  // const numItems = props.messages.length;
  // const amountToScroll =
  // };

  let list = props.messages;
  list = list.map((m, i) => (
    <React.Fragment key={i}>
      <ListItem alignItems="flex-start">
        <ListItemText
          primary={
            <React.Fragment>
              <Typography component="span">{m.sender + " - "}</Typography>
              {m.text}
            </React.Fragment>
          }
          secondary={m.date}
        />
      </ListItem>
      <Divider component="li" />
    </React.Fragment>
  ));
  return <List>{props.loading ? <CircularProgress /> : list}</List>;
};

export default MessageList;
