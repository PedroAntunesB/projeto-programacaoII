import { ToDo, Item } from './core.ts';

const file = process.argv[2]
const command = process.argv[3];

if (!file) {
  console.error("Por favor, forneça o caminho do arquivo.");
  process.exit(1);
}

const todo = new ToDo(file);

if (command === "add") {
  const itemDescription = process.argv[4];
  
  if (!itemDescription) {
    console.error("Por favor, forneça uma descrição para o item.");
    process.exit(1);
  }

  const item = new Item(itemDescription);
  await todo.addItem(item);
  console.log(`Item "${itemDescription}" adicionado com sucesso!`);
  process.exit(0);
}

if (command === "list") {
  const items = await todo.getItems();

  if (items.length === 0) {
    console.log("Nenhum item na lista.");
    process.exit(0);
  }

  console.log("Lista de itens:");
  items.forEach((item, index) => console.log(`${index}: ${item.toJSON().description}`));
  process.exit(0);
}

if (command === "update") {
  const index = process.argv[4];
  const newDescription = process.argv[5];

  if (!index || !newDescription) {
    console.error("Por favor, forneça um índice válido e uma nova descrição.");
    process.exit(1);
  }
  await todo.updateItem(parseInt(index), new Item(newDescription));
  console.log(`Item no índice ${index} atualizado para "${newDescription}".`);
  process.exit(0);
}

if (command === "remove") {
  const index = process.argv[4];

  if (!index) {
    console.error("Por favor, forneça um índice válido para remover.");
    process.exit(1);
  }
  await todo.removeItem(parseInt(index));
  console.log(`Item no índice ${index} removido com sucesso!`);
  process.exit(0);
}

console.error("Comando desconhecido. Use 'add', 'list', 'update' ou 'remove'.");
process.exit(1);