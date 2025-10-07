interface ILabel<T> {
  label: T;
}

const stringLabel: ILabel<string> = {
  label: "hello",
}

const numberLabel: ILabel<number> = {
  label: 100,
}

const booleanLabel: ILabel<boolean> = {
  label: false,
}