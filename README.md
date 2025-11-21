# Beckman - Sistema de Gestão

Sistema de gerenciamento de clientes e manutenções desenvolvido para a JR Beckman Informática.

## Tecnologias Utilizadas

- **Framework:** Next.js 15 (App Router)
- **Estilização:** Tailwind CSS
- **Banco de Dados:** PostgreSQL (via Neon)
- **ORM:** Prisma
- **Linguagem:** TypeScript

## Como Rodar o Projeto Localmente

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/samuelferreira-trs/beckman-vscode.git](https://github.com/samuelferreira-trs/beckman-vscode.git)
    ```

2.  **Instale as dependências:**
    ```bash
    pnpm install
    ```

3.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env` na raiz do projeto e adicione a URL do seu banco de dados:
    ```env
    DATABASE_URL="sua_string_de_conexao_do_neon"
    ```

4.  **Sincronize o banco de dados:**
    ```bash
    npx prisma db push
    ```

5.  **Inicie o servidor de desenvolvimento:**
    ```bash
    pnpm dev
    ```

O projeto estará rodando em [http://localhost:3000](http://localhost:3000).