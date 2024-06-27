"use strict";

// Seleção de elementos do DOM
const pesoInput = document.querySelector("#peso");
const nomeInput = document.querySelector("#nome");
const alturaInput = document.querySelector("#altura");
const tBody = document.querySelector("#cadastro");
const btnCalcular = document.querySelector(".btncontainer").firstElementChild;

// Array para armazenar os registros
let arrayPessoas = [];

// Função para calcular o IMC e determinar a situação
const calcularImc = (peso = 0, altura = 0) => {
  const imc = peso / (altura * altura);
  let situacao = "";

  if (imc <= 16.9) {
    situacao = "Muito abaixo do peso";
  } else if (imc <= 18.4) {
    situacao = "Abaixo do peso";
  } else if (imc <= 24.9) {
    situacao = "Normal";
  } else if (imc <= 29.9) {
    situacao = "Acima do peso";
  } else if (imc <= 34.9) {
    situacao = "Obesidade grau 1";
  } else if (imc <= 40) {
    situacao = "Obesidade grau 2";
  } else {
    situacao = "Obesidade grau 3";
  }

  return { imc: imc.toFixed(2), situacao };
};

// Função para validar os campos de entrada
const validarEntradas = () => {
  return (
    nomeInput.value.trim() === "" ||
    pesoInput.value.trim() === "" ||
    alturaInput.value.trim() === "" ||
    Number(pesoInput.value) === 0 ||
    Number(alturaInput.value) === 0
  );
};

// Função para criar e adicionar um novo registro na tabela
const criarNovoRegistroTabela = (pessoa) => {
  const registroPessoaTabela = document.createElement("tr");
  for (const propriedade in pessoa) {
    const novoTd = document.createElement("td");
    novoTd.textContent = pessoa[propriedade];
    registroPessoaTabela.appendChild(novoTd);
  }
  tBody.appendChild(registroPessoaTabela);
};

// Função para renderizar os usuários na tabela
const renderizarUsuarios = () => {
  tBody.innerHTML = ""; // Limpa o corpo da tabela antes de renderizar
  arrayPessoas.forEach((pessoa) => criarNovoRegistroTabela(pessoa));
};

// Função para adicionar uma nova pessoa ao array e atualizar a tabela
const adicionarPessoaALista = (pessoa) => {
  arrayPessoas.push(pessoa);
  criarNovoRegistroTabela(pessoa);
};

// Função para manipular o envio do formulário
const handleSubmit = (evento) => {
  evento.preventDefault();

  if (validarEntradas()) {
    alert("Preencha os campos corretamente!");
    return;
  }

  const peso = Number(pesoInput.value);
  const altura = Number(alturaInput.value);

  const { imc, situacao } = calcularImc(peso, altura);

  const pessoa = {
    nome: nomeInput.value,
    altura,
    peso,
    imc,
    situacao,
  };

  adicionarPessoaALista(pessoa);
};

btnCalcular.addEventListener("click", handleSubmit);

// Renderiza os usuários na carga da página
document.addEventListener("DOMContentLoaded", renderizarUsuarios);
