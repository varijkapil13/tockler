import { logManager } from '../log-manager';
import * as randomcolor from 'randomcolor';

import { AppSetting } from '../Database';
import { AppSetting as AppSettingType } from '../models/AppSetting';

export class AppSettingService {
    logger = logManager.getLogger('AppSettingService');

    async createAppSetting(appSettingAttributes: any): Promise<AppSettingType> {
        const appSetting: AppSettingType = await AppSetting.create(appSettingAttributes);

        this.logger.info(`Created appSetting with title ${appSettingAttributes.name}.`);
        return appSetting;
    }

    async retrieveAppSetting(name: string): Promise<AppSettingType> {
        let appSetting = await AppSetting.findOne({ where: { name: name } });
        if (appSetting) {
            this.logger.info(`Retrieved appSetting with name ${name}.`);
        } else {
            this.logger.info(`AppSetting with name ${name} does not exist.`);
        }

        return appSetting;
    }

    async retrieveAppSettings(params: any): Promise<Array<AppSettingType>> {
        let appSettings = await AppSetting.cache('AppSetting.findAll').findAll(params);
        this.logger.debug('Retrieved all appSettings.');
        return appSettings;
    }

    async getAppColor(appName) {
        let params = {
            where: {
                name: appName,
            },
        };

        const appSettings: Array<AppSettingType> = await this.retrieveAppSettings(params);
        if (appSettings.length > 0) {
            return appSettings[0].color;
        } else {
            let color = randomcolor();
            let item = await this.createAppSetting({ name: appName, color: color });
            this.logger.info('Created color item to DB:', item);

            return color;
        }
    }

    async changeColorForApp(appName: string, color: string) {
        let params = {
            where: {
                name: appName,
            },
        };

        this.logger.debug('Quering color with params:', params);

        const appSettings: Array<AppSettingType> = await this.retrieveAppSettings(params);
        if (appSettings.length > 0) {
            appSettings[0].color = color;
            appSettings[0].save();
            this.logger.info('Saved color item to DB:', appSettings[0]);

            return appSettings[0];
        } else {
            const item = await this.createAppSetting({ name: appName, color: color });
            this.logger.info('Created color item to DB:', item);
            return item;
        }
    }
}

export const appSettingService = new AppSettingService();
