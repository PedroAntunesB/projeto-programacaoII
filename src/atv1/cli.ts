import todo from "./core.ts";
import type { Item } from "./types/type";

const command = process.argv[2];

if (command === "add") {
  const item = process.argv[3];
  if (!item) {
    console.error("Por favor, forneça um item para adicionar.");
    process.exit(1);
  }
  await todo.addItem(item);
  console.log(`Item "${item}" adicionado com sucesso!`);
  process.exit(0);
}

if (command === "list") {
  const category = process.argv[3];
  const items = await todo.getItems(category);
  if (items.length === 0) {
    console.log("Nenhum item na lista.");
    process.exit(0);
  }

  console.log(`Lista de itens${!category ? "" : " da categoria " + category}:`);

  const showItem = (item: Item): string => {
    return `\nTarefa: ${item.task} \nSituação: ${item.conc ? "concluida" : "não concluida"} \nCategorias: ${!item.category ? "Nenhuma categoria nesta tarefa" : item.category} \nData de Criação: ${item.creationDate} \nData de conclusão: ${!item.concludeDate ? "tarefa não concluida" : item.concludeDate} \n${!item.lastChange ? "" : "Ultima Alteração: " + item.lastChange}`;
  };

  items.forEach((item, index) => {
    console.log(`${index}: ${showItem(item)}\n`);
  });
  process.exit(0);
}

if (command === "update") {
  const index = parseInt(process.argv[3] as string);
  const newItem = process.argv[4];
  if (isNaN(index) || !newItem) {
    console.error("Por favor, forneça um índice válido e um novo item.");
    process.exit(1);
  }

  try {
    await todo.updateItem(index, newItem);
    console.log(`Item no índice ${index} atualizado para "${newItem}".`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
  process.exit(0);
}

if (command === "remove") {
  const index = parseInt(process.argv[3] as string);
  if (isNaN(index)) {
    console.error("Por favor, forneça um índice válido para remover.");
    process.exit(1);
  }

  try {
    await todo.removeItem(index);
    console.log(`Item no índice ${index} removido com sucesso.`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
  process.exit(0);
}

if (command === "conclude-task") {
  const index = parseInt(process.argv[3] as string);
  if (isNaN(index)) {
    console.error(
      "Por favor, forneça um índice de uma tarefa válida para concluir.",
    );
    process.exit(1);
  }

  try {
    await todo.concludeItem(index);
    console.log(`Item no índice ${index} concluido com sucesso.`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
  process.exit(0);
}

if (command === "push-category") {
  const index = parseInt(process.argv[3] as string);
  const category = process.argv[4];

  if (isNaN(index)) {
    console.error(
      "Por favor, forneça um índice de uma tarefa válida para concluir.",
    );
    process.exit(1);
  }

  if (!category) {
    console.error("Por favor, escreva a categoria em um formato válido");
  }

  try {
    await todo.pushCategory(category as string, index);
    console.log(`Categoria adicionada no indice ${index} com sucesso.`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
  process.exit(0);
}

if (command === "clear") {
  todo.clearList();
  console.log("Lista limpa com sucesso");
  process.exit(0);
}

if (command === "help") {
  console.log("Lista de comandos disponiveis atualmente:");
  console.log("- add");
  console.log("- update");
  console.log("- list");
  console.log("- remove");
  console.log("- conclude-task");
  console.log("- push-category");
  console.log("- clear");
  process.exit(0);
}

console.error(
  "Comando desconhecido. Digite 'bun run cli help' para saber os comandos disponiveis",
);
process.exit(1);
