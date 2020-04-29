import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { openJoinParticipant } from "../../Redux/dialogs";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
  participantContainer: {
    marginRight: theme.spacing(2),
    cursor: "pointer",
  },
  participantDetails: {
    flexGrow: 1,
    textAlign: "center",
    marginTop: 4,
  },
  topicsInterested: {
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    display: "block",
    width: 185,
  },
  avatar: {
    marginTop: 1,
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

export default function (props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { group } = props;

  const handleAvatarClick = React.useCallback((participant) => () => dispatch(openJoinParticipant(participant)), [
    dispatch,
  ]);
  return (
    <React.Fragment>
      {group.map((participant) => {
        return (
          <div className={classes.participantContainer} key={participant.id} onClick={handleAvatarClick(participant)}>
            {participant.avatarUrl && (
              <Avatar alt={participant.firstName} src={participant.avatarUrl} className={classes.avatar} />
            )}
            {!participant.avatarUrl && (
              <Avatar className={classes.avatar}>
                {participant.firstName.charAt(0)}
                {participant.lastName.charAt(0)}
              </Avatar>
            )}
            <div className={classes.participantDetails}>
              <Typography variant="caption">
                {`${participant.firstName} ${
                  participant.lastName.trim() !== "" ? participant.lastName.charAt(0) + "." : ""
                }`}
              </Typography>
            </div>
          </div>
        );
      })}
    </React.Fragment>
  );
}
