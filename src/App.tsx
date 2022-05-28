import React, {useEffect} from 'react';
import {BrowserRouter as Router, Link as RouterLink, Route, Switch,} from "react-router-dom";

import './App.css';
import SettingsPane from "./components/SettingsPane";
import PrimaryDisplay from "./components/PrimaryDisplay";
import {Classroom, defaultEmptyClassroom, PlaybackStates} from "./types";
import {
    AppBar,
    Button,
    createStyles,
    Divider,
    IconButton,
    Link,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
    SwipeableDrawer,
    Theme,
    Toolbar,
    Typography
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import SettingsIcon from '@material-ui/icons/Settings';

import APIClient from './common/apiClient';
import {Class} from "@material-ui/icons";

interface IState {
    classroom: Classroom
    drawerOpen: boolean
    timeRemaining: number
}

class App extends React.Component<{}, IState> {
    // private classes = useStyles();
    state = {
        classroom: defaultEmptyClassroom,
        drawerOpen: false,
        timeRemaining: 0,
    }

    private setClassroom = (classroom: Classroom) => {
        this.setState({
            classroom,
        })
    }

    private setDrawerOpen = (open: boolean) => {
        this.setState({
            drawerOpen: open,
        })
    }

    private setTimeRemaining = (timeRemaining: number) => {
        this.setState({
            timeRemaining,
        })
    }

    private persistAndSetClassroom = (classroom: Classroom) => {
        window.localStorage.setItem("default-classroom", JSON.stringify(classroom));
        this.setClassroom(classroom);
    };

    private worker = () => {
        const { classroom, timeRemaining  } = this.state;
//        window.console.log(classroom.PlaybackState);
//        window.console.log(timeRemaining);
        const decrementedTime = timeRemaining - 1;
        const nextClassroom: Classroom = {
            ...classroom,
        };

        if (classroom.PlaybackState === PlaybackStates.GROUP_DISPLAY) {
            if (decrementedTime <= 0) {
                // Do next thing
                nextClassroom.PlaybackState = PlaybackStates.INTERMISSION;

                this.setClassroom(nextClassroom);
                this.setTimeRemaining(classroom.IntermissionSettings.timeSeconds);
                return
            }
            this.setTimeRemaining(decrementedTime)
        }
        if (classroom.PlaybackState === PlaybackStates.INTERMISSION) {
            if (decrementedTime <= 0) {
                // Do next thing
                nextClassroom.PlaybackState = PlaybackStates.GROUP_DISPLAY;
                nextClassroom.GroupOffset++;

                this.setClassroom(nextClassroom);
                this.setTimeRemaining(classroom.GroupSettings.timeSeconds);
                return
            }
            this.setTimeRemaining(decrementedTime)

        }
    };

    private ticker = () => {
        // TODO: Use a shorter interval, but use either math or a timeout to countdown more precisely
        setInterval(this.worker, 1000);
    };

    public componentDidMount(): void {
    	// console.log("Result:", new APIClient("").authenticate("isaac", "parker123"));
        this.ticker();
    }

    private toggleDrawer = (open: boolean) => (
        event: React.KeyboardEvent | React.MouseEvent,
    ) => {
        if (
            event &&
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        this.setDrawerOpen(open);
    };

    private drawerNavigation = () => (
        <div
            // className={this.classes.list}
            role="presentation"
            onClick={this.toggleDrawer(false)}
            onKeyDown={this.toggleDrawer(false)}
        >
            <List>
                <ListItem button key={'main-link'}>
                    {/*<ListItemIcon><SettingsIcon /></ListItemIcon>*/}
                    <Link to={'/'} component={RouterLink}>
                        <ListItemText primary={'Present'}/>
                    </Link>
                </ListItem>
            </List>
            <Divider/>
            <List>
                <ListItem button key={'settings-link'}>
                    <ListItemIcon><SettingsIcon/></ListItemIcon>
                    <Link to={'/settings'} component={RouterLink}>
                        <ListItemText primary={'Settings'}/>
                    </Link>
                </ListItem>
            </List>
        </div>
    );

    private handlePlaybackStateChange = (newState: PlaybackStates) => {
        const { classroom } = this.state;
        const nextClassroom: Classroom = {
            ...classroom,
            PlaybackState: newState,
        };
        console.log("new state", nextClassroom.PlaybackState);
        this.persistAndSetClassroom(nextClassroom);
    };

    public render(): JSX.Element {
        const {drawerOpen, classroom, timeRemaining } = this.state;
        return (
            <div className="App">
                <Router>
                    <div>
                        <AppBar position="static">
                            <Toolbar>
                                <IconButton
                                    edge="start"
                                    // className={this.classes.menuButton}
                                    color="inherit"
                                    aria-label="menu"
                                    onClick={() => this.setDrawerOpen(!drawerOpen)}
                                >
                                    <MenuIcon/>
                                </IconButton>
                                <Typography
                                    variant="h6"
                                    // className={this.classes.title}
                                >
                                    Group Maestro
                                </Typography>
                                <Button color="inherit">Login</Button>
                            </Toolbar>
                        </AppBar>

                        <SwipeableDrawer
                            open={drawerOpen}
                            onClose={this.toggleDrawer(false)}
                            onOpen={this.toggleDrawer(true)}
                        >
                            {this.drawerNavigation()}
                        </SwipeableDrawer>

                        <Switch>
                            <Route path="/settings">
                                <SettingsPane
                                    classroom={classroom}
                                    onChanged={
                                        classroom => this.persistAndSetClassroom(classroom)
                                    }
                                />
                            </Route>
                            <Route path={"/classes/:id"} component={ClassDetail} />
                            <Route path={"/classes"}>
                                <ListClasses />
                            </Route>
                            <Route path="/">
                                <PrimaryDisplay setPlaybackState={this.handlePlaybackStateChange}
                                                timeRemaining={timeRemaining} classroom={classroom}/>
                            </Route>
                        </Switch>
                    </div>
                </Router>
            </div>
        );
    }
}

export default App;

const ListClasses: React.FC = () => {
    const [dbNames, setDbNames] = React.useState([]);

    React.useEffect(() => {
        let headers = new Headers();
        headers.set('Authorization', 'Basic ' + window.btoa("alice:apple"));
        fetch("/userdb-616c696365/_all_docs", {
            credentials: 'include',
            headers: headers,
        })
            .then(resp =>
                resp.json().then(
                    data =>
                        // @ts-ignore
                        setDbNames(data.rows.map((row) => row.id as string))
                ).catch(
                    console.warn
                )
            ).catch(console.warn)
    }, []);

    return (
        <ul>
            {
                dbNames.map(name =>
                    <li>
                        <RouterLink to={`/classes/${name}/`}>{name}</RouterLink>
                    </li>
                )
            }
        </ul>
    );
};

interface IClassDetailProps {
    match: any
}

const ClassDetail: React.FC<IClassDetailProps> = ({match}) => {
    const id_param = match.params.id;
    const [classDetails, setClassDetails] = React.useState();

    React.useEffect(() => {
    let headers = new Headers();
    headers.set('Authorization', 'Basic ' + window.btoa("alice:apple"));
    fetch(`/userdb-616c696365/${id_param}`, {
        credentials: 'include',
        headers: headers,
    })
        .then(resp =>
            resp.json().then(
                data =>
                    // @ts-ignore
                setClassDetails(data)
                    // setClasses(data.rows.map((row) => row.id as string))
            ).catch(
                console.warn
            )
        ).catch(console.warn)
}, []);
return (
    <ul>
        {classDetails ?
            (<li>
                <p>{classDetails.label}</p>
                <ul>Names {classDetails.names.map((n: any) => <li>{n}</li>)}</ul>
            </li>)
            :
            <li>loading...</li>
        }
    </ul>
)
}
