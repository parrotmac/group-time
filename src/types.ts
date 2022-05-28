
export interface IntermissionSettings {
    text: string
    soundEffect?: string
    timeSeconds: number
}

export interface GroupSettings {
    timeSeconds: number
    playCountdown: boolean
}

export class Group {
    public label: string;
    public names: Array<string>;
    public color?: string;

    constructor(label: string, names: Array<string>, color?: string) {
        this.label = label;
        this.names = names;
        this.color = color;
    }
}

export class Activity {
    public name: string;
    public image?: string;
    public color?: string;

    constructor(name: string, image?: string, color?: string) {
        this.name = name;
        this.image = image;
        this.color = color;
    }
}

export enum PlaybackStates {
    STOPPED,
    GROUP_DISPLAY,
    INTERMISSION,
    PAUSED,
}

export interface Classroom {
    PlaybackState: PlaybackStates
    Label: string
    IntermissionSettings: IntermissionSettings
    GroupSettings: GroupSettings
    Groups: Array<Group>
    GroupOffset: number // Which group to start with
    Activities: Array<Activity>
}

export const defaultEmptyClassroom: Classroom = {
    PlaybackState: PlaybackStates.STOPPED,
    Activities: [],
        GroupOffset: 0,
        Groups: [],
        GroupSettings: {
        playCountdown: false,
            timeSeconds: 600,
    },
    IntermissionSettings: {
        text: "",
        timeSeconds: 60,
    },
    Label: "Default"
};
