const axios = require("axios");
const moment = require("moment");

const manutContas = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    let remoteMSG = null;

    const resp = await axios.get(process.env.SERVIDOR_DW3Back + "/api/contas", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }).catch(error => {
      if (error.code === "ECONNREFUSED") {
        remoteMSG = "Servidor indisponível"
      } else if (error.code === "ERR_BAD_REQUEST" || (error.response && error.response.status === 401)) {
        remoteMSG = "Usuário não autenticado";
      } else {
        remoteMSG = error.message;
      }
    });

    if (remoteMSG) {
      return res.render("contas/view/vwManutContas.njk", {
        title: "Manutenção de contas a pagar",
        data: null,
        erro: remoteMSG,
        userName: userName,
      });
    }

    res.render("contas/view/vwManutContas.njk", {
      title: "Manutenção de contas",
      data: resp.data.registro,
      erro: null,
      userName: userName,
    });
  })();

const insertContas = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;

    if (req.method == "GET") {
      try {
        const fornecedores = await axios.get(
          process.env.SERVIDOR_DW3Back + "/api/fornecedores", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        return res.render("contas/view/vwFCrContas.njk", {
          title: "Cadastro de contas",
          data: null,
          erro: null,
          fornecedores: fornecedores.data.registro,
          userName: userName,
        });

      } catch (error) {
        let remoteMSG = error.message;
        if (error.code === "ECONNREFUSED") {
          remoteMSG = "Servidor indisponível"
        } else if (error.code === "ERR_BAD_REQUEST" || (error.response && error.response.status === 401)) {
          remoteMSG = "Usuário não autenticado";
        }
        return res.render("contas/view/vwFCrContas.njk", {
          title: "Cadastro de contas",
          data: null,
          erro: remoteMSG,
          fornecedores: null,
          userName: userName,
        });
      }

    } else {
      const regData = req.body;
      const token = req.session.token;

      try {
        const response = await axios.post(process.env.SERVIDOR_DW3Back + "/api/contas", regData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          timeout: 5000,
        });

        res.json({
          status: response.data.status,
          msg: response.data.status,
          data: response.data,
          erro: null,
        });
      } catch (error) {
        console.error('Erro ao inserir dados no servidor backend:', error.message);
        res.json({
          status: "Error",
          msg: error.message,
          data: null,
          erro: error.message,
        });
      }
    }
  })();

const ViewContas = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        
        const response = await axios.get(
          process.env.SERVIDOR_DW3Back + "/api/contas/" + id,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (response.data.status == "ok") {
          const fornecedores = await axios.get(
            process.env.SERVIDOR_DW3Back + "/api/fornecedores", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          });

          if (response.data.registro[0].datavencimento) {
            response.data.registro[0].datavencimento = moment(response.data.registro[0].datavencimento).format(
              "YYYY-MM-DD"
            );
          }
          if (response.data.registro[0].datapagamento) {
            response.data.registro[0].datapagamento = moment(response.data.registro[0].datapagamento).format(
              "YYYY-MM-DD"
            );
          }

          res.render("contas/view/vwFRUDrContas.njk", {
            title: "Visualização de contas",
            data: response.data.registro[0],
            disabled: true,
            fornecedores: fornecedores.data.registro,
            userName: userName,
          });
        } else {
          console.log("[ctlContas|ViewContas] ID de conta não localizado!");
        }
      }
    } catch (erro) {
      console.log(
        "[ctlContas.js|viewContas] Try Catch: Erro não identificado",
        erro
      );
      res.json({ status: "[ctlContas.js|ViewContas] Conta não localizada!" });
    }
  })();

const updateConta = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        
        const response = await axios.get(
          process.env.SERVIDOR_DW3Back + "/api/contas/" + id,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (response.data.status == "ok") {
          const fornecedores = await axios.get(
            process.env.SERVIDOR_DW3Back + "/api/fornecedores", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          });

          if (response.data.registro[0].datavencimento) {
            response.data.registro[0].datavencimento = moment(response.data.registro[0].datavencimento).format(
              "YYYY-MM-DD"
            );
          }
          if (response.data.registro[0].datapagamento) {
            response.data.registro[0].datapagamento = moment(response.data.registro[0].datapagamento).format(
              "YYYY-MM-DD"
            );
          }

          res.render("contas/view/vwFRUDrContas.njk", {
            title: "Atualização de dados de contas",
            data: response.data.registro[0],
            disabled: false,
            fornecedores: fornecedores.data.registro,
            userName: userName,
          });
        } else {
          console.log("[ctlContas|updateConta] Dados não localizados");
        }
      } else {
        const regData = req.body;
        const token = req.session.token;
        const contaId = regData.id; 

        try {
          const response = await axios.put(process.env.SERVIDOR_DW3Back + "/api/contas/" + contaId, regData, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            timeout: 5000,
          });

          res.json({
            status: response.data.status,
            msg: response.data.status,
            data: response.data,
            erro: null,
          });
        } catch (error) {
          console.error('[ctlContas.js|updateConta] Erro ao atualiza dados de contas no servidor backend:', error.message);
          res.json({
            status: "Error",
            msg: error.message,
            data: null,
            erro: error.message,
          });
        }
      }
    } catch (erro) {
      console.log(
        "[ctlContas.js|updateConta] Try Catch: Erro não identificado",
        erro
      );
      res.json({ status: "[ctlContas.js|updateConta] Conta não localizada!" });
    }
  })();

const deleteConta = async (req, res) =>
  (async () => {
    const regData = req.body;
    const token = req.session.token;
    const contaId = regData.id;

    try {
      const response = await axios.delete(process.env.SERVIDOR_DW3Back + "/api/contas/" + contaId, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        timeout: 5000,
      });

      res.json({
        status: response.data.status,
        msg: response.data.status,
        data: response.data,
        erro: null,
      });
    } catch (error) {
      console.error('[ctlContas.js|deleteConta] Erro ao deletar dados de contas no servidor backend:', error.message);
      res.json({
        status: "Error",
        msg: error.message,
        data: null,
        erro: error.message,
      });
    }
  })();

module.exports = {
  manutContas,
  insertContas,
  ViewContas,
  updateConta,
  deleteConta
};