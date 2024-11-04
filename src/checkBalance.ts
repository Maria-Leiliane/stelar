import StellarSdk from 'stellar-sdk';
import 'dotenv/config';

const publicKey = process.env.STELLAR_PUBLIC_KEY;
const server = new StellarSdk.Server(process.env.STELLAR_SERVER_URL);

if (!publicKey) throw new Error("A chave pública não está configurada no arquivo .env");

// Tipo de saldo no Stellar
type Balance = {
    asset_type: string;
    balance: string;
};

const checkBalance = async () => {
    try {
        const account = await server.loadAccount(publicKey);
        console.log('Saldos:');
        account.balances.forEach((balance: Balance) => {
            console.log(`${balance.asset_type}: ${balance.balance}`);
        });
    } catch (error) {
        console.error("Erro ao verificar saldo:", error);
    }
};

checkBalance();
