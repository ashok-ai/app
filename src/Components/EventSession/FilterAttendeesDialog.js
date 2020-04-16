import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import _ from "lodash";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { Tooltip } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  content: {
    position: "relative",
    width: theme.breakpoints.values.sm,
    padding: theme.spacing(6),
  },
  closeContainer: {
    position: "absolute",
  },
  buttonContainer: {
    width: "100%",
    textAlign: "center",
    marginTop: theme.spacing(4),
  },
  hintText: {
    marginBottom: theme.spacing(4),
    display: "block",
    width: 400,
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: theme.spacing(2),
  },
  emptySpaceBottom: {
    marginBottom: theme.spacing(4),
  },
}));

export default function (props) {
  const classes = useStyles();

  const { open, setOpen, users, eventSession, filters, setFilters } = props;

  const [internalFilters, setInternalFilters] = React.useState(filters);

  const handleClose = () => {
    setOpen(false);
  };

  const usersInterests = React.useMemo(() => {
    let result = {};
    _.forEach(users, (user, id) => {
      let { interestsChips } = user;
      let sessionParticipant = eventSession.participantsJoined[id];

      if (interestsChips && interestsChips.length > 0 && sessionParticipant && sessionParticipant.isOnline) {
        for (let i = 0; i < interestsChips.length; i++) {
          let interest = interestsChips[i].label;
          if (result[interest]) {
            result[interest].count = result[interest].count + 1;
          } else {
            result[interest] = {
              label: interest,
              count: 1,
            };
          }
        }
      }
    });

    let sorted = Object.values(result).sort((a, b) => b.count - a.count);

    return sorted;
  }, [users, eventSession.participantsJoined]);

  const handleFilterChecked = (label) => (e) => {
    let newFilters = { ...internalFilters };
    if (e.target.checked === true) {
      newFilters[label] = true;
    } else {
      delete newFilters[label];
    }
    setInternalFilters(newFilters);
  };

  const applyFilters = React.useCallback(() => {
    setFilters(internalFilters);
    setOpen(false);
  }, [internalFilters, setFilters, setOpen]);

  return (
    <div>
      <Dialog open={open} onClose={handleClose} maxWidth={"sm"}>
        <div className={classes.content}>
          <Typography variant="h5" color="primary" align="left">
            Filter list of attendees by interest/hobby
          </Typography>

          <FormGroup row style={{ marginTop: 16 }}>
            {usersInterests.map(({ label, count }) => (
              <Tooltip key={label} title={`${count} attendee${count > 1 ? "s have" : " has"} this interest/hobby`}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={internalFilters[label] === true}
                      onChange={handleFilterChecked(label)}
                      color="primary"
                    />
                  }
                  label={`${label}`}
                />
              </Tooltip>
            ))}
          </FormGroup>

          <React.Fragment>
            <div className={classes.buttonContainer}>
              <Button variant="contained" color="primary" className={classes.button} onClick={applyFilters}>
                Apply filters
              </Button>
            </div>
          </React.Fragment>
          {/* {participant.id === user.uid && (
            <React.Fragment>
              <div className={classes.buttonContainer}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={() => history.push(routes.EDIT_PROFILE(routes.EVENT_SESSION(eventSession.id)))}
                >
                  Edit profile
                </Button>
              </div>
            </React.Fragment>
          )} */}
          {/* {(onConferenceRoom || participant.id === user.uid) && <div className={classes.emptySpaceBottom}></div>} */}
        </div>
      </Dialog>
    </div>
  );
}