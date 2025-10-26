
import express from 'express';


const app = express();
const port = 3000;
const host ="0.0.0.0";



app.get('/', (req, res) => {
  const { idade, sexo, salario_base, anoContratacao, matricula } = req.query;

  // Se não houver parâmetros, exibe exemplo
  if (!idade || !sexo || !salario_base || !anoContratacao || !matricula) {
    return res.send(`
      <h2>Calculadora de Reajuste Salarial</h2>
      <p>Informe os dados na URL conforme o exemplo abaixo:</p>
      <p><b>Exemplo:</b> http://localhost:3000/?idade=25&sexo=F&salario_base=2000&anoContratacao=2015&matricula=12345</p>
      <p>Após enviar, o servidor calculará o reajuste e exibirá o resultado.</p>
    `);
  }

  // Conversão e validações
  const idadeNum = parseInt(idade, 10);
  const salarioNum = parseFloat(salario_base.replace(',', '.'));
  const anoNum = parseInt(anoContratacao, 10);
  const matriculaNum = parseInt(matricula, 10);
  const anoAtual = new Date().getFullYear();
  const tempoEmpresa = anoAtual - anoNum;

  if (Number.isNaN(idadeNum) || Number.isNaN(salarioNum) || Number.isNaN(anoNum) || Number.isNaN(matriculaNum)) {
    return res.send("<h3>Dados inválidos: algum parâmetro não é numérico. Verifique e tente novamente.</h3>");
  }

  if (idadeNum < 16) {
    return res.send("<h3>Idade inválida: deve ser maior que 16 anos.</h3>");
  }
  if (anoNum <= 1960) {
    return res.send("<h3>Ano de contratação inválido: deve ser maior que 1960.</h3>");
  }
  if (salarioNum <= 0) {
    return res.send("<h3>Salário base deve ser um número real maior que zero.</h3>");
  }
  if (matriculaNum <= 0) {
    return res.send("<h3>Matrícula deve ser um inteiro maior que zero.</h3>");
  }

  // Arruma sexo para maiúscula
  const sexoUpper = String(sexo).toUpperCase();
  if (sexoUpper !== 'M' && sexoUpper !== 'F') {
    return res.send("<h3>Sexo inválido: use 'M' ou 'F'.</h3>");
  }

  // Declara e incializa reajuste, desconto e acréscimo
  let reajuste = 0;
  let desconto = 0;
  let acrescimo = 0;

  if (idadeNum >= 18 && idadeNum <= 39) {
    reajuste = sexoUpper === 'M' ? 10 : 8;
    desconto  = sexoUpper === 'M' ? 10 : 11;
    acrescimo = sexoUpper === 'M' ? 17 : 16;
  } else if (idadeNum >= 40 && idadeNum <= 69) {
    reajuste = sexoUpper === 'M' ? 8 : 10;
    desconto  = sexoUpper === 'M' ? 5 : 7;
    acrescimo = sexoUpper === 'M' ? 15 : 14;
  } else if (idadeNum >= 70 && idadeNum <= 99) {
    reajuste = sexoUpper === 'M' ? 15 : 17;
    desconto  = sexoUpper === 'M' ? 15 : 17;
    acrescimo = sexoUpper === 'M' ? 13 : 12;
  } else {
    // Faixa etária fora da tabela
    return res.send("<h3>Idade fora do intervalo suportado (18-99 anos).</h3>");
  }

  // Cálcula o novo salário
  let salarioReajustado = salarioNum + (salarioNum * (reajuste / 100));
  salarioReajustado += (tempoEmpresa > 10 ? acrescimo : -desconto);

  res.send(`
    <h2>Resultado do Reajuste Salarial</h2>
    <p><b>Matrícula:</b> ${matriculaNum}</p>
    <p><b>Sexo:</b> ${sexoUpper}</p>
    <p><b>Idade:</b> ${idadeNum}</p>
    <p><b>Salário Base:</b> R$ ${salarioNum.toFixed(2)}</p>
    <p><b>Ano de Contratação:</b> ${anoNum}</p>
    <p><b>Tempo de Empresa:</b> ${tempoEmpresa} anos</p>
    <p><b>Reajuste:</b> ${reajuste}%</p>
    <p><b>Desconto:</b> R$ ${desconto.toFixed(2)}</p>
    <p><b>Acréscimo:</b> R$ ${acrescimo.toFixed(2)}</p>
    <h3>Salário Reajustado: R$ ${salarioReajustado.toFixed(2)}</h3>
  `);
});


app.listen(port, host, () => console.log(`Servidor rodando em http://${host}:${port}`));
