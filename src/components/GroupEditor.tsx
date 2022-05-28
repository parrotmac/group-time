import React, {Component} from 'react';
import {Card, CardActions, CardContent, CardHeader, IconButton, TextField} from "@material-ui/core";
import {Group} from "../types";
import { isNil } from 'lodash';
import {CirclePicker, ColorResult} from "react-color";
import DeleteIcon from "@material-ui/icons/Delete";

interface IProps {
    group: Group
    onGroupChanged: (updatedGroup: Group) => void
    onDeleteRequested: () => void
}

interface IState {
    groupName?: string
}

class GroupEditor extends Component<IProps> {

    private onNameUpdated = (newName: string) => {
        this.props.onGroupChanged({
            ...this.props.group,
            label: newName,
        })
    };

    private handleChangeComplete = (color: ColorResult) => {
        this.props.onGroupChanged({
            ...this.props.group,
            color: color.hex,
        });
    };

    private handleGroupMembersChange = (text: string) => {
        this.props.onGroupChanged({
            ...this.props.group,
            names: text.split("\n"),
        });
    };

    private handleDeleteClicked = () => {
        // TODO: Use material prompt
        if (window.confirm("Are you sure you want to delete this group?")) {
            this.props.onDeleteRequested();
        }
    };

    public render(): JSX.Element {
        const { group } = this.props;
        return (
            <Card>
                <CardHeader title={`Editing ${group.label.trim() === "" ? "a group" : group.label}`} />
                <CardContent>
                <TextField
                    id="outlined-helperText"
                    label="Group Name"
                    defaultValue=""
                    helperText="Some important text"
                    variant="outlined"
                    onChange={(evt) => this.onNameUpdated(evt.target.value)}
                />
                <TextField
                    id="outlined-multiline-static"
                    label="Names"
                    multiline
                    rows="4"
                    defaultValue="Default Value"
                    variant="outlined"
                    onChange={(evt) => this.handleGroupMembersChange(evt.target.value)}
                />
                <CirclePicker
                    color={ group.color || "#f44336" }
                    onChangeComplete={ this.handleChangeComplete }
                />
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton aria-label="share" onClick={() => this.handleDeleteClicked()}>
                        <DeleteIcon />
                    </IconButton>
                </CardActions>
            </Card>
        )
    }
}

export default GroupEditor