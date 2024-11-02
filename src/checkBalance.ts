import stellarSdk from 'stellar-sdk';
import * as dotenv from 'dotenv';

// Carrega o arquivo .env
dotenv.config();

// Recupera as chaves do .env
const publicKey = process.env.STELLAR_PUBLIC_KEY;
const secretKey = process.env.STELLAR_SECRET_KEY;

if (!publicKey || !secretKey) {
    throw new Error("As chaves Stellar não estão configuradas no arquivo .env");
}

// Exemplo de função para verificar saldo
const checkBalance = async () => {
    const Server = stellarSdk.Server;
    const server = new Server('https://horizon.stellar.org');
    const account = await server.loadAccount(publicKey);

    console.log('Saldos:');
    account.balances.forEach((balance: { asset_type: any; balance: any; }) => {
        console.log(`${balance.asset_type}: ${balance.balance}`);
    });
};

checkBalance().catch(error => console.error("Erro ao verificar saldo:", error));
