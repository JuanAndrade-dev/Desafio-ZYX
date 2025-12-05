const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

let caminhoes = [
    // Exemplo
    { 
        id: 1, 
        placa: "ABC-1234", 
        motorista: "Juan Andrade", 
        cpf: "123.456.789-00", 
        tipo_carga: "Carga Seca",
        status: "Em descarga", 
        data_entrada: new Date() 
    }
];

app.get('/api/caminhoes', (req, res) => {
    res.json(caminhoes);
});

app.post('/api/caminhoes', (req, res) => {
    const { placa, motorista, cpf, tipo_carga } = req.body;
    
    if (!placa || !motorista || !cpf || !tipo_carga) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    const novoCaminhao = {
        id: caminhoes.length + 1,
        placa: placa.toUpperCase(),
        motorista,
        cpf,
        tipo_carga,
        status: "Aguardando",
        data_entrada: new Date()
    };

    caminhoes.push(novoCaminhao);
    res.status(201).json(novoCaminhao);
});

app.patch('/api/caminhoes/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const caminhao = caminhoes.find(c => c.id == id);
    
    if (!caminhao) {
        return res.status(404).json({ error: "Caminhão não encontrado" });
    }

    caminhao.status = status;

    if (status === 'Finalizado') {
        caminhao.data_saida = new Date();
    } else {
        caminhao.data_saida = null;
    }

    res.json(caminhao);
});

app.delete('/api/caminhoes/:id', (req, res) => {
    const { id } = req.params;
    
    const index = caminhoes.findIndex(c => c.id == id);

    if (index === -1) {
        return res.status(404).json({ error: "Caminhão não encontrado" });
    }

    caminhoes.splice(index, 1);
    res.status(204).send();
});

app.put('/api/caminhoes/:id', (req, res) => {
    const { id } = req.params;
    const { placa, motorista, cpf, tipo_carga } = req.body;

    const caminhao = caminhoes.find(c => c.id == id);
    
    if (!caminhao) {
        return res.status(404).json({ error: "Caminhão não encontrado" });
    }

    caminhao.placa = placa.toUpperCase();
    caminhao.motorista = motorista;
    caminhao.cpf = cpf;
    caminhao.tipo_carga = tipo_carga;

    res.json(caminhao);
});

app.listen(PORT, () => {
    console.log(`Servidor ZYX rodando em http://localhost:${PORT}`);
});