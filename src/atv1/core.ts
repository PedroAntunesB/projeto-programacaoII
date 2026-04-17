import type { Item } from "./types/type";
const filename = __dirname + "/data.todo.json";

const getTime = (): string => {
  const day = new Date();
  return `${day.getDate()}/${day.getUTCMonth() + 1}/${day.getFullYear()} às ${day.getHours()}:${day.getMinutes()}:${day.getSeconds()}`;
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

  list.forEach((el) => {
    if (el.task === item) {
      throw new Error("Esta tarefa já esta cadastrada");
    }
  });

  list.push({
    task: item,
    conc: false,
    concludeDate: null,
    creationDate: getTime(),
    lastChange: null,
    category: null,
  });
  await saveToFile();
}

// CRUD - READ
export async function getItems(filter: null | string = null) {
  await loadFromFile();
  if (!filter) return list;
  if (filter === "conclude") return list.filter((item) => item.conc);
  if (filter === "no-conclude") return list.filter((item) => !item.conc);

  return list.filter((item) => item.category?.includes(filter));
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

export async function clearList() {
  list = [];
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

export async function pushCategory(newCategory: string, index: number) {
  await loadFromFile();
  if (index < 0 || index >= list.length)
    throw new Error("Índice fora dos limites");

  if (!list[index]?.category) {
    list[index] = {
      ...(list[index] as Item),
      category: [],
      lastChange: getTime(),
    };
  }

  if (list[index].category?.includes(newCategory))
    throw new Error("Esta tarefa já tem essa categoria");

  list[index].category?.push(newCategory);

  await saveToFile();
}

// EXPORTA AS FUNÇÕES PARA USO EXTERNO
export default {
  addItem,
  getItems,
  updateItem,
  removeItem,
  concludeItem,
  pushCategory,
  clearList,
};
