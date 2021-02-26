import { JL } from 'jsnlog';

export class Logger {
    static loggers: {
        [s: string]: Logger;
    } = {};

    private logger: JL.JSNLogLogger;

    constructor(
        name?: string,
        expose = process.env.REACT_APP_DEBUG_MODE === 'development'
    ) {
        const appenders: JL.JSNLogAppender[] = [];
        if (name && expose) {
            let inline = JL.createConsoleAppender(name);
            if (inline.setOptions)
                inline = inline.setOptions({
                    batchSize: 4,
                    batchTimeout: 1000,
                });
            appenders.push(inline);
        }
        this.logger = JL(name).setOptions({
            appenders,
        });
    }

    log(args: any) {
        return this.logger.info(args);
    }

    info(args: any) {
        return this.logger.info(args);
    }

    verbose(args: any) {
        return this.logger.debug(args);
    }

    warn(args: any) {
        return this.logger.warn(args);
    }

    error(args: any) {
        return this.logger.error(args);
    }

    fatal(args: any) {
        return this.logger.fatal(args);
    }

    getLogger(name: string): Logger {
        if (typeof Logger.loggers[name] === 'undefined')
            Logger.loggers[name] = new Logger(name);
        return Logger.loggers[name];
    }
}

export default new Logger();
