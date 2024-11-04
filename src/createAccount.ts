import StellarSdk from 'stellar-sdk';
import 'dotenv/config';

// Configuração para rede de testes
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
const sourceSecret = process.env.STELLAR_SECRET_KEY;  // Carrega a chave privada do .env
const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecret);
const destinationKeypair = StellarSdk.Keypair.random();  // Cria uma nova conta aleatória para receber o pagamento

(async () => {
  try {
    const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

    // Construir a transação com create_account_op e payment_op
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: await server.fetchBaseFee(),
      networkPassphrase: StellarSdk.Networks.TESTNET
    })
      .addOperation(StellarSdk.Operation.createAccount({
        destination: destinationKeypair.publicKey(),
        startingBalance: '2'  // Define o saldo inicial da nova conta
      }))
      .addOperation(StellarSdk.Operation.payment({
        destination: destinationKeypair.publicKey(),
        asset: StellarSdk.Asset.native(),
        amount: '10'  // Valor a ser enviado
      }))
      .setTimeout(30)
      .build();

    transaction.sign(sourceKeypair);
    const result = await server.submitTransaction(transaction);
    console.log('Transaction successful! Hash:', result.hash);
  } catch (error) {
    console.error('Transaction failed:', error);
  }
})();
