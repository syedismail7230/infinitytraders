const { Client } = require('pg');
const connectionString = "postgresql://neondb_owner:npg_1A2NGdHrwuoK@ep-icy-mode-atds28of.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function main() {
  const client = new Client({ connectionString });
  await client.connect();
  
  const tables = ['products', 'coupons', 'users', 'pincodes', 'orders', 'settings', 'audit_logs'];
  console.log('--- Database Row Counts ---');
  for (const table of tables) {
    const res = await client.query(`SELECT COUNT(*) FROM ${table}`);
    console.log(`${table}: ${res.rows[0].count}`);
  }
  
  const prodSample = await client.query(`SELECT id, name FROM products LIMIT 5`);
  console.log('\n--- Sample Products ---');
  prodSample.rows.forEach(p => console.log(`- [${p.id}] ${p.name}`));
  
  await client.end();
}

main().catch(console.error);
