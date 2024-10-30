import * as dotenv from 'dotenv';
import * as Random from 'expo-random';
import { Keypair } from '@stellar/stellar-sdk';

// Carrega o arquivo .env
dotenv.config();

const generateRandomKeypair = async () => {
  const randomBytes = await Random.getRandomBytesAsync(32);
  const keypair = Keypair.fromRawEd25519Seed(Buffer.from(randomBytes));

  console.log('Chave Pública:', keypair.publicKey());
  console.log('Chave Privada:', keypair.secret());

  // Se quiser usar a URL do servidor a partir do .env
  const serverUrl = process.env.STELLAR_SERVER_URL;
  console.log('URL do Servidor Stellar:', serverUrl);
};

// Chame a função para gerar as chaves
generateRandomKeypair();
