import type { Item } from "./types/type";
const filename = __dirname + "/data.todo.json";

// Adicione a capacidade de ver em que momento um item foi adicionado e/ou alterado.
// Adicione a capacidade de marcar um item como concluído. Feito
// Adicione a capacidade de filtrar itens por categoria.

const getTime = (): string => {
  const day = new Date();
  return `${day.getHours()}:${day.getMinutes()}:${day.getSeconds()}`;
};

let list: Item[] = null!;

async function loadFromFile() {
  if (list !== null) return;
  try {
    const file = Bun.file(filename);
    const content = await file.text();
    list = JSON.parse(content) as Item[];
  } catch (error) {
    Bun.write(filename, "[]");
    list = [];
  }
}

async function saveToFile() {
  await Bun.write(filename, JSON.stringify(list));
}

// CRUD - CREATE
export async function addItem(item: string) {
  await loadFromFile();
  list.push({
    task: item,
    conc: false,
    concludeDate: null,
    creationDate: getTime(),
    lastChange: null,
  });
  await saveToFile();
}

// CRUD - READ
export async function getItems() {
  await loadFromFile();
  return list;
}

// CRUD - UPDATE
export async function updateItem(index: number, newItem: string) {
  await loadFromFile();
  if (index < 0 || index >= list.length)
    throw new Error("Índice fora dos limites");
  list[index] = {
    ...(list[index] as Item),
    task: newItem,
    lastChange: getTime(),
  };
  await saveToFile();
}

// CRUD - DELETE
export async function removeItem(index: number) {
  await loadFromFile();
  if (index < 0 || index >= list.length)
    throw new Error("Índice fora dos limites");
  list.splice(index, 1);
  await saveToFile();
}

export async function concludeItem(index: number) {
  await loadFromFile();
  if (index < 0 || index >= list.length)
    throw new Error("Índice fora dos limites");
  list[index] = {
    ...(list[index] as Item),
    conc: true,
    concludeDate: getTime(),
    lastChange: getTime(),
  };
  await saveToFile();
}

// EXPORTA AS FUNÇÕES PARA USO EXTERNO
export default { addItem, getItems, updateItem, removeItem, concludeItem };
