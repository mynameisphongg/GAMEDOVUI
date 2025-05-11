const mongoose = require('mongoose');
require('dotenv').config();

// Connection strings
const LOCAL_MONGODB_URI = 'mongodb://localhost:27017/quiz_game';
const ATLAS_MONGODB_URI = 'mongodb+srv://nguyenthanhtungsexgay:NTT123@cluster1.rqsv34t.mongodb.net/quiz_game?retryWrites=true&w=majority';

// Connect to local MongoDB
const localConnection = mongoose.createConnection(LOCAL_MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
});

// Connect to Atlas MongoDB
const atlasConnection = mongoose.createConnection(ATLAS_MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    authSource: 'admin'
});

// Define schemas
const PlayerSchema = new mongoose.Schema({}, { strict: false });
const QuestionSchema = new mongoose.Schema({}, { strict: false });

// Create models
const LocalPlayer = localConnection.model('Player', PlayerSchema);
const LocalQuestion = localConnection.model('Question', QuestionSchema);
const AtlasPlayer = atlasConnection.model('Player', PlayerSchema);
const AtlasQuestion = atlasConnection.model('Question', QuestionSchema);

async function migrateData() {
    try {
        console.log('Starting data migration...');
        console.log('Testing connections...');

        // Test connections
        await localConnection.asPromise();
        console.log('Local MongoDB connection successful');
        
        await atlasConnection.asPromise();
        console.log('Atlas MongoDB connection successful');

        // Clear existing data in Atlas (optional)
        console.log('Clearing existing data in Atlas...');
        await AtlasPlayer.deleteMany({});
        await AtlasQuestion.deleteMany({});

        // Migrate players
        console.log('Migrating players...');
        const players = await LocalPlayer.find({});
        if (players.length > 0) {
            await AtlasPlayer.insertMany(players);
            console.log(`Migrated ${players.length} players`);
        } else {
            console.log('No players found to migrate');
        }

        // Migrate questions
        console.log('Migrating questions...');
        const questions = await LocalQuestion.find({});
        if (questions.length > 0) {
            await AtlasQuestion.insertMany(questions);
            console.log(`Migrated ${questions.length} questions`);
        } else {
            console.log('No questions found to migrate');
        }

        console.log('Data migration completed successfully!');
    } catch (error) {
        console.error('Error during migration:', error);
        if (error.name === 'MongoServerError') {
            console.error('MongoDB connection error details:', {
                code: error.code,
                codeName: error.codeName,
                message: error.message
            });
        }
    } finally {
        // Close connections
        await localConnection.close();
        await atlasConnection.close();
        console.log('Database connections closed');
    }
}

// Run migration
migrateData(); 