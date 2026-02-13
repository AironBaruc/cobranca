import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔐 SENHA
const SENHA_ADMIN = "7952";

// 👨‍👩‍👦 IRMÃOS
const irmaos = [
  { id: 1, nome: "Abilio", divida: 40000 },
  { id: 2, nome: "Alyson", divida: 51000 }
];

// 🔎 SOMENTE LEITURA
const params = new URLSearchParams(window.location.search);
const somenteLeitura = params.get("readonly") === "1";

let pagamentos = [];

async function carregar() {
  pagamentos = [];

  const lista = document.getElementById("lista");
  const select = document.getElementById("irmao");
  const historico = document.getElementById("historico");

  lista.innerHTML = "";
  select.innerHTML = "";
  historico.innerHTML = "";

  const q = query(collection(db, "pagamentos"), orderBy("criadoEm", "asc"));
  const snapshot = await getDocs(q);

  snapshot.forEach(doc => pagamentos.push(doc.data()));

  irmaos.forEach(i => {
    const pagos = pagamentos.filter(p => p.irmaoId === i.id);
    const totalPago = pagos.reduce((a, b) => a + b.valor, 0);
    const falta = i.divida - totalPago;
    const progresso = Math.min((totalPago / i.divida) * 100, 100);

    lista.innerHTML += `
      <div class="card">
        <strong>${i.nome}</strong><br>
        Dívida: R$ ${i.divida}<br>
        Pago: R$ ${totalPago}<br>
        Falta: R$ ${falta}
        <div class="progress">
          <div class="progress-bar" style="width:${progresso}%"></div>
        </div>
      </div>
    `;

    select.innerHTML += `<option value="${i.id}">${i.nome}</option>`;
  });

  pagamentos
    .slice()
    .reverse()
    .forEach(p => {
      const irmao = irmaos.find(i => i.id === p.irmaoId);
      historico.innerHTML += `
        <p>
          <strong>${p.quem}</strong> registrou 
          <strong>R$ ${p.valor}</strong> 
          de ${irmao.nome}<br>
          <small>${p.data}</small>
        </p>
      `;
    });

  if (somenteLeitura) {
    document.getElementById("formPagamento").style.display = "none";
  }
}

window.registrarPagamento = async function () {
  const senha = prompt("Digite a senha:");
  if (senha !== SENHA_ADMIN) {
    alert("Senha incorreta");
    return;
  }

  const irmaoId = Number(document.getElementById("irmao").value);
  const valor = Number(document.getElementById("valor").value);

  if (!valor || valor <= 0) {
    alert("Digite um valor válido");
    return;
  }

  const quem = prompt("Quem fez o depósito?");
  if (!quem) return;

  const data = new Date().toLocaleString("pt-BR");

  await addDoc(collection(db, "pagamentos"), {
    irmaoId,
    valor,
    quem,
    data,
    criadoEm: new Date()
  });

  document.getElementById("valor").value = "";
  carregar();
};

carregar();
