"use strict";

// Seleção de elementos do DOM
const pesoInput = document.querySelector("#peso");
const nomeInput = document.querySelector("#nome");
const alturaInput = document.querySelector("#altura");
const tBody = document.querySelector("#cadastro");
const btnCalcular = document.querySelector(".btncontainer").firstElementChild;

const urlApi = `http://localhost:3000/usuarios`;

// Array para armazenar os registros
let arrayPessoas = [];

// Função para calcular o IMC e determinar a situação
const calcularImc = (peso, altura) => {
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

const limparInputs = () => {
  nomeInput.value = "";
  alturaInput.value = "";
  pesoInput.value = "";
};

// Função para validar os campos de entrada
const validarEntradas = () => {
  const nome = nomeInput.value.trim();
  const peso = Number(pesoInput.value.trim());
  const altura = Number(alturaInput.value.trim());

  if (!nome) {
    alert("Nome não pode estar vazio!");
    return false;
  }
  if (!peso || peso <= 0) {
    alert("Peso deve ser um número maior que 0!");
    return false;
  }
  if (!altura || altura <= 0) {
    alert("Altura deve ser um número maior que 0!");
    return false;
  }
  return true;
};

const validarSeUsuarioJaExiste = (usuario) =>
  arrayPessoas.some((element) => element.nome === usuario.nome);

// Função para criar e adicionar um novo registro na tabela
const criarNovoRegistroTabela = (pessoa) => {
  const registroPessoaTabela = document.createElement("tr");
  const trashDeleteTd = document.createElement("td");
  const trashDeleteImg = document.createElement("img");
  trashDeleteImg.setAttribute("src", "assets/icons/trashDeleteIcon.svg");
  trashDeleteImg.classList.add("trash-delete-btn");
  trashDeleteTd.appendChild(trashDeleteImg);

  const pessoaSemId = {
    nome: pessoa.nome,
    altura: pessoa.altura,
    peso: pessoa.peso,
    imc: pessoa.imc,
    situacao: pessoa.situacao,
  };

  Object.values(pessoaSemId).forEach((value) => {
    const novoTd = document.createElement("td");
    novoTd.textContent = value;
    registroPessoaTabela.appendChild(novoTd);
  });

  registroPessoaTabela.appendChild(trashDeleteTd);
  tBody.appendChild(registroPessoaTabela);

  trashDeleteTd.addEventListener("click", () =>
    excluirUsuario(pessoa.id, registroPessoaTabela)
  );
};

// Função para renderizar os usuários na tabela
const renderizarUsuarios = async () => {
  try {
    const response = await fetch(urlApi);
    if (!response.ok) {
      throw new Error("Erro ao buscar dados!");
    }

    const usuarios = await response.json();
    arrayPessoas = usuarios;
    tBody.innerHTML = ""; // Limpa o corpo da tabela antes de renderizar
    arrayPessoas.forEach(criarNovoRegistroTabela);
  } catch (error) {
    alert(error.message);
  }
};

// Função para adicionar uma nova pessoa ao array e atualizar a tabela
const adicionarPessoaALista = async (pessoa) => {
  try {
    const response = await fetch(urlApi, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pessoa),
    });

    if (!response.ok) {
      throw new Error("Erro ao cadastrar!");
    }

    arrayPessoas.push(pessoa);
    criarNovoRegistroTabela(pessoa);
  } catch (error) {
    alert(error.message);
  }
};

// Função para excluir um usuário
const excluirUsuario = async (id, registroElemento) => {
  try {
    const response = await fetch(`${urlApi}/${id}`, { method: "DELETE" });
    if (!response.ok) {
      throw new Error("Erro ao excluir!");
    }

    arrayPessoas = arrayPessoas.filter((element) => element.id !== id);
    registroElemento.remove();
    alert("Excluído com sucesso!");
  } catch (error) {
    alert(error.message);
  }
};

// Função para manipular o envio do formulário
const handleSubmit = (evento) => {
  evento.preventDefault();
  if (!validarEntradas()) return;

  const peso = Number(pesoInput.value);
  const altura = Number(alturaInput.value);
  const { imc, situacao } = calcularImc(peso, altura);

  const pessoa = {
    id: crypto.randomUUID(), // Melhor geração de ID único
    nome: nomeInput.value,
    altura,
    peso,
    imc,
    situacao,
  };

  if (validarSeUsuarioJaExiste(pessoa)) {
    alert("Usuário já cadastrado!");
    return;
  }

  adicionarPessoaALista(pessoa);
  limparInputs();
};

btnCalcular.addEventListener("click", handleSubmit);

// Renderiza os usuários na carga da página
document.addEventListener("DOMContentLoaded", renderizarUsuarios);
