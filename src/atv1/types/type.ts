export type Item = {
  task: string;
  creationDate: string;
  concludeDate: string | null;
  lastChange: string | null;
  conc: boolean;
  category: string[] | null;
};
