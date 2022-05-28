import React, {Component} from 'react';
import {Activity, Group} from "../types";

interface IProps {
    activity: Activity
    group: Group
}

class AssignmentDisplay extends Component<IProps> {
    public render(): JSX.Element {
        const {
            group,
            activity,
        } = this.props;
        return (
            <div>
                <div>Group: {group.label}
                <p>Participants:</p>
                    <ul>
                        {group.names.map(name => <li>{name}</li>)}
                    </ul>
                </div>
                <p>Activity: {activity.name}</p>
            </div>
        )
    }
}

export default AssignmentDisplay