import express from 'express';
import tabela2024 from '../src/database/tabela.js';
import { modeloAtualizacaoTime, modeloTime } from "../src/utils/validacao.js";

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send(tabela2024);
});

app.get('/:sigla', (req, res) => {
  const siglaInformada = req.params.sigla.toUpperCase();
  const time = tabela2024.find((infoTime) => infoTime.sigla === siglaInformada);
  if (!time) {
    res.status(404).send('Não existe na série A do brasileirão um time com a sigla informada!');
    return;
  }
  res.status(200).send(time);
});

app.put('/:sigla', (req, res) => {
  const siglaInformada = req.params.sigla.toUpperCase();
  const timeSelecionado = tabela2024.find((t) => t.sigla === siglaInformada);
  if (!timeSelecionado) {
    res.status(404).send('Não existe na área A do brasileirão um time com a sigla informada!');
    return;
  }
  const { error } = modeloAtualizacaoTime.validate(req.body);
  if (error) {
    res.status(400).send(error);
    return;
  }
  const campos = Object.keys(req.body);
  for (let campo of campos) {
    timeSelecionado[ campo ] = req.body[ campo ]
  }
  res.status(200).send(timeSelecionado);
});

app.post('/', (req, res) => {
  const novoTime = req.body;
  const { error } = modeloTime.validate(novoTime);
  if (error) {
    res.status(400).send(error);
    return;
  }
  tabela2024.push(novoTime);
  res.status(200).send(novoTime);
})

app.delete('/:sigla', (req, res) => {
  const siglaInformada = req.params.sigla.toUpperCase();
  const indiceTimeSelecionado = tabela2024.findIndex((t) => t.sigla === siglaInformada);
  if (indiceTimeSelecionado === -1) {
    res.status(404).send('Não existe na área A do brasileirão um time com a sigla informada!');
    return;
  }
  const timeRemovido = tabela2024.splice(indiceTimeSelecionado, 1);
  res.status(200).send(timeRemovido);
})

app.listen(3333, () => console.log('🚀 servidor rodando com sucesso'));


