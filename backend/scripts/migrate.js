import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import config from '../config/env.js';
import User from '../models/User.js';
import Issue from '../models/Issue.js';
import Message from '../models/Message.js';
import QuizResult from '../models/QuizResult.js';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '..', 'data');

/**
 * Read JSON file
 */
const readJSONFile = (filename) => {
  try {
    const filePath = path.join(dataDir, filename);
    if (!fs.existsSync(filePath)) {
      logger.warn(`File not found: ${filename}`);
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    logger.error(`Error reading ${filename}:`, error);
    return [];
  }
};

/**
 * Migrate users
 */
const migrateUsers = async () => {
  try {
    const users = readJSONFile('users.json');
    
    if (users.length === 0) {
      logger.info('No users to migrate');
      return {};
    }

    logger.info(`Migrating ${users.length} users...`);
    
    const userMapping = {}; // Old ID -> New ID mapping
    
    for (const user of users) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: user.email });
        
        if (existingUser) {
          userMapping[user.id] = existingUser._id;
          logger.debug(`User already exists: ${user.email}`);
          continue;
        }

        // Create new user
        const newUser = await User.create({
          name: user.name,
          email: user.email,
          password: user.password, // Already hashed
          role: user.role,
          phone: user.phone,
          studentId: user.studentId,
          verificationDocument: user.verificationDocument,
          createdAt: user.createdAt || new Date(),
        });

        userMapping[user.id] = newUser._id;
        logger.success(`Migrated user: ${user.email}`);
      } catch (error) {
        logger.error(`Error migrating user ${user.email}:`, error);
      }
    }

    logger.success(`Successfully migrated ${Object.keys(userMapping).length} users`);
    return userMapping;
  } catch (error) {
    logger.error('Error in migrateUsers:', error);
    return {};
  }
};

/**
 * Migrate issues
 */
const migrateIssues = async (userMapping) => {
  try {
    const issues = readJSONFile('issues.json');
    
    if (issues.length === 0) {
      logger.info('No issues to migrate');
      return {};
    }

    logger.info(`Migrating ${issues.length} issues...`);
    
    const issueMapping = {}; // Old ID -> New ID mapping
    
    for (const issue of issues) {
      try {
        const clientId = userMapping[issue.clientId];
        
        if (!clientId) {
          logger.warn(`Skipping issue ${issue.id}: Client not found`);
          continue;
        }

        // Check if issue already exists
        const existingIssue = await Issue.findOne({
          client: clientId,
          title: issue.title,
          createdAt: issue.createdAt,
        });

        if (existingIssue) {
          issueMapping[issue.id] = existingIssue._id;
          logger.debug(`Issue already exists: ${issue.title}`);
          continue;
        }

        // Create new issue
        const newIssue = await Issue.create({
          client: clientId,
          title: issue.title,
          description: issue.description,
          category: issue.category,
          status: issue.status,
          documents: issue.documents || [],
          createdAt: issue.createdAt || new Date(),
        });

        issueMapping[issue.id] = newIssue._id;
        logger.success(`Migrated issue: ${issue.title}`);
      } catch (error) {
        logger.error(`Error migrating issue ${issue.id}:`, error);
      }
    }

    logger.success(`Successfully migrated ${Object.keys(issueMapping).length} issues`);
    return issueMapping;
  } catch (error) {
    logger.error('Error in migrateIssues:', error);
    return {};
  }
};

/**
 * Migrate messages
 */
const migrateMessages = async (issueMapping, userMapping) => {
  try {
    const messages = readJSONFile('messages.json');
    
    if (messages.length === 0) {
      logger.info('No messages to migrate');
      return;
    }

    logger.info(`Migrating ${messages.length} messages...`);
    
    let migratedCount = 0;
    
    for (const message of messages) {
      try {
        const issueId = issueMapping[message.issueId];
        const senderId = userMapping[message.senderId];
        
        if (!issueId || !senderId) {
          logger.warn(`Skipping message ${message.id}: Issue or Sender not found`);
          continue;
        }

        // Check if message already exists
        const existingMessage = await Message.findOne({
          issue: issueId,
          sender: senderId,
          content: message.content,
          createdAt: message.createdAt,
        });

        if (existingMessage) {
          logger.debug(`Message already exists`);
          continue;
        }

        // Create new message
        await Message.create({
          issue: issueId,
          sender: senderId,
          content: message.content,
          isRead: message.isRead || false,
          createdAt: message.createdAt || new Date(),
        });

        migratedCount++;
      } catch (error) {
        logger.error(`Error migrating message ${message.id}:`, error);
      }
    }

    logger.success(`Successfully migrated ${migratedCount} messages`);
  } catch (error) {
    logger.error('Error in migrateMessages:', error);
  }
};

/**
 * Migrate quiz results
 */
const migrateQuizResults = async (userMapping) => {
  try {
    const quizResults = readJSONFile('quizResults.json');
    
    if (quizResults.length === 0) {
      logger.info('No quiz results to migrate');
      return;
    }

    logger.info(`Migrating ${quizResults.length} quiz results...`);
    
    let migratedCount = 0;
    
    for (const result of quizResults) {
      try {
        const userId = userMapping[result.userId];
        
        if (!userId) {
          logger.warn(`Skipping quiz result: User not found`);
          continue;
        }

        // Check if result already exists
        const existingResult = await QuizResult.findOne({
          user: userId,
          quizId: result.quizId,
          submittedAt: result.submittedAt,
        });

        if (existingResult) {
          logger.debug(`Quiz result already exists`);
          continue;
        }

        // Create new quiz result
        await QuizResult.create({
          user: userId,
          quizId: result.quizId,
          quizTitle: result.quizTitle,
          score: result.score,
          totalQuestions: result.totalQuestions,
          submittedAt: result.submittedAt || new Date(),
        });

        migratedCount++;
      } catch (error) {
        logger.error(`Error migrating quiz result:`, error);
      }
    }

    logger.success(`Successfully migrated ${migratedCount} quiz results`);
  } catch (error) {
    logger.error('Error in migrateQuizResults:', error);
  }
};

/**
 * Main migration function
 */
const migrate = async () => {
  try {
    logger.info('Starting migration from JSON to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    logger.success('Connected to MongoDB');

    // Migrate in order (respecting foreign key relationships)
    const userMapping = await migrateUsers();
    const issueMapping = await migrateIssues(userMapping);
    await migrateMessages(issueMapping, userMapping);
    await migrateQuizResults(userMapping);

    logger.success('Migration completed successfully!');
    
    // Print statistics
    const userCount = await User.countDocuments();
    const issueCount = await Issue.countDocuments();
    const messageCount = await Message.countDocuments();
    const quizResultCount = await QuizResult.countDocuments();

    logger.info('\n=== Database Statistics ===');
    logger.info(`Users: ${userCount}`);
    logger.info(`Issues: ${issueCount}`);
    logger.info(`Messages: ${messageCount}`);
    logger.info(`Quiz Results: ${quizResultCount}`);
    logger.info('===========================\n');

  } catch (error) {
    logger.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run migration
migrate();
