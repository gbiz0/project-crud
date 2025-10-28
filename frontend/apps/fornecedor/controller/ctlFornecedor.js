const axios = require("axios");
const moment = require("moment");

const manutFornecedores = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    let remoteMSG = null;

    const resp = await axios.get(process.env.SERVIDOR_DW3Back + "/api/fornecedores", {
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
      return res.render("fornecedores/view/vwManutFornecedores.njk", {
        title: "Manutenção de Fornecedores",
        data: null,
        erro: remoteMSG,
        userName: userName,
      });
    }

    res.render("fornecedores/view/vwManutFornecedores.njk", {
      title: "Manutenção de Fornecedores",
      data: resp.data.registro,
      erro: null,
      userName: userName,
    });
  })();

const insertFornecedores = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    
    if (req.method == "GET") {
      return res.render("fornecedores/view/vwFCrFornecedores.njk", {
        title: "Cadastro de Fornecedores",
        data: null,
        erro: null,
        userName: userName,
      });

    } else {
      const regData = req.body;
      const token = req.session.token;

      try {
        const response = await axios.post(process.env.SERVIDOR_DW3Back + "/api/fornecedores", regData, {
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

const ViewFornecedores = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        
        const response = await axios.get(
          process.env.SERVIDOR_DW3Back + "/api/fornecedores/" + id,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        if (response.data.status == "ok") {
          res.render("fornecedores/view/vwFRUDrFornecedores.njk", {
            title: "Visualização de Fornecedores",
            data: response.data.registro[0],
            disabled: true,
            userName: userName,
          });
        } else {
          console.log("[ctlFornecedores|ViewFornecedores] ID de fornecedor não localizado!");
        }

      }
    } catch (erro) {
      res.json({ status: "[ctlFornecedores.js|ViewFornecedores] Fornecedor não localizado!" });
      console.log(
        "[ctlFornecedores.js|viewFornecedores] Try Catch: Erro não identificado",
        erro
      );
    }
  })();

const updateFornecedor = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    try {
      if (req.method == "GET") {
        const id = req.params.id;

        const response = await axios.get(
          process.env.SERVIDOR_DW3Back + "/api/fornecedores/" + id,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        if (response.data.status == "ok") {
          res.render("fornecedores/view/vwFRUDrFornecedores.njk", {
            title: "Atualização de dados de Fornecedores",
            data: response.data.registro[0],
            disabled: false,
            userName: userName,
          });
        } else {
          console.log("[ctlFornecedores|updateFornecedor] Dados não localizados");
        }
      } else {
        const regData = req.body;
        const token = req.session.token;
        const fornecedorId = regData.id;

        try {
          const response = await axios.put(process.env.SERVIDOR_DW3Back + "/api/fornecedores/" + fornecedorId, regData, {
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
          console.error('[ctlFornecedores.js|updateFornecedor] Erro ao atualiza dados de fornecedores no servidor backend:', error.message);
          res.json({
            status: "Error",
            msg: error.message,
            data: null,
            erro: error.message,
          });
        }
      }
    } catch (erro) {
      res.json({ status: "[ctlFornecedores.js|updateFornecedor] Fornecedor não localizado!" });
      console.log(
        "[ctlFornecedores.js|updateFornecedor] Try Catch: Erro não identificado",
        erro
      );
    }

  })();

const deleteFornecedor = async (req, res) =>
  (async () => {
    const regData = req.body;
    const token = req.session.token;
    const fornecedorId = regData.id;

    try {
      const response = await axios.delete(process.env.SERVIDOR_DW3Back + "/api/fornecedores/" + fornecedorId, {
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
      console.error('[ctlFornecedores.js|deleteFornecedor] Erro ao deletar dados de fornecedores no servidor backend:', error.message);
      res.json({
        status: "Error",
        msg: error.message,
        data: null,
        erro: error.message,
      });
    }
  })();

module.exports = {
  manutFornecedores,
  insertFornecedores,
  ViewFornecedores,
  updateFornecedor,
  deleteFornecedor
};