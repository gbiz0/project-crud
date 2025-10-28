CREATE TABLE
    Fornecedor (
        ID SERIAL PRIMARY KEY,
        Removido BOOLEAN DEFAULT false NOT NULL,
        NomeFantasia VARCHAR(100) NOT NULL,
        RazaoSocial VARCHAR(200),
        CNPJ VARCHAR(18)
    );

CREATE TABLE
    ContaPagar (
        ID SERIAL PRIMARY KEY,
        Removido BOOLEAN DEFAULT false NOT NULL,
        Descricao VARCHAR(255) NOT NULL,
        DataVencimento DATE NOT NULL,
        Valor DECIMAL(10, 2) NOT NULL,
        DataPagamento DATE,
        ValorPago DECIMAL(10, 2),
        FornecedorID INTEGER NOT NULL,
        CONSTRAINT fk_fornecedor FOREIGN KEY (FornecedorID) REFERENCES Fornecedor (ID)
    );

CREATE TABLE
    Usuario (
        ID SERIAL PRIMARY KEY,
        Removido BOOLEAN DEFAULT false NOT NULL,
        Login VARCHAR(50) NOT NULL UNIQUE,
        Senha VARCHAR(255) NOT NULL
    );
