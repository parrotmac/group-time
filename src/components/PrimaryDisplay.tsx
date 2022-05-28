import React from 'react';

import {Classroom, PlaybackStates} from "../types";
import {isNil} from 'lodash';
import AssignmentDisplay from "./AssignmentDisplay";
import {Button} from "@material-ui/core";

interface IPrimaryDisplayProps {
    classroom: Classroom;
    timeRemaining: number;
    setPlaybackState: (newState: PlaybackStates) => void
}

const PrimaryDisplay: React.FC<IPrimaryDisplayProps> = (props: IPrimaryDisplayProps) => {
    const { classroom: { Groups, GroupOffset, Activities, PlaybackState }, timeRemaining, setPlaybackState } = props;

    if (Groups.length !== Activities.length) {
        // TODO: Use a common warning
        return <h3>Please ensure there are the same number of Groups and Activities</h3>
    }

    let offsetGroups = [...Groups];
    for (let i = 0; i < GroupOffset; i++) {
        const shiftedGroup = offsetGroups.shift();
        if (isNil(shiftedGroup)) {
            continue
        }
        offsetGroups.push(shiftedGroup);
    }
    const activities = [...Activities];

    const assignments = offsetGroups.map((group, groupIdx) => {
        return <AssignmentDisplay activity={activities[groupIdx]} group={group} />
    });

    if (PlaybackState === PlaybackStates.STOPPED) {
        return <>
            <h4>Get Ready!</h4>
            <Button onClick={() => setPlaybackState(PlaybackStates.GROUP_DISPLAY)}>Start</Button>
        </>;
    }

    if (PlaybackState === PlaybackStates.INTERMISSION) {
        return <>
            <h4>Get ready for the next group!</h4>
            <p>Time Remaining: {timeRemaining}</p>
        </>;
    }

    return <div className={'PrimaryDisplay'}>
        {assignments}
        <p>Time Remaining: {timeRemaining}</p>
    </div>
};

export default PrimaryDisplay
