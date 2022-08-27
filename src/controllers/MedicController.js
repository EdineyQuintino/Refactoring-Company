const crypto = require('crypto');
const axios= require('axios');

const connection = require('../database/prismaClient');

const { URL_VIA_CEP } = process.env;

module.exports = {
    async index(request,response) {
        try {
            const medic = await connection.medic.findMany();;

            return response.status(200).json(medic);
        } catch (error) {
            return response.status(400).json({ message: error.message });
        };
    },

    async create(request, response) {
        try {
            const { name, birthdate, cpf, number, crm, specialist, road, housenumber, district, cep, city, uf } = request.body;

            const medicInfo = {    
                id: crypto.randomBytes(4).toString('HEX'),
                name,
                birthdate,
                cpf,
                number,
                crm,
                specialist,
                road,
                housenumber,
                district,
                city,
                cep,
                uf
            };

            if (!road || !city || !uf) {
                const responseViacep = await axios.get(`${URL_VIA_CEP}${cep}/json/`);

                medicInfo.road = responseViacep.data.logradouro;
                medicInfo.district = responseViacep.data.bairro;
                medicInfo.city = responseViacep.data.localidade;
                medicInfo.uf = responseViacep.data.uf;
            };

            await connection('medic').insert(medicInfo);
            return response.status(201).json({ medicInfo });
            
        } catch (error) {
            return response.status(400).json({ message: error.message });
        };
    },

    async filter(request, response) {
        try {
            const { id } = request.params;
            const medic = await connection('medic')
            .innerJoin('patient as p','medic.id','p.medic_id')
            .where( 'medic.id','=', id )
            .select('medic.id as Identificador','medic.name','p.name as pacientes');
            
            if (!medic) {
                return response.status(400).json({ message: error.message });
            } else {
                return response.status(200).json(medic);
            };
        } catch (error) {
            return response.status(400).json({ message: error.message });
        };
    },

    async patch(request, response) {
        try {
            const { id } = request.params;
            const { name, birthdate, cpf, number, crm, specialist, cep, road, housenumber, district, city, uf } = request.body;

            const newRegister = {
                name,
                birthdate,
                cpf,
                number,
                crm,
                specialist,
                road,
                housenumber,
                district,
                city,
                cep,
                uf
            };

            const newUser = await connection('medic').where('id', id).update(newRegister);
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

            await connection('medic')
                .where('id', id)
                .select('medic')
                .first();

            const user = await connection('medic').where('id', id).delete();

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
