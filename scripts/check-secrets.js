#!/usr/bin/env node

/**
 * Script para verificar que las variables de entorno están configuradas
 */

const requiredSecrets = [
  'LOGIN_USERNAME',
  'LOGIN_PASSWORD', 
  'BASE_URL'
];

console.log('🔍 Verificando configuración de secrets...\n');

let allConfigured = true;

requiredSecrets.forEach(secret => {
  const value = process.env[secret];
  if (value) {
    console.log(`✅ ${secret}: Configurado`);
  } else {
    console.log(`❌ ${secret}: NO configurado`);
    allConfigured = false;
  }
});

console.log('\n📋 Configuración actual:');
console.log(`LOGIN_USERNAME: ${process.env.LOGIN_USERNAME ? '***configurado***' : '❌ no configurado'}`);
console.log(`LOGIN_PASSWORD: ${process.env.LOGIN_PASSWORD ? '***configurado***' : '❌ no configurado'}`);
console.log(`BASE_URL: ${process.env.BASE_URL ? '***configurado***' : '❌ no configurado'}`);

if (allConfigured) {
  console.log('\n🎉 Todos los secrets están configurados correctamente!');
  process.exit(0);
} else {
  console.log('\n⚠️  Algunos secrets no están configurados.');
  console.log('💡 Para configurar localmente:');
  console.log('   1. Copia env.example a .env');
  console.log('   2. Edita .env con tus valores');
  console.log('   3. O configura las variables de entorno del sistema');
  process.exit(1);
}
