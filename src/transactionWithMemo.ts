import StellarSdk from 'stellar-sdk';
import 'dotenv/config';

// Configuração para rede de testes
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
const sourceSecret = process.env.STELLAR_SECRET_KEY;  // Chave privada carregada do .env
const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecret);
const destinationKeypair = StellarSdk.Keypair.random();  // Cria uma nova conta aleatória para receber o pagamento

(async () => {
  try {
    const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

    // Construir a transação com create_account_op e memo
    const transactionWithMemo = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: await server.fetchBaseFee(),
      networkPassphrase: StellarSdk.Networks.TESTNET
    })
      .addOperation(StellarSdk.Operation.createAccount({
        destination: destinationKeypair.publicKey(),
        startingBalance: '2'
      }))
      .addMemo(StellarSdk.Memo.text('DEV30K'))  // Adicionando o Memo
      .setTimeout(30)
      .build();

    transactionWithMemo.sign(sourceKeypair);
    const resultMemo = await server.submitTransaction(transactionWithMemo);
    console.log('Transaction with Memo successful! Hash:', resultMemo.hash);
  } catch (error) {
    console.error('Transaction with Memo failed:', error);
  }
})();
