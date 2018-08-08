import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as schema from './schema.json';
import { Validator } from 'jsonschema';

class App {
    private express: express.Application;
    private validator: Validator;

    private jobs: Jobs;

    constructor() {
        this.express = express();
        this.validator = new Validator();

        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({extended: true}));

        this.mountRoutes();

        // Depending on scale and precision, advanced Schedulers might be required
        setInterval(this.updateJobs, 1000);
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

    private updateJobs(): void {

    }

    private mountRoutes(): void {
        const router: express.Router = express.Router();

        router.get('/newExport', (req: express.Request, res: express.Response) => {
            res.sendStatus(404);
        });

        this.express.use('/api/', router)
    }
}

export default new App();
