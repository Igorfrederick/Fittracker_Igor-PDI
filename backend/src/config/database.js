/**
 * Configuração de conexão com MongoDB
 * 
 * Este arquivo gerencia a conexão com o MongoDB Atlas.
 * A connection string deve ser configurada no arquivo .env
 */

const mongoose = require('mongoose');

/**
 * Conecta ao MongoDB Atlas
 * 
 * @returns {Promise<void>}
 * @throws {Error} Se a conexão falhar
 */
const connectDB = async () => {
  try {
    // Opções de conexão recomendadas para MongoDB Atlas
    const options = {
      // useNewUrlParser e useUnifiedTopology são padrão no Mongoose 6+
      // Mantemos explícito para clareza
    };

    // Tenta conectar ao banco
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    
    // Listeners para eventos de conexão
    mongoose.connection.on('error', (err) => {
      console.error(`❌ Erro na conexão MongoDB: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB desconectado');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔌 Conexão MongoDB fechada devido ao encerramento da aplicação');
      process.exit(0);
    });

  } catch (error) {
    console.error(`❌ Erro ao conectar ao MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
