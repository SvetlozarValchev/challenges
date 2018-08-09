export enum JobState {
    Pending = "pending",
    Failed = "failed",
    Finished = "finished"
}

export const JobProcessTime = {
    'export': {
        'epub': 10,
        'pdf': 25,
    },
    'import': {
        'word': 60,
        'pdf': 60,
        'wattpad': 60,
        'evernote': 60
    }
};

export abstract class Job {
    protected bookId: string;

    protected type: string;

    protected created_at: number;

    public state: JobState;

    constructor(bookId: string, type: string) {
        this.bookId = bookId;
        this.type = type;
        this.state = JobState.Pending;
        this.created_at = Date.now();
    }

    public getType(): string {
        return this.type;
    }

    public getCreatedAt(): number {
        return this.created_at;
    }

    public describe(): object {
        throw new Error('Method describe() is not implemented.');
    }
}

export class ExportJob extends Job {
    public describe(): object {
        return {
            bookId: this.bookId,
            type: this.type,
            state: this.state
        };
    }
}

export class ImportJob extends Job {
    private url: string;

    constructor(bookId: string, type: string, url: string) {
        super(bookId, type);

        this.url = url;
    }

    public describe(): object {
        return {
            bookId: this.bookId,
            type: this.type,
            url: this.url,
            state: this.state
        };
    }
}
