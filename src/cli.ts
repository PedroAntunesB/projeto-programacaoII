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
  const items = await todo.getItems();
  if (items.length === 0) {
    console.log("Nenhum item na lista.");
    process.exit(0);
  }

  console.log("Lista de itens:");

  const showItem = (item: Item): string => {
    return `\nTarefa: ${item.task} \tSituação: ${item.conc ? "concluida" : "não concluida"} \tData de Criação: ${item.creationDate} \tData de conclusão: ${!item.concludeDate ? "tarefa não concluida" : item.concludeDate} \t ${!item.lastChange ? "" : "Ultima Alteração: " + item.lastChange}`;
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
    console.error(String(error));
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

if (command === "complete-task") {
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

console.error("Comando desconhecido. Use 'add', 'list', 'update' ou 'remove'.");
process.exit(1);
