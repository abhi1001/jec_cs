import { userSchema } from './schema/User';

export const models = (app, mongoose) => {
    userSchema(app, mongoose);
}