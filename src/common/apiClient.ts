import { Classroom } from "../types";

enum APIEndpoints {
    Authenticate = '/_session'
}

export interface ClassroomsRowsListing {
    total_rows: number;
    offset:     number;
    rows:       Row[];
}

export interface Row {
    id:    string;
    key:   string;
    value: Value;
    doc:   Doc;
}

export interface Doc {
    _id:      string;
    _rev:     string;
    nickname: string;
    classroom: Classroom;
}

export interface Value {
    rev: string;
}


const hexify = (str: string): string => str.split('').map(char => {
    return ("0" + char.charCodeAt(0).toString(16)).slice(-2);
}).join('');

export default class APIClient {
    private baseURL: string;
    private userDBPath?: string;

    constructor(baseURL: string)  {
        this.baseURL = baseURL;
    }

    authenticate = (username: string, password: string): Promise<void> => {
        const data = {"username": username, "password": password};

        return new Promise<void>(((resolve, reject) => {
            fetch(APIEndpoints.Authenticate, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('Success:', data);

                    // Cool, totally not hacky
                    this.userDBPath = `userdb-${hexify(username)}`;

                    resolve();
                    return;
                })
                .catch((error) => {
                    console.error('Error:', error);
                    reject(error)
                });
        }));
    };

    listClassrooms = (): Promise<Array<Classroom>> => {
        return new Promise<Array<Classroom>>(((resolve, reject) => {
            fetch(`/${this.userDBPath}/_all_docs?inclue_docs=true`, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('Success:', data);
                    const resp: ClassroomsRowsListing = data;
                    resolve(resp.rows.map((row: Row) => row.doc.classroom));
                    return;
                })
                .catch((error) => {
                    console.error('Error:', error);
                    reject(error)
                });
        }));
    }

}
