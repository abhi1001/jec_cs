var schema = {
    firstName:{
        type: String
    },
    lastName:{
        type: String
    },
    email: {
		type: String,
		unique: true
	},
	password: {
		type: String
	},
	phoneNumber: {
		type: String,
		sparse: true,
		unique: true,
		default: null
	},
	userType: {
		type: String,
		required: true,
		default: "user"
	},
	resetPasswordToken: String,
	emailVerificationCode: String,
	resetPasswordExpires: Date,
	emailVerificationStatus: {
		type: Boolean,
		required: true,
		default: false
	},
	token: String,
	passwordVerificationToken: String,
	passwordVerificationExpiration: Date,
	firstName: String,
	lastName: String,
	createdAt: {
		type: Date,
		default: new Date()
	}
}

export const getSchema = () => {
	return schema;
}


export const userSchema = (app, mongoose) => {
	const _schema = schema;

	var UserSchema = new mongoose.Schema(_schema);

	UserSchema.index({
		_id: 1
	});
	UserSchema.set('autoIndex', (app.get('env') === 'development'));
	UserSchema.methods.validPassword = function (password) {
		if (!this.password) {
			return false;
		}
		return app.bcrypt.compareSync(password, this.password);
	};


	UserSchema.pre('save', function (next) {
		var user = this;
		var SALT_FACTOR = 5;

		if (!user.isModified('password')) return next();

		app.bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
			if (err) return next(err);
			app.bcrypt.hash(user.password, salt, function (err, hash) {
				if (err) return next(err);
				user.password = hash;
				next();
			});
		});
	});

	app.db.model('User', UserSchema);

};