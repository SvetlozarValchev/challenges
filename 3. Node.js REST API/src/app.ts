import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Validator } from 'jsonschema';

import * as schema from './schema.json';
import * as utils from './utils';
import { JobState, JobProcessTime, Job, ExportJob, ImportJob } from './job';

enum APIResponseStatus {
    Success = "success",
    Fail = "fail",
    Error = "error"
}

class App {
    private express: express.Application;

    private validator: Validator;

    private jobs: Job[] = [];

    constructor() {
        this.express = express();
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({extended: true}));

        this.validator = new Validator();

        this.mountRoutes();

        setInterval(this.processJobs.bind(this), 1000);
    }

    static apiResponse(res: express.Response, status: APIResponseStatus, data: object = null) {
        res.send({
            status,
            data
        });
    }

    public start(): void {
        const port = process.env.PORT || 3000;

        this.express.listen(port, (err) => {
            if (err) {
                return console.log(err)
            }

            return console.log(`server is listening on ${port}`)
        });
    }

    private mountRoutes(): void {
        const router: express.Router = express.Router();

        router.post('/CreateExportJob', (req: express.Request, res: express.Response) => {
            const validator = this.validator.validate(req.body, schema.export);

            if (validator.valid) {
                this.jobs.push(new ExportJob(req.body.bookId, req.body.type));

                App.apiResponse(res, APIResponseStatus.Success, null);
            } else {
                App.apiResponse(res, APIResponseStatus.Fail, {
                    errors: validator.errors.map((err) => `${err.property} ${err.message}`)
                });
            }
        });

        router.post('/CreateImportJob', (req: express.Request, res: express.Response) => {
            const validator = this.validator.validate(req.body, schema.export);

            if (validator.valid) {
                this.jobs.push(new ExportJob(req.body.bookId, req.body.type));

                App.apiResponse(res, APIResponseStatus.Success);
            } else {
                App.apiResponse(res, APIResponseStatus.Fail, {
                    errors: validator.errors.map((err) => `${err.property} ${err.message}`)
                });
            }
        });

        router.get('/ListImportJobs', (req: express.Request, res: express.Response) => {
            const importJobs = this.jobs
                .filter((job: Job) => job instanceof ImportJob)
                .map((job: Job) => job.describe());

            App.apiResponse(res, APIResponseStatus.Success, utils.groupBy(importJobs, 'state'));
        });

        router.get('/ListExportJobs', (req: express.Request, res: express.Response) => {
            const exportJobs = this.jobs
                .filter((job: Job) => job instanceof ExportJob)
                .map((job: Job) => job.describe());

            App.apiResponse(res, APIResponseStatus.Success, utils.groupBy(exportJobs, 'state'));
        });

        this.express.use('/api/', router)
    }

    private processJobs(): void {
        const dtNow = Date.now();

        this.jobs.forEach((job: Job, jobIdx: number) => {
            let type;

            if (job instanceof ImportJob) {
                type = 'import';
            } else if (job instanceof ExportJob) {
                type = 'export';
            }

            if (!type) {
                console.error('Job type not recognized');
                return;
            }

            const time = JobProcessTime[type][job.getType()] * 1000;

            if (job.getCreatedAt() + time < dtNow) {
                this.jobs[jobIdx].state = JobState.Finished;
            }
        });
    }
}

export default new App();
