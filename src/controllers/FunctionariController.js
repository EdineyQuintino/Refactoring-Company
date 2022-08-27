const crypto = require('crypto');
const axios = require('axios');

const connection = require('../database/prismaClient');

const { URL_VIA_CEP } = process.env;

module.exports = {
    async index(request, response) {
        try {
            const functionari = await connection.functionari.findMany();

            return response.status(200).json(functionari);
        } catch (error) {
            return response.status(400).json({ message: error.message });
        };
    },

    async create(request, response) {
        try {
            const { name, birthdate, cpf, number, office, road, housenumber, district, city, cep, uf } = request.body;

            const functionariInfo = {
                id: crypto.randomBytes(4).toString('HEX'),
                name,
                birthdate,
                cpf,
                number,
                office,
                road,
                housenumber,
                district,
                city,
                cep,
                uf
            };

            if (!road || !city || !uf) {
                const responseViacep = await axios.get(`${URL_VIA_CEP}${cep}/json/`);

                functionariInfo.road = responseViacep.data.logradouro;
                functionariInfo.district = responseViacep.data.bairro;
                functionariInfo.city = responseViacep.data.localidade;
                functionariInfo.uf = responseViacep.data.uf;
            };
            
            await connection('functionari').insert(functionariInfo);
            return response.status(201).json({ functionariInfo });

        } catch (error) {
            return response.status(400).json({ message: error.message });
        };
    },

    async filter(request, response) {
        try {
            const { id } = request.params;
            const functionari = await connection('functionari')
                .where('id', id)
                .first();

            if (!functionari) {
                return response.status(400).json({ message: error.message });
            } else {
                return response.status(200).json(functionari);
            };
        } catch (error) {
            return response.status(400).json({ message: error.message });
        };
    },

    async patch(request, response) {
        try {
            const { id } = request.params;
            const { name, birthdate, cpf, number, agreementnumber, road, housenumber, district, city, uf } = request.body;

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
                uf
            };

            const newUser = await connection('functionari').where('id', id).update(newRegister);
            if (!newUser) {
                return response.status(400).json({ message: error.message });
            } else {
                return response.status(200).json({ message: 'sucesso' });
            };

        } catch (error) {
            return response.status(400).json({ message: error.message });
        };
    },
    async delete(request, response) {
        try {
            const { id } = request.params;

            await connection('functionari')
                .where('id', id)
                .select('functionari')
                .first();

            const user = await connection('functionari').where('id', id).delete();

            if (!user) {
                return response.status(404).json({ message: 'Usuario não localizado' });
            } else {
                return response.status(204).json({ message: 'Exclusão Realizada' });
            };

        } catch (error) {
            return response.status(400).json({ message: error.message });
        };
    }
};
