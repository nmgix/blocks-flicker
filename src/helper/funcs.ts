export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomIntFloating(min: number, max: number, fixed: number = 3) {
  return Number(Number(Math.random() * (max - min) + min).toFixed(fixed));
}

export function getRandomArrayItem(array: any[]) {
  return array[Math.floor(Math.random() * array.length)];
}

// https://stackoverflow.com/a/55671924
export function weighted_random(options: { item: number | string; weight: number }[]) {
  let i;

  let weights = [options[0].weight];

  for (i = 1; i < options.length; i++) weights[i] = options[i].weight + weights[i - 1];

  let random = Math.random() * weights[weights.length - 1];

  for (i = 0; i < weights.length; i++) if (weights[i] > random) break;

  return options[i].item;
}

// https://stackoverflow.com/a/8189268
export function chunkify(a: any[], n: number, balanced: boolean = true) {
  if (n < 2) return [a];

  var len = a.length,
    out = [],
    i = 0,
    size;

  if (len % n === 0) {
    size = Math.floor(len / n);
    while (i < len) {
      out.push(a.slice(i, (i += size)));
    }
  } else if (balanced) {
    while (i < len) {
      size = Math.ceil((len - i) / n--);
      out.push(a.slice(i, (i += size)));
    }
  } else {
    n--;
    size = Math.floor(len / n);
    if (len % size === 0) size--;
    while (i < size * n) {
      out.push(a.slice(i, (i += size)));
    }
    out.push(a.slice(size * n));
  }

  return out;
}
