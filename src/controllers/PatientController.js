const crypto = require('crypto');
const axios = require('axios');

const connection = require('../database/prismaClient');

const { URL_VIA_CEP } = process.env;

module.exports = {
    async index(request,response) {
        try {
            const patient = await connection('patient').select('*');

            return response.status(200).json(patient);
        } catch (error) {
            return response.status(400).json({ message: error.message });
        };
    },

    async create(request, response) {
        try {
            const { name, birthdate, cpf, number, agreementnumber, road, housenumber, district, city, cep, uf, medic_id } = request.body;

            const patientInfo = {
                id: crypto.randomBytes(4).toString('HEX'),
                name,
                birthdate,
                cpf,
                number,
                agreementnumber,
                road,
                housenumber,
                district,
                city,
                cep,
                uf,
                medic_id
            };

            if (!road || !city || !uf) {
                const responseViacep = await axios.get(`${URL_VIA_CEP}${cep}/json/`);

                patientInfo.road = responseViacep.data.logradouro;
                patientInfo.district = responseViacep.data.bairro;
                patientInfo.city = responseViacep.data.localidade;
                patientInfo.uf = responseViacep.data.uf;
            };

            await connection('patient').insert(patientInfo);
            return response.status(201).json({ patientInfo });

        } catch (error) {
            return response.status(400).json({ message: error.message });
        };
    },

    async filter(request, response) {
        try {
            const { id } = request.params;
            const patient = await connection('patient')
                .where('id', id)
                .first();

            if (!patient) {
                return response.status(400).json({ message: error.message });
            } else {
                return response.status(200).json(patient);
            };

        } catch (error) {
            return response.status(400).json({ message: error.message });
        };
    },

    async patch(request, response) {
        try {

            const { id } = request.params;
            const { name, birthdate, cpf, number, agreementnumber, road, housenumber, district, city, uf, medic_id } = request.body;

            const newRegister = {
                name,
                birthdate,
                cpf,
                number,
                agreementnumber,
                road,
                housenumber,
                district,
                city,
                uf,
                medic_id
            };

            const newUser = await connection('patient').where('id', id).update(newRegister);
            if (!newUser) {
                return response.status(400).json({ message: error.message });
            } else {
                return response.status(200).json({ message: 'sucesso' });
            }

        } catch (error) {
            return response.status(400).json({ message: error.message });
        };
    },

    async delete(request, response) {
        try {
            const { id } = request.params;

            await connection('patient')
                .where('id', id)
                .select('patient')
                .first();

            const user = await connection('patient').where('id', id).delete();
            if (!user) {
                return response.status(404).json({ message: 'Usuario não localizado' });
            } else {
                return response.status(204).json({ message: 'Exclusão Realizada' });
            };

        } catch (error) {
            console.log(error);
            return response.status(400).json({ message: error.message });
        };
    }
};
