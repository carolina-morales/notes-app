const {
    Schema,
    model
} = require('mongoose');
const bcryptjs = require('bcryptjs');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Agregar metodos
UserSchema.methods.encryptPassword = async password => {
    // Encriptar un password
    // Generar el tipo de encriptado
    const salt = await bcryptjs.genSalt(10);
    // Crear el encriptado
    return await bcryptjs.hash(password, salt);
};

UserSchema.methods.matchPassword = async function (password) {
    // Validar los dos password
    return await bcryptjs.compare(password, this.password);
};

module.exports = model('User', UserSchema);