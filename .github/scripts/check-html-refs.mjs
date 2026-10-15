// Informe de referencias locales rotas en ficheros HTML.
//
// Aviso, no veredicto: informa de `src`/`href` locales que no existen sin
// romper el gate. Exit code 0 siempre, salvo error de ejecucion.
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const listHtml = () => {
  try {
    return execSync('git ls-files "*.html"', { encoding: "utf8" })
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
};

const files = listHtml();
let rotas = 0;

for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  const matches = html.matchAll(/(?:src|href)="([^"]+)"/g);
  for (const [, raw] of matches) {
    const ref = raw.split("#")[0].split("?")[0];
    if (!ref) continue;
    if (/^(https?:|mailto:|tel:|data:|javascript:|#)/i.test(ref)) continue;
    const destino = ref.startsWith("/") ? ref.slice(1) : path.join(path.dirname(file), ref);
    if (!fs.existsSync(destino)) {
      console.log(`::warning file=${file}::${ref} no existe`);
      rotas += 1;
    }
  }
}

console.log(
  rotas === 0
    ? `ok   ${files.length} ficheros HTML, todas las referencias locales existen`
    : `${rotas} referencia(s) local(es) sin resolver en ${files.length} fichero(s) HTML`,
);
