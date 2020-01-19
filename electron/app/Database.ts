import config from './config';
import { Sequelize } from 'sequelize-typescript';
import { AppSetting as SimpleAppSetting } from './models/AppSetting';
import { Settings as SimpleSettings } from './models/Settings';
import { TrackItem as SimpleTrackItem } from './models/TrackItem';
import { logManager } from './log-manager';
const sequelizeCache = require('sequelize-transparent-cache');
const Memcached = require('memcached');
const MemcachedAdaptor = require('sequelize-transparent-cache-memcached');

let logger = logManager.getLogger('Database');

class Database {
    private _sequelize: Sequelize;
    public withCache: any;

    constructor() {
        let dbConfig = config.databaseConfig;

        if (config.isTest === true) {
        } else {
            const memcached = new Memcached('localhost:11211');

            const memcachedAdaptor = new MemcachedAdaptor({
                client: memcached,
                namespace: 'model', // optional
                lifetime: 60 * 60,
            });

            const { withCache: c } = sequelizeCache(memcachedAdaptor);
            this.withCache = c;

            this._sequelize = new Sequelize({
                database: dbConfig.database,
                dialect: 'sqlite',
                username: dbConfig.username,
                password: dbConfig.password,
                storage: dbConfig.outputPath,

                logging: log => logger.info(log),
            });
            this._sequelize.addModels([SimpleAppSetting, SimpleSettings, SimpleTrackItem]);

            logger.info('Models AppSetting', SimpleAppSetting);
            logger.info('Models Settings', SimpleSettings);
            logger.info('Models TrackItem', SimpleTrackItem);
        }
    }

    getSequelize() {
        return this._sequelize;
    }
    getCached() {
        return this.withCache;
    }
}

const database = new Database();
export const sequelize = database.getSequelize();

export const TrackItem = database.withCache(SimpleTrackItem);
export const AppSetting = database.withCache(SimpleAppSetting);
export const Settings = database.withCache(SimpleSettings);
