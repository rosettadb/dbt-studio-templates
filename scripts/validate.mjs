// Checks every products/<id>/product.json against schema/product.schema.json
// and the rules a schema cannot express. Run by .github/workflows/validate.yml:
//
//   npm install --no-save ajv@8 && node scripts/validate.mjs
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import Ajv from 'ajv';

const THIS_REPO = 'rosettadb/dbt-studio-templates';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(JSON.parse(readFileSync(path.join(root, 'schema', 'product.schema.json'), 'utf8')));

let problems = 0;
const fail = (dir, msg) => {
  problems++;
  console.log(`::error file=products/${dir}/product.json::${msg}`);
};

const productsDir = path.join(root, 'products');
for (const dir of readdirSync(productsDir).sort()) {
  const folder = path.join(productsDir, dir);
  if (!statSync(folder).isDirectory()) continue;
  const file = path.join(folder, 'product.json');
  if (!existsSync(file)) {
    fail(dir, 'product.json is missing');
    continue;
  }
  if (statSync(file).size > 64 * 1024) fail(dir, 'product.json is larger than 64 KB');
  let m;
  try {
    m = JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    fail(dir, `not valid JSON: ${e.message}`);
    continue;
  }
  if (!validate(m)) {
    for (const e of validate.errors) fail(dir, `${e.instancePath || '/'} ${e.message}`);
    continue;
  }
  if (m.id !== dir) fail(dir, `id "${m.id}" must equal the folder name "${dir}"`);
  const inRepo = (m.source.repo ?? '').toLowerCase() === THIS_REPO;
  if (m.type !== 'dataset' && !m.source.ref && !inRepo) {
    fail(dir, 'source.ref (the full commit SHA) is required for a repository other than this one');
  }
  if (m.type === 'pipeline' && inRepo && !m.source.ref && !existsSync(path.join(root, m.source.path))) {
    fail(dir, `source.path "${m.source.path}" is not in this repository`);
  }
  if (m.logo) {
    const logo = path.join(folder, m.logo);
    if (!existsSync(logo)) fail(dir, `logo "${m.logo}" is not in the product's folder`);
    else if (statSync(logo).size > 2 * 1024 * 1024) fail(dir, 'the logo is larger than 2 MB');
  }
  const readme = path.join(folder, 'README.md');
  if (existsSync(readme) && statSync(readme).size > 100 * 1024) fail(dir, 'README.md is larger than 100 KB');
}

if (problems) {
  console.log(`${problems} problem(s)`);
  process.exit(1);
}
console.log('all products are valid');
