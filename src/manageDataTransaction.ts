import 'dotenv/config';
import StellarSdk from 'stellar-sdk';

// Configuração para rede principal
const server = new StellarSdk.Server('https://horizon.stellar.org');
const sourceSecret = process.env.STELLAR_SECRET_KEY;  // Chave privada carregada do .env
const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecret);
const destinationKeypair = StellarSdk.Keypair.random();

const message = 'DEV30K';

// Assinatura da mensagem "DEV30K" usando a chave privada da conta
const signature = sourceKeypair.sign(Buffer.from(message)).toString('base64');

(async () => {
  try {
    const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

    // Construir a transação com manageData_op e memo
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: await server.fetchBaseFee(),
      networkPassphrase: StellarSdk.Networks.PUBLIC  // Mainnet
    })
      .addOperation(StellarSdk.Operation.manageData({
        name: 'DEV30K Signature',
        value: signature  // Assinatura codificada
      }))
      .addMemo(StellarSdk.Memo.text('DEV30K'))
      .setTimeout(30)
      .build();

    transaction.sign(sourceKeypair);
    const result = await server.submitTransaction(transaction);
    console.log('Transaction with manageData successful! Hash:', result.hash);
  } catch (error) {
    console.error('Transaction with manageData failed:', error);
  }
})();
