import React from "react";
import {Activity, Classroom} from "../types";
import {Card, CardActions, CardContent, CardHeader, IconButton, TextField} from "@material-ui/core";
import {CirclePicker, ColorResult} from "react-color";
import DeleteIcon from "@material-ui/icons/Delete";

interface IProps {
    activity: Activity
    onActivityChanged: (changedGroup: Activity) => void
    onDeleteRequested: () => void
}

const ActivityEditor: React.FC<IProps> = (props: IProps) => {
    const {
        name,
        color,
        image,
    } = props.activity;
    const trimmedLabel = props.activity.name.trim();

    const onNameUpdated = (newName: string) => {
        props.onActivityChanged({
            ...props.activity,
            name: newName,
        })
    };

    const handleChangeComplete = (color: ColorResult) => {
        props.onActivityChanged({
            ...props.activity,
            color: color.hex,
        });
    };

    const handleDeleteClicked = () => {
        // TODO: Use material prompt
        if (window.confirm("Are you sure you want to delete this group?")) {
            props.onDeleteRequested();
        }
    };

    return (
        <Card>
            <CardHeader title={
                trimmedLabel === '' ? '(Unnamed Activity)' : trimmedLabel
            } />
            <CardContent>
                <TextField
                    id="outlined-helperText"
                    label="Activity"
                    defaultValue=""
                    helperText="Some important text"
                    variant="outlined"
                    onChange={(evt) => onNameUpdated(evt.target.value)}
                />
                <CirclePicker
                    color={ color || "#f44336" }
                    onChangeComplete={ handleChangeComplete }
                />
                <img alt={name} src={image} />
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="share" onClick={() => handleDeleteClicked()}>
                    <DeleteIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
};

export default ActivityEditor;
