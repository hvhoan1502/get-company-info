const { MyError } = require('../helpers/MyError');
const Constants = require('../../plugins/Constants');
const { hash, compare } = require('bcrypt');
const { sign } = require('../helpers/jwt');

class User {
    static async login( userName, password ) {
        // Check password correct or not
        const comparePassword = await compare(password, Constants.Login.passwordHash);
        if (userName != Constants.Login.userName) {
            throw new MyError('Client does not exist', 400, 'INVALID_INFO');
        } else if (!comparePassword) {
            throw new MyError('Password incorrect!', 400, 'INVALID_INFO')
        } else {
            const token = await sign({ _id: Constants.Login._id});
            return { success: true, data: { name: 'hoan', email: 'hvhoan1502@gmail.com', token }};
        }
    }
}

module.exports = { User };