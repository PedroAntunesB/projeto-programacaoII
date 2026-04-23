import { ToDo } from "./core";
import { Item } from "./core";

// Adicione validação de campos: Implemente validação nos endpoints para garantir que os dados enviados possuem os campos obrigatórios e tipos corretos. Retorne um código de status 400 (Bad Request) quando a validação falhar.

// Implemente paginação: Modifique o endpoint GET /contatos para aceitar parâmetros de query ?page=1&limit=10, retornando apenas os registros solicitados.

// Adicione filtros REST: Crie um novo endpoint /contatos/buscar?nome=... para filtrar contatos por nome usando a API REST.

// Implemente tratamento de conflitos: No endpoint PUT ou PATCH, adicione validação para evitar sobrescrever dados e retorne 409 (Conflict) quando necessário.

// Adicione logging de requisições: Crie um middleware que registra em console cada requisição recebida (método, endpoint, status da resposta) para fins de debugging.

const filepath = "./lista.json";
const todo = new ToDo(filepath);
const port = 6767;

const server = Bun.serve({
  port: port,
  async fetch(request: Request) {
    const url = new URL(request.url);
    const method = request.method;
    const pathname = url.pathname;
    const searchParams = url.searchParams;

    // GET /items - listar todos os itens
    if (pathname === "/items" && method === "GET") {
      const items = await todo.getItems();
      const itemsData = items.map((item) => item.toJSON());
      return new Response(JSON.stringify(itemsData), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (pathname == "/items/buscar" && method === "GET") {
      const description = String(searchParams.get("description") || "");
      if (!description) {
        return new Response(JSON.stringify({ error: "Invalid description" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const items = await todo.getItems();
      const itemsFiltered = items.filter(
        (i: Item) => i.description === description,
      );

      return new Response(JSON.stringify(itemsFiltered), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // POST /items - adicionar novo item
    if (pathname === "/items" && method === "POST") {
      try {
        const body = await request.json();
        const { description }: any = body;

        if (!description) {
          return new Response(
            JSON.stringify({ error: "Description is required" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        const item = new Item(description);
        await todo.addItem(item);

        return new Response(
          JSON.stringify({
            message: "Item added successfully",
            item: item.toJSON(),
          }),
          {
            status: 201,
            headers: { "Content-Type": "application/json" },
          },
        );
      } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to add item" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // PUT /items?index=0 - atualizar item
    if (pathname === "/items" && method === "PUT") {
      try {
        const index = parseInt(searchParams.get("index") || "");

        if (isNaN(index)) {
          return new Response(
            JSON.stringify({ error: "Invalid index parameter" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        const body = await request.json();
        const { description }: any = body;

        if (!description) {
          return new Response(
            JSON.stringify({ error: "Description is required" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        const item = new Item(description);
        await todo.updateItem(index, item);

        return new Response(
          JSON.stringify({
            message: "Item updated successfully",
            item: item.toJSON(),
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      } catch (error) {
        return new Response(
          JSON.stringify({ error: "Failed to update item" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    }

    // DELETE /items?index=0 - remover item
    if (pathname === "/items" && method === "DELETE") {
      try {
        const index = parseInt(searchParams.get("index") || "");

        if (isNaN(index)) {
          return new Response(
            JSON.stringify({ error: "Invalid index parameter" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        await todo.removeItem(index);

        return new Response(
          JSON.stringify({ message: "Item removed successfully" }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      } catch (error) {
        return new Response(
          JSON.stringify({ error: "Failed to remove item" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  },
});

console.log(`Servidor rodando em http://localhost:${port}`);
