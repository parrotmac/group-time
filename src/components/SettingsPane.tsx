import React, {Component, ReactElement} from 'react';

import {AppBar, Box, Container, Fab, Tab, Tabs, TextField} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import GroupEditor from "./GroupEditor";
import {Activity, Classroom, Group} from "../types";
import ActivityEditor from "./ActivityEditor";

interface IProps {
    classroom: Classroom
    onChanged: (newClassroom: Classroom) => void
}

function a11yProps(index: any) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

interface ShowIfProps {
    condition: boolean
    children?: any
}

function ShowIf(props: ShowIfProps) {
    const { condition } = props;
    if (condition) {
        return props.children;
    }
    return <></>
}

export default function SettingsPane(props: IProps) {
    const [value, setValue] = React.useState(0);
    const { Groups, Activities, GroupSettings, IntermissionSettings } = props.classroom;

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    const updateClassroom = (modifiedClassroom: Classroom) => {
        console.log(modifiedClassroom);
        props.onChanged(modifiedClassroom);
    };

    const onActivityChanged = (idx: number, activity: Activity) => {
        const updatedActivities = [...Activities];
        updatedActivities[idx] = activity;
        props.onChanged({
            ...props.classroom,
            Activities: updatedActivities,
        });
    };

    const handleAddActivity = () => {
        const updatedClassroom: Classroom = {
            ...props.classroom,
            Activities: [
                ...Activities,
                {
                    name: "",
                    image: "",
                    color: "",
                }
            ]
        };
        console.log("updatedClassroom", updatedClassroom);
        props.onChanged(updatedClassroom);
    };

    const handleDeleteActivity = (idx: number) => {
        const editedActivities = [...Activities];
        editedActivities.splice(idx, 1);
        props.onChanged({
            ...props.classroom,
            Activities: editedActivities,
        });
    };

    const onGroupChanged = (groupIndex: number, groupDetails: Group) => {
        const updatedGroups = [...Groups];
        updatedGroups[groupIndex] = groupDetails;
        props.onChanged({
            ...props.classroom,
            Groups: updatedGroups,
        });
    };

    const handleAddGroup = () => {
        const updatedClassroom = {
            ...props.classroom,
            Groups: [
                ...Groups,
                {
                    label: "",
                    color: "",
                    names: [],
                }
            ]
        };
        console.log("updatedClassroom", updatedClassroom);
        props.onChanged(updatedClassroom);
    };

    const handleDeleteGroup = (groupIndex: number) => {
        const editedGroups = [...Groups];
        editedGroups.splice(groupIndex, 1);
        props.onChanged({
            ...props.classroom,
            Groups: editedGroups,
        });
    };

    const activitiesPane = <div>
        {Activities.map((activity, index) =>
            <ActivityEditor
                activity={activity}
                onActivityChanged={changedActivity => onActivityChanged(index, changedActivity)}
                onDeleteRequested={() => handleDeleteActivity(index)}
            />
        )}
        <Fab color="primary" aria-label="add" onClick={() => handleAddActivity()} >
            <AddIcon />
        </Fab>
    </div>;

    const groupsPane = <div>
        {Groups.map((group, index) =>
            <GroupEditor
                group={group}
                onGroupChanged={updatedGroup => onGroupChanged(index, updatedGroup)}
                onDeleteRequested={() => handleDeleteGroup(index)}
            />
        )}
        <Fab color="primary" aria-label="add" onClick={() => handleAddGroup()} >
            <AddIcon />
        </Fab>
    </div>;

    const moreGroups = Groups.length > Activities.length;
    const moreActivities = Activities.length > Groups.length;
    const groupActivityMismatchWarning = `There are more ${moreGroups?"groups":"activities"} than there are ${moreActivities?"groups":"activities"}`;

        return (
            <Container>
                <AppBar position="static">
                    <Tabs centered value={value} onChange={handleChange} aria-label="simple tabs example">
                        <Tab label="Activities" {...a11yProps(0)} />
                        <Tab label="Group Editor" {...a11yProps(1)} />
                        <Tab label="Configuration" {...a11yProps(2)} />
                    </Tabs>
                </AppBar>
                <div>
                    {
                        (moreGroups || moreActivities) &&
                        <Box borderLeft={1}>
                            {groupActivityMismatchWarning}
                        </Box>
                    }
                    <ShowIf condition={value === 0}>
                        <h1>Activities</h1>
                        {activitiesPane}
                    </ShowIf>
                    <ShowIf condition={value === 1}>
                        <h1>Groups</h1>
                        {groupsPane}
                    </ShowIf>
                    <ShowIf condition={value === 2}>
                        <h1>General Config</h1>
                        <hr />
                        <h3>Group Settings</h3>
                        <TextField
                            id="outlined-number"
                            label="Minutes Per Group"
                            defaultValue={'1'}
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            onChange={(event) => {
                                let val = parseInt(event.target.value, 10);
                                if (isNaN(val)) {
                                    // Treat like it's 0
                                    val = 0;
                                }

                                updateClassroom({
                                    ...props.classroom,
                                    GroupSettings: {
                                        ...GroupSettings,
                                        timeSeconds: val * 5,
                                    }
                                })
                            }}
                        />

                        <TextField
                            id="outlined-number"
                            label="Seconds Between Groups"
                            defaultValue={'5'}
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            onChange={(event) => {
                                let val = parseInt(event.target.value, 10);
                                if (isNaN(val)) {
                                    // Treat like it's 0
                                    val = 0;
                                }

                                updateClassroom({
                                    ...props.classroom,
                                    IntermissionSettings: {
                                        ...IntermissionSettings,
                                        timeSeconds: val,
                                    }
                                })
                            }}
                        />
                    </ShowIf>
                </div>
            </Container>
        );
}
