import {Injectable} from '@nestjs/common';
import {
    MongooseOptionsFactory,
    MongooseModuleOptions,
} from '@nestjs/mongoose';

@Injectable()
export default class MongooseConfigService implements MongooseOptionsFactory {
    createMongooseOptions(): MongooseModuleOptions {
        return {
            uri: process.env.MONGO_URI,
        };
    }
}
