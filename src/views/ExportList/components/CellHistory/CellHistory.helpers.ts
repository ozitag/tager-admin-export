export function dateTimeFormat(value: number | string | Date): string {
  const options = {
    /*year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',*/
  };
  const date = new Date(value);
  return new Intl.DateTimeFormat('ru-RU', options).format(date);
}
